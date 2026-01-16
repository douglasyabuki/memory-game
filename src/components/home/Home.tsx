import { CARD_TYPES } from "@/types-and-variables/card-type";
import { GAME_DIFFICULTIES } from "@/types-and-variables/game-difficulty";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import style from "./home.module.css";

export const Home = () => {
  const [difficulty, setDifficulty] = createSignal("easy");
  const [cardType, setCardType] = createSignal("regular-monster-cards");

  return (
    <div class={style.container}>
      <div class={style.content}>
        <h1 class={style.title}>Solid Memory Game</h1>

        <div class={style.section}>
          <h2>Select Difficulty</h2>
          <div class={style.options}>
            {GAME_DIFFICULTIES.map((d) => (
              <label
                classList={{
                  [style.option]: true,
                  [style.selected]: difficulty() === d.id,
                }}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={d.id}
                  checked={difficulty() === d.id}
                  onChange={(e) => setDifficulty(e.currentTarget.value)}
                />
                <span>{d.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div class={style.section}>
          <h2>Card Type</h2>
          <div class={style.options}>
            {CARD_TYPES.map((t) => (
              <label
                classList={{
                  [style.option]: true,
                  [style.selected]: cardType() === t.id,
                }}
              >
                <input
                  type="radio"
                  name="cardType"
                  value={t.id}
                  checked={cardType() === t.id}
                  onChange={(e) => setCardType(e.currentTarget.value)}
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        <A
          href={`/game?difficulty=${difficulty()}&type=${cardType()}`}
          class={style["start-button"]}
        >
          Start Game
        </A>
      </div>
    </div>
  );
};
