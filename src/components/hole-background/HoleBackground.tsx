import {
  type Component,
  type ComponentProps,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";
import style from "./hole-background.module.css";

const ROTATION_SPEED = 0.0005;

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Disc extends Geometry {
  p: number;
}

interface Particle {
  x: number;
  y: number;
  sx: number;
  dx: number;
  vy: number;
  p: number;
  r: number;
  c: string;
}

interface ParticleArea {
  sw: number;
  ew: number;
  h: number;
  sx: number;
  ex: number;
}

interface Clip {
  disc?: Disc;
  i?: number;
  path?: Path2D;
}

interface HoleBackgroundProps extends ComponentProps<"div"> {
  strokeColor?: string;
  numberOfLines?: number;
  numberOfDiscs?: number;
  particleRGBColor?: [number, number, number];
}

export const HoleBackground: Component<HoleBackgroundProps> = (props) => {
  const merged = mergeProps(
    {
      strokeColor: "rgba(0, 248, 241, 0.5)",
      numberOfLines: 50,
      numberOfDiscs: 50,
      particleRGBColor: [0, 248, 241] as [number, number, number],
    },
    props
  );

  const [local, others] = splitProps(merged, [
    "strokeColor",
    "numberOfLines",
    "numberOfDiscs",
    "particleRGBColor",
    "class",
    "children",
  ]);

  let canvasRef: HTMLCanvasElement | undefined;
  let animationFrameId: number = 0;

  // We use a plain object for state to mirroring React's useRef
  // These values are mutated in the animation loop and do not need to trigger solid signals
  const state = {
    discs: [] as Disc[],
    lines: [] as Point[][],
    particles: [] as Particle[],
    clip: {} as Clip,
    startDisc: { x: 0, y: 0, w: 0, h: 0 } as Geometry,
    endDisc: { x: 0, y: 0, w: 0, h: 0 } as Geometry,
    rect: { width: 0, height: 0 },
    render: { width: 0, height: 0, dpi: 1 },
    particleArea: { sw: 0, ew: 0, h: 0, sx: 0, ex: 0 } as ParticleArea,
    linesCanvas: null as HTMLCanvasElement | null,
  };

  const linear = (p: number) => p;
  const easeInExpo = (p: number) => (p === 0 ? 0 : Math.pow(2, 10 * (p - 1)));

  const tweenValue = (
    start: number,
    end: number,
    p: number,
    ease: "inExpo" | null = null
  ) => {
    const delta = end - start;
    const easeFn = ease === "inExpo" ? easeInExpo : linear;
    return start + delta * easeFn(p);
  };

  const tweenDisc = (disc: Disc) => {
    const { startDisc, endDisc } = state;
    disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
    disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, "inExpo");
    disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
    disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);
  };

  const setSize = () => {
    const canvas = canvasRef;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    state.rect = { width: rect.width, height: rect.height };
    state.render = {
      width: rect.width,
      height: rect.height,
      dpi: window.devicePixelRatio || 1,
    };
    canvas.width = state.render.width * state.render.dpi;
    canvas.height = state.render.height * state.render.dpi;
  };

  const setDiscs = () => {
    const { width, height } = state.rect;
    state.discs = [];
    state.startDisc = {
      x: width * 0.5,
      y: height * 0.45,
      w: width * 0.75,
      h: height * 0.7,
    };
    state.endDisc = {
      x: width * 0.5,
      y: height * 0.95,
      w: 0,
      h: 0,
    };
    let prevBottom = height;
    state.clip = {};
    for (let i = 0; i < local.numberOfDiscs; i++) {
      const p = i / local.numberOfDiscs;
      const disc = { p, x: 0, y: 0, w: 0, h: 0 };
      tweenDisc(disc);
      const bottom = disc.y + disc.h;
      if (bottom <= prevBottom) {
        state.clip = { disc: { ...disc }, i };
      }
      prevBottom = bottom;
      state.discs.push(disc);
    }
    const clipPath = new Path2D();
    const disc = state.clip.disc;
    if (disc) {
      clipPath.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      clipPath.rect(disc.x - disc.w, 0, disc.w * 2, disc.y);
      state.clip.path = clipPath;
    }
  };

  const setLines = () => {
    const { width, height } = state.rect;
    state.lines = [];
    const linesAngle = (Math.PI * 2) / local.numberOfLines;
    for (let i = 0; i < local.numberOfLines; i++) {
      state.lines.push([]);
    }
    state.discs.forEach((disc: Disc) => {
      for (let i = 0; i < local.numberOfLines; i++) {
        const angle = i * linesAngle;
        const p = {
          x: disc.x + Math.cos(angle) * disc.w,
          y: disc.y + Math.sin(angle) * disc.h,
        };
        state.lines[i].push(p);
      }
    });

    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return;

    state.lines.forEach((line: Point[]) => {
      ctx.save();
      let lineIsIn = false;
      line.forEach((p1: Point, j: number) => {
        if (j === 0) return;
        const p0 = line[j - 1];
        if (
          !lineIsIn &&
          state.clip.path &&
          (ctx.isPointInPath(state.clip.path, p1.x, p1.y) ||
            ctx.isPointInStroke(state.clip.path, p1.x, p1.y))
        ) {
          lineIsIn = true;
        } else if (lineIsIn && state.clip.path) {
          ctx.clip(state.clip.path);
        }
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = local.strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });
      ctx.restore();
    });
    state.linesCanvas = offCanvas;
  };

  const initParticle = (start: boolean = false) => {
    const sx = state.particleArea.sx + state.particleArea.sw * Math.random();
    const ex = state.particleArea.ex + state.particleArea.ew * Math.random();
    const dx = ex - sx;
    const y = start
      ? state.particleArea.h * Math.random()
      : state.particleArea.h;
    const r = 0.5 + Math.random() * 4;
    const vy = 0.5 + Math.random();
    return {
      x: sx,
      sx,
      dx,
      y,
      vy,
      p: 0,
      r,
      c: `rgba(${local.particleRGBColor[0]}, ${local.particleRGBColor[1]}, ${
        local.particleRGBColor[2]
      }, ${Math.random()})`,
    };
  };

  const setParticles = () => {
    const { width, height } = state.rect;
    state.particles = [];
    const disc = state.clip.disc;
    if (!disc) return;
    state.particleArea = {
      sw: disc.w * 0.5,
      ew: disc.w * 2,
      h: height * 0.85,
    } as ParticleArea;
    state.particleArea.sx = (width - state.particleArea.sw) / 2;
    state.particleArea.ex = (width - state.particleArea.ew) / 2;
    const totalParticles = 100;
    for (let i = 0; i < totalParticles; i++) {
      state.particles.push(initParticle(true));
    }
  };

  const drawDiscs = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = local.strokeColor;
    ctx.lineWidth = 2;
    const outerDisc = state.startDisc;
    ctx.beginPath();
    ctx.ellipse(
      outerDisc.x,
      outerDisc.y,
      outerDisc.w,
      outerDisc.h,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.closePath();

    const clipDisc = state.clip.disc;

    state.discs.forEach((disc: Disc, i: number) => {
      if (i % 5 !== 0) return;
      const shouldClip = clipDisc && disc.w < clipDisc.w - 5;
      if (shouldClip) {
        ctx.save();
        if (state.clip.path) ctx.clip(state.clip.path);
      }
      ctx.beginPath();
      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      if (shouldClip) {
        ctx.restore();
      }
    });
  };

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    if (state.linesCanvas) {
      ctx.drawImage(state.linesCanvas, 0, 0);
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    if (state.clip.path) ctx.clip(state.clip.path);
    state.particles.forEach((particle: Particle) => {
      ctx.fillStyle = particle.c;
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, particle.r, particle.r);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  };

  const moveDiscs = () => {
    state.discs.forEach((disc: Disc) => {
      disc.p = (disc.p + ROTATION_SPEED) % 1;
      tweenDisc(disc);
    });
  };

  const moveParticles = () => {
    state.particles.forEach((particle: Particle, idx: number) => {
      particle.p = 1 - particle.y / state.particleArea.h;
      particle.x = particle.sx + particle.dx * particle.p;
      particle.y -= particle.vy;
      if (particle.y < 0) {
        state.particles[idx] = initParticle();
      }
    });
  };

  const tick = () => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(state.render.dpi, state.render.dpi);
    moveDiscs();
    moveParticles();
    drawDiscs(ctx);
    drawLines(ctx);
    drawParticles(ctx);
    ctx.restore();
    animationFrameId = requestAnimationFrame(tick);
  };

  const init = () => {
    setSize();
    setDiscs();
    setLines();
    setParticles();
  };

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    init();
    tick();

    const handleResize = () => {
      setSize();
      setDiscs();
      setLines();
      setParticles();
    };
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    });
  });

  return (
    <div
      classList={{
        [style["hole-background-container"]]: true,
        [local.class || ""]: true,
      }}
      {...others}
    >
      {local.children}
      <canvas
        ref={canvasRef}
        classList={{ [style["hole-background-canvas"]]: true }}
      />
      <div classList={{ [style["hole-background-gradient"]]: true }} />
      <div classList={{ [style["hole-background-grid"]]: true }} />
    </div>
  );
};
