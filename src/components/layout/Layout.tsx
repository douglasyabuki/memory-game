import { type Component, type JSX } from "solid-js";
import { HoleBackground } from "../hole-background/HoleBackground";

interface LayoutProps {
  children?: JSX.Element;
}

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class="app">
      <HoleBackground>
        <main>{props.children}</main>
      </HoleBackground>
    </div>
  );
};
