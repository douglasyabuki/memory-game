import { createEffect, on, type Accessor } from "solid-js";

export const useSoundEffect = <T>(url: string, trigger: Accessor<T>) => {
  const audio = new Audio(url);

  createEffect(
    on(
      trigger,
      () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      },
      { defer: true }
    )
  );
};
