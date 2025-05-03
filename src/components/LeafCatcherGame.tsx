
import React, { useState, useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface LeafPosition {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
}

// Motivational messages that will appear during gameplay
const motivationalMessages = [
  "You're doing great, keep going!",
  "Every leaf caught is a small victory!",
  "Breathe in... breathe out... you've got this!",
  "Stay focused and present in the moment.",
  "One leaf at a time, just like life's challenges.",
  "Finding peace in the simple things.",
  "You are capable of amazing things!",
  "Take a deep breath with each catch.",
  "Mindfulness in motion.",
  "Growth happens one small step at a time."
];

const LeafCatcherGame: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [basketPosition, setBasketPosition] = useState(50);
  const [leaves, setLeaves] = useState<LeafPosition[]>([]);
  const [gameWidth, setGameWidth] = useState(0);
  const [gameHeight, setGameHeight] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const messageTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize game dimensions
  useEffect(() => {
    if (gameAreaRef.current) {
      setGameWidth(gameAreaRef.current.clientWidth);
      setGameHeight(gameAreaRef.current.clientHeight);
    }
    
    const handleResize = () => {
      if (gameAreaRef.current) {
        setGameWidth(gameAreaRef.current.clientWidth);
        setGameHeight(gameAreaRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive]);

  // Motivational message display
  useEffect(() => {
    if (!gameActive) {
      setMotivationalMessage("");
      return;
    }
    
    // Show first message
    showRandomMotivationalMessage();
    
    // Set up interval for messages
    const messageInterval = setInterval(() => {
      showRandomMotivationalMessage();
    }, 10000); // Show a new message every 10 seconds
    
    return () => clearInterval(messageInterval);
  }, [gameActive]);

  // Show a random motivational message with a fade effect
  const showRandomMotivationalMessage = () => {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivationalMessage(randomMessage);
    
    // Clear the message after 5 seconds
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    
    messageTimerRef.current = window.setTimeout(() => {
      setMotivationalMessage("");
    }, 5000);
  };

  // Leaf creation
  useEffect(() => {
    if (!gameActive || gameWidth === 0) return;
    
    const createLeaf = () => {
      const newLeaf = {
        id: Date.now(),
        x: Math.random() * (gameWidth - 40) + 20,
        y: -30,
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * level
      };
      
      setLeaves(prev => [...prev, newLeaf]);
    };
    
    const leafInterval = setInterval(createLeaf, 1500 / level);
    
    return () => clearInterval(leafInterval);
  }, [gameActive, gameWidth, level]);

  // Leaf animation
  useEffect(() => {
    if (!gameActive || gameHeight === 0) return;
    
    const updateLeaves = () => {
      setLeaves(prevLeaves => {
        return prevLeaves
          .map(leaf => ({
            ...leaf,
            y: leaf.y + leaf.speed,
            rotation: leaf.rotation + 1
          }))
          .filter(leaf => {
            // Check if leaf is caught
            if (leaf.y > gameHeight - 60 && 
                leaf.y < gameHeight - 20 && 
                Math.abs(leaf.x - basketPosition * gameWidth / 100) < 50) {
              setScore(prev => {
                const newScore = prev + 1;
                // Show special messages at milestone scores
                if (newScore % 5 === 0) {
                  showRandomMotivationalMessage();
                }
                
                if (newScore > 0 && newScore % 10 === 0) {
                  setLevel(prev => Math.min(prev + 1, 5));
                  toast({
                    title: "Level Up!",
                    description: `You've reached level ${level + 1}!`,
                  });
                }
                return newScore;
              });
              return false;
            }
            
            // Remove leaves that go off screen
            return leaf.y < gameHeight;
          });
      });
      
      animationFrameRef.current = requestAnimationFrame(updateLeaves);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateLeaves);
    
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameActive, gameHeight, basketPosition, score, level, toast]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLeaves([]);
    setLevel(1);
    setTimeLeft(60);
  };

  const endGame = () => {
    setGameActive(false);
    toast({
      title: "Game Over!",
      description: `Your final score: ${score} leaves caught.`,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameAreaRef.current || !gameActive) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setBasketPosition(Math.max(5, Math.min(95, position)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameAreaRef.current || !gameActive) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const position = (x / rect.width) * 100;
    setBasketPosition(Math.max(5, Math.min(95, position)));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          <span className="font-bold">Score:</span> {score}
        </div>
        <div className="text-lg font-semibold">
          <span className="font-bold">Level:</span> {level}
        </div>
        <div className="text-lg font-semibold">
          <span className="font-bold">Time:</span> {timeLeft}s
        </div>
      </div>
      
      {/* Motivational message */}
      {motivationalMessage && (
        <div className="text-center mb-4 animate-fade-in">
          <p className="text-lg font-medium text-solace-dark-lavender dark:text-solace-lavender italic">
            "{motivationalMessage}"
          </p>
        </div>
      )}
      
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[400px] md:h-[500px] bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 rounded-xl overflow-hidden border-2 border-solace-lavender/30 dark:border-solace-dark-lavender/30"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Game elements */}
        {gameActive ? (
          <>
            {/* Falling leaves */}
            {leaves.map(leaf => (
              <div 
                key={leaf.id}
                className="absolute pointer-events-none text-green-600 dark:text-green-500"
                style={{
                  left: `${leaf.x}px`,
                  top: `${leaf.y}px`,
                  transform: `rotate(${leaf.rotation}deg)`
                }}
              >
                <Leaf size={28} />
              </div>
            ))}
            
            {/* Basket/Catcher */}
            <div 
              className="absolute bottom-0 w-24 h-12 flex items-center justify-center"
              style={{
                left: `calc(${basketPosition}% - 48px)`
              }}
            >
              <div className="w-full h-full bg-solace-lavender dark:bg-solace-dark-lavender rounded-t-full"></div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <h3 className="text-3xl font-bold">Leaf Catcher</h3>
            <p className="text-xl text-center px-8">Catch falling leaves by moving your basket.<br/>A mindful game for relaxation and focus.</p>
            <Button onClick={startGame} size="lg" className="mt-4 text-lg">
              Start Game
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        {gameActive ? (
          <Button onClick={endGame} variant="outline" className="text-lg">End Game</Button>
        ) : score > 0 ? (
          <Button onClick={startGame} className="text-lg">Play Again</Button>
        ) : null}
      </div>
    </div>
  );
};

export default LeafCatcherGame;
