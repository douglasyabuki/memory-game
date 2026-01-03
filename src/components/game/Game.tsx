import { useGameLogic } from "@/primitives/use-game-logic";
import { type CardType } from "@/types-and-variables/card-type";
import { type GameDifficulty } from "@/types-and-variables/game-difficulty";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, type Component } from "solid-js";
import { Board } from "./board/Board";
import { ControlPanel } from "./control-panel/ControlPanel";
import style from "./game.module.css";

export const Game: Component = () => {
  const [params] = useSearchParams();
  const [isMuted, setIsMuted] = createSignal(false);
  const { cards, lives, gameState, initGame, handleFlip } = useGameLogic(
    (params.type as CardType) || "regular-monster-cards",
    (params.difficulty as GameDifficulty) || "easy"
  );

  createEffect(() => {
    initGame();
  });

  return (
    <div class={style.container}>
      <div class={style.content}>
        <div class={style.header}>
          <h1>Solid Memory Game</h1>
          <ControlPanel
            lives={lives()}
            onRetry={initGame}
            isMuted={isMuted()}
            onToggleMute={() => setIsMuted((p) => !p)}
          />
        </div>

        <div class={style["game-area"]}>
          {gameState() === "lost" && (
            <div class={style.overlay}>
              <h2>Game Over</h2>
              <button onClick={initGame}>Try Again</button>
            </div>
          )}

          {gameState() === "won" && (
            <div class={style.overlay}>
              <h2>You Won!</h2>
              <button onClick={initGame}>Play Again</button>
            </div>
          )}

          <Board
            cards={cards()}
            onFlip={handleFlip}
            soundEnabled={() => !isMuted()}
            difficulty={(params.difficulty as GameDifficulty) || "easy"}
          />
        </div>
      </div>
    </div>
  );
};
