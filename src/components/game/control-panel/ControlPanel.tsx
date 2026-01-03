import { A } from "@solidjs/router";
import { type Component } from "solid-js";
import { HomeIcon } from "../../icons/HomeIcon";
import { RetryIcon } from "../../icons/RetryIcon";
import { VolumeIcon } from "../../icons/VolumeIcon";
import style from "./control-panel.module.css";
import { LifeContainer } from "./LifeContainer";

interface ControlPanelProps {
  lives: number;
  onRetry: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ControlPanel: Component<ControlPanelProps> = (props) => {
  return (
    <div class={style.panel}>
      <A href="/" class={style["icon-button"]} title="Home">
        <HomeIcon />
      </A>

      <div class={style.divider} />

      <LifeContainer lives={props.lives} />

      <div class={style.divider} />

      <button
        class={style["icon-button"]}
        onClick={props.onToggleMute}
        title={props.isMuted ? "Unmute" : "Mute"}
      >
        <VolumeIcon isMuted={props.isMuted} />
      </button>

      <button
        class={style["icon-button"]}
        onClick={props.onRetry}
        title="Retry"
      >
        <RetryIcon />
      </button>
    </div>
  );
};
