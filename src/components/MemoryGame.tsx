
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shuffle, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type CardType = {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
};

const icons = ['🌸', '🌿', '🌊', '🌙', '⭐', '🍃', '🦋', '🐚'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Initialize or reset the game
  const initializeGame = () => {
    // Create pairs of cards with icons
    const cardPairs = [...icons, ...icons].map((icon, index) => ({
      id: index,
      icon,
      flipped: false,
      matched: false,
    }));
    
    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setGameStarted(true);
  };
  
  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if already flipped or matched, or if we already have 2 cards flipped
    if (
      cards[id].flipped || 
      cards[id].matched || 
      flippedCards.length >= 2 ||
      gameOver
    ) {
      return;
    }
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);
    
    // Add to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
    
    // Check if we have a pair
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = updatedFlippedCards;
      const firstCard = updatedCards[firstId];
      const secondCard = updatedCards[secondId];
      
      // Check if they match
      if (firstCard.icon === secondCard.icon) {
        // Mark as matched
        updatedCards[firstId].matched = true;
        updatedCards[secondId].matched = true;
        
        // Reset flipped cards
        setFlippedCards([]);
        
        // Check if all cards are matched
        if (updatedCards.every(card => card.matched)) {
          setGameOver(true);
          toast({
            title: "Congratulations!",
            description: `You completed the game in ${moves + 1} moves!`,
          });
        }
      } else {
        // Wait a bit before flipping them back
        setTimeout(() => {
          updatedCards[firstId].flipped = false;
          updatedCards[secondId].flipped = false;
          setCards([...updatedCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Initialize the game on first mount
  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, []);
  
  return (
    <div className="solace-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Calming Memory Game</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">Moves: {moves}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={initializeGame}
            className="hover:text-solace-lavender hover:bg-solace-lavender/10 dark:hover:text-solace-dark-lavender dark:hover:bg-solace-dark-lavender/10"
          >
            <Shuffle size={18} />
          </Button>
        </div>
      </div>
      
      {gameOver ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
          <p className="text-foreground/70 mb-6">You completed the game in {moves} moves</p>
          <Button className="solace-button" onClick={initializeGame}>
            Play Again
          </Button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={cn(
                "relative flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 transform",
                "border-2",
                card.flipped || card.matched 
                  ? "bg-solace-lavender/10 dark:bg-solace-dark-lavender/20 border-solace-lavender/30 dark:border-solace-dark-lavender/30" 
                  : "bg-white dark:bg-solace-dark-purple border-gray-200 dark:border-gray-700 hover:border-solace-lavender/30 dark:hover:border-solace-dark-lavender/30"
              )}
              style={{ aspectRatio: "1/1" }}
            >
              {(card.flipped || card.matched) && (
                <span className="text-3xl">{card.icon}</span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-foreground/70">
        <p>Find all matching pairs to complete the game.</p>
      </div>
    </div>
  );
};

export default MemoryGame;
