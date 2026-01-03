import { type GameCard } from "@/types-and-variables/game-card";
import type { GameDifficulty } from "@/types-and-variables/game-difficulty";
import { type Component, Index } from "solid-js";
import { Card } from "../card/Card";
import style from "./board.module.css";

interface BoardProps {
  cards: GameCard[];
  onFlip: (id: string) => void;
  soundEnabled: () => boolean;
  difficulty: GameDifficulty;
}

const getColumns = (difficulty: GameDifficulty) => {
  switch (difficulty) {
    case "easy":
      return 6;
    case "medium":
      return 6;
    case "hard":
      return 8;
    case "expert":
      return 8;
    case "hell":
      return 10;
    default:
      return 6;
  }
};

export const Board: Component<BoardProps> = (props) => {
  return (
    <div
      class={style.board}
      style={{ "--col-count": getColumns(props.difficulty) }}
    >
      <Index each={props.cards}>
        {(card) => (
          <div class={style["card-wrapper"]}>
            <Card
              isFlipped={card().isFlipped && !card().isMatched}
              onClick={() => props.onFlip(card().id)}
              frontImage={card().image}
              soundEnabled={props.soundEnabled}
            />
          </div>
        )}
      </Index>
    </div>
  );
};
