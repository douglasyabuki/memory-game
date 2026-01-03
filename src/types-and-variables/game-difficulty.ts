export type GameDifficulty = "easy" | "medium" | "hard" | "expert" | "hell";

export const GAME_DIFFICULTIES: {
  id: GameDifficulty;
  name: string;
  cards: number;
}[] = [
  { id: "easy", name: "Easy", cards: 12 },
  { id: "medium", name: "Medium", cards: 18 },
  { id: "hard", name: "Hard", cards: 24 },
  { id: "expert", name: "Expert", cards: 32 },
  { id: "hell", name: "Hell", cards: 50 },
];
