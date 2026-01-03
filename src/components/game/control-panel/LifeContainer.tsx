import { type Component, For } from "solid-js";
import { HeartIcon } from "../../icons/HeartIcon";

interface LifeContainerProps {
  lives: number;
  maxLives?: number;
}

export const LifeContainer: Component<LifeContainerProps> = (props) => {
  const maxLives = props.maxLives || 3;

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <For each={Array(maxLives).fill(0)}>
        {(_, i) => <HeartIcon broken={i() >= props.lives} />}
      </For>
    </div>
  );
};
