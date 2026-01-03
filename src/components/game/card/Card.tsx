import { useSoundEffect } from "@/primitives/use-sound-effect";
import { type Component } from "solid-js";
import style from "./card.module.css";

interface CardProps {
  isFlipped: boolean;
  onClick: () => void;
  frontImage: string;
  soundEnabled: () => boolean;
}

export const Card: Component<CardProps> = (props) => {
  useSoundEffect("/card-flip.mp3", () => props.isFlipped, {
    defer: false,
    enabled: props.soundEnabled,
  });

  return (
    <div class={style["card-container"]} onClick={props.onClick}>
      <div
        classList={{
          [style.card]: true,
          [style.flipped]: props.isFlipped,
        }}
      >
        <img src={props.frontImage} alt="front" class={style.front} />
        <img src="/card-back.svg" alt="back" class={style.back} />
      </div>
    </div>
  );
};
