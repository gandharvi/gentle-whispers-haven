
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Affirmation data
const affirmations = [
  {
    text: "You are worthy of love and kindness, exactly as you are.",
    color: "from-solace-lavender to-purple-300"
  },
  {
    text: "This moment is temporary. You have overcome difficult times before.",
    color: "from-solace-blue to-blue-300"
  },
  {
    text: "Your feelings are valid. It's okay to feel however you feel right now.",
    color: "from-solace-peach to-orange-200"
  },
  {
    text: "Take a deep breath. You are safe in this moment.",
    color: "from-green-200 to-green-100"
  },
  {
    text: "Small steps forward are still progress. Be gentle with yourself.",
    color: "from-pink-200 to-purple-100"
  },
  {
    text: "Your presence in this world matters. You bring unique gifts no one else can.",
    color: "from-solace-blue to-purple-200"
  },
  {
    text: "Healing isn't linear. Honor your journey and pace.",
    color: "from-yellow-200 to-orange-100"
  },
  {
    text: "You are not defined by what happened to you. You are defined by your resilience.",
    color: "from-solace-lavender to-blue-200"
  },
  {
    text: "It's okay to rest. Your worth isn't measured by productivity.",
    color: "from-teal-200 to-blue-100"
  },
  {
    text: "You are not alone in how you feel. Many others have felt this way too.",
    color: "from-solace-peach to-pink-200"
  }
];

const AffirmationCard: React.FC = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const shuffleAffirmation = () => {
    setIsFlipping(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * affirmations.length);
      } while (newIndex === currentAffirmation && affirmations.length > 1);
      
      setCurrentAffirmation(newIndex);
      setIsFlipping(false);
    }, 300);
  };
  
  // Shuffle on initial load
  useEffect(() => {
    shuffleAffirmation();
  }, []);
  
  return (
    <div className="solace-card mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Affirmation Card</h2>
        <Button variant="outline" size="icon" onClick={shuffleAffirmation}>
          <Shuffle size={18} />
        </Button>
      </div>
      
      <div 
        className={cn(
          "relative w-full h-40 rounded-xl shadow-md overflow-hidden transition-all duration-300",
          isFlipping ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100",
          `bg-gradient-to-br ${affirmations[currentAffirmation].color}`
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="text-center text-lg font-medium text-foreground">
            {affirmations[currentAffirmation].text}
          </p>
        </div>
        <div className="absolute top-2 right-2">
          {/* Card number indicator */}
          <span className="text-xs font-medium text-foreground/50">
            {currentAffirmation + 1}/{affirmations.length}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-center mt-2 text-foreground/60">Tap the shuffle button for a new affirmation</p>
    </div>
  );
};

export default AffirmationCard;
