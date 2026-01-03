export type CardType =
  | "regular-monster-cards"
  | "effect-monster-cards"
  | "fusion-monster-cards"
  | "magic-cards"
  | "trap-cards"
  | "mixed";

export const CARD_TYPES: { id: CardType; name: string }[] = [
  { id: "regular-monster-cards", name: "Regular Monsters" },
  { id: "effect-monster-cards", name: "Effect Monsters" },
  { id: "fusion-monster-cards", name: "Fusion Monsters" },
  { id: "magic-cards", name: "Magic Cards" },
  { id: "trap-cards", name: "Trap Cards" },
  { id: "mixed", name: "Mixed" },
];

export const CARD_TYPES_LIST: CardType[] = [
  "regular-monster-cards",
  "effect-monster-cards",
  "fusion-monster-cards",
  "magic-cards",
  "trap-cards",
];
