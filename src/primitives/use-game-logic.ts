import { type CardType } from "@/types-and-variables/card-type";
import { type GameCard } from "@/types-and-variables/game-card";
import { type GameDifficulty } from "@/types-and-variables/game-difficulty";
import { createSignal } from "solid-js";
import { generateDeck } from "./use-deck";
import { useImagePreloader } from "./use-image-preloader";

const DEAL_SPEED = 50;
const FLIP_TIMEOUT = 5000;

export const useGameLogic = (type: CardType, difficulty: GameDifficulty) => {
  const [cards, setCards] = createSignal<GameCard[]>([]);
  const [lives, setLives] = createSignal(3);
  const [flippedCards, setFlippedCards] = createSignal<string[]>([]);
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [gameState, setGameState] = createSignal<"playing" | "won" | "lost">(
    "playing"
  );
  const [imagesLoaded, setImagesLoaded] = createSignal(false);

  const getCardCount = (diff: GameDifficulty) => {
    switch (diff) {
      case "easy":
        return 12;
      case "medium":
        return 18;
      case "hard":
        return 24;
      case "expert":
        return 32;
      case "hell":
        return 50;
      default:
        return 12;
    }
  };

  let dealInterval: number | undefined;
  let flipTimeout: number | undefined;

  const initGame = () => {
    clearInterval(dealInterval);
    clearTimeout(flipTimeout);
    setCards([]);
    setGameState("playing");
    setIsProcessing(true);
    setLives(3);
    setFlippedCards([]);
    setImagesLoaded(false);

    const count = getCardCount(difficulty);
    const fullDeck = generateDeck(type, count).map((c) => ({
      ...c,
      isFlipped: false,
    }));

    // Extract unique image URLs for preloading
    const imageUrls = [...new Set(fullDeck.map((card) => card.image))];
    const { imagesLoaded: preloadComplete, preloadImages } =
      useImagePreloader(imageUrls);

    // Start preloading
    preloadImages();

    // Wait for images to load before dealing cards
    const checkImagesLoaded = setInterval(() => {
      if (preloadComplete()) {
        clearInterval(checkImagesLoaded);
        setImagesLoaded(true);

        setTimeout(() => {
          let currentIndex = 0;

          dealInterval = setInterval(() => {
            if (currentIndex >= fullDeck.length) {
              clearInterval(dealInterval);

              flipTimeout = setTimeout(() => {
                setCards((prev) =>
                  prev.map((c) => ({ ...c, isFlipped: true }))
                );
                setIsProcessing(false);
              }, FLIP_TIMEOUT);
              return;
            }

            const nextCard = fullDeck[currentIndex];
            setCards((prev) => [...prev, nextCard]);
            currentIndex++;
          }, DEAL_SPEED);
        }, 100);
      }
    }, 100);
  };

  const handleFlip = (id: string) => {
    if (gameState() !== "playing") return;
    if (isProcessing()) return;

    const card = cards().find((c) => c.id === id);
    if (!card || card.isMatched || !card.isFlipped) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: false } : c))
    );
    setFlippedCards((prev) => [...prev, id]);

    if (flippedCards().length === 2) {
      setIsProcessing(true);
      checkMatch();
    }
  };

  const checkMatch = () => {
    const [id1, id2] = flippedCards();
    const card1 = cards().find((c) => c.id === id1)!;
    const card2 = cards().find((c) => c.id === id2)!;

    if (card1.image === card2.image) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
        )
      );
      setFlippedCards([]);
      setIsProcessing(false);

      if (cards().every((c) => c.isMatched)) {
        setGameState("won");
      }
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === id1 || c.id === id2 ? { ...c, isFlipped: true } : c
          )
        );
        setFlippedCards([]);
        setLives((prev) => prev - 1);
        setIsProcessing(false);

        if (lives() === 0) {
          setGameState("lost");
        }
      }, 1000);
    }
  };

  return {
    cards,
    lives,
    gameState,
    initGame,
    handleFlip,
    imagesLoaded,
  };
};
