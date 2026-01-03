import {
  CARD_TYPES_LIST,
  type CardType,
} from "@/types-and-variables/card-type";
import { type GameCard } from "@/types-and-variables/game-card";
import { type RenamingMap } from "@/types-and-variables/renaming-map";
import renamingMapJson from "../../public/renaming_map.json";

const renamingMap = renamingMapJson as RenamingMap;

export const generateDeck = (
  type: CardType,
  totalCards: number
): GameCard[] => {
  let pool: { folder: string; file: string }[] = [];

  if (type === "mixed") {
    CARD_TYPES_LIST.forEach((t) => {
      const cards = renamingMap[t];
      if (cards) {
        cards.forEach((c) => pool.push({ folder: t, file: c.new }));
      }
    });
  } else {
    const cards = renamingMap[type];
    if (cards) {
      cards.forEach((c) => pool.push({ folder: type, file: c.new }));
    }
  }

  pool.sort(() => Math.random() - 0.5);

  const selected = pool.slice(0, totalCards / 2);

  const deck: GameCard[] = [];
  selected.forEach((item, index) => {
    const cardProto = {
      image: `/${item.folder}/${item.file}.svg`,
      isMatched: false,
      isFlipped: false,
    };
    deck.push({ ...cardProto, id: `pair-${index}-a` });
    deck.push({ ...cardProto, id: `pair-${index}-b` });
  });

  return deck.sort(() => Math.random() - 0.5);
};
