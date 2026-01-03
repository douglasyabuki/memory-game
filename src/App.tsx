import { Game } from "@/components/game/Game";
import { Home } from "@/components/home/Home";
import { Layout } from "@/components/layout/Layout";
import { Route } from "@solidjs/router";

export const App = () => {
  return (
    <Route component={Layout}>
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
    </Route>
  );
};
