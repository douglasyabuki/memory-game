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
      return 4;
    case "medium":
      return 4;
    case "hard":
      return 5;
    case "expert":
      return 6;
    case "hell":
      return 7;
    default:
      return 4;
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
