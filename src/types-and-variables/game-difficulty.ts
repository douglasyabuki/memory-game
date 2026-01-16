export type GameDifficulty = "easy" | "medium" | "hard" | "expert" | "hell";

export const GAME_DIFFICULTIES: {
  id: GameDifficulty;
  name: string;
  cards: number;
  lives: number;
}[] = [
  { id: "easy", name: "Easy", cards: 12, lives: 3 },
  { id: "medium", name: "Medium", cards: 16, lives: 3 },
  { id: "hard", name: "Hard", cards: 20, lives: 3 },
  { id: "expert", name: "Expert", cards: 24, lives: 2 },
  { id: "hell", name: "Hell", cards: 28, lives: 1 },
];
