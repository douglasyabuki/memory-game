import { type Component, For } from "solid-js";
import { HeartIcon } from "../../icons/HeartIcon";

interface LifeContainerProps {
  lives: number;
  maxLives?: number;
}

export const LifeContainer: Component<LifeContainerProps> = (props) => {
  const totalHearts = 3; // Always show 3 hearts (max possible)
  const maxLives = () => props.maxLives ?? 3;

  // Calculate heart states (ensure no negative values)
  const activeHearts = () => Math.max(0, props.lives);
  const brokenHearts = () => Math.max(0, maxLives() - props.lives);
  const disabledHearts = () => Math.max(0, totalHearts - maxLives());

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {/* Active hearts */}
      <For each={Array(activeHearts()).fill(0)}>{() => <HeartIcon />}</For>

      {/* Broken hearts (lost during gameplay) */}
      <For each={Array(brokenHearts()).fill(0)}>
        {() => <HeartIcon broken />}
      </For>

      {/* Disabled hearts (blocked by difficulty) */}
      <For each={Array(disabledHearts()).fill(0)}>
        {() => <HeartIcon disabled />}
      </For>
    </div>
  );
};
