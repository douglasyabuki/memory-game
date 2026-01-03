import { createEffect, on, type Accessor } from "solid-js";

const lastPlayedMap: Record<string, number> = {};

export const useSoundEffect = <T>(
  url: string,
  trigger: Accessor<T>,
  options: {
    defer?: boolean;
    enabled?: Accessor<boolean> | boolean;
    volume?: number;
  } = {
    defer: true,
    enabled: true,
    volume: 0.5,
  }
) => {
  const audio = new Audio(url);
  audio.volume = options.volume ?? 0.5;

  createEffect(
    on(
      trigger,
      () => {
        const isEnabled =
          typeof options.enabled === "function"
            ? options.enabled()
            : options.enabled ?? true;

        if (isEnabled) {
          const now = Date.now();
          const lastPlayed = lastPlayedMap[url] || 0;

          if (now - lastPlayed > 50) {
            lastPlayedMap[url] = now;
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
        }
      },
      { defer: options.defer }
    )
  );
};
