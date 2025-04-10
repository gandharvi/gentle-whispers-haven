
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const BreathingBubble: React.FC = () => {
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [instruction, setInstruction] = useState('Breathe in...');

  useEffect(() => {
    const breathingCycle = () => {
      // Breathing in cycle
      setIsBreathingIn(true);
      setInstruction('Breathe in...');
      
      // After 4 seconds, switch to breathing out
      const breathOutTimeout = setTimeout(() => {
        setIsBreathingIn(false);
        setInstruction('Breathe out...');
      }, 4000);
      
      return breathOutTimeout;
    };

    // Start the first cycle
    let breathOutTimeout = breathingCycle();
    
    // Set up an interval to alternate between breathing in and out
    const intervalId = setInterval(() => {
      clearTimeout(breathOutTimeout);
      breathOutTimeout = breathingCycle();
    }, 8000); // Complete cycle is 8 seconds (4s in + 4s out)
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      clearTimeout(breathOutTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-center mb-6">
        <p className="text-lg font-medium text-foreground mb-1">{instruction}</p>
        <p className="text-sm text-foreground/80">Follow the bubble's rhythm</p>
      </div>
      
      <div className="relative flex items-center justify-center w-48 h-48">
        <div 
          className={cn(
            "absolute rounded-full bg-gradient-to-br from-solace-lavender/70 to-solace-blue/70 backdrop-blur-sm",
            "transition-all duration-[4000ms] ease-in-out",
            "shadow-lg shadow-solace-lavender/20",
            "flex items-center justify-center text-foreground font-medium",
            "border-2 border-solace-lavender dark:border-solace-dark-lavender",
            isBreathingIn ? "animate-breathe-in" : "animate-breathe-out"
          )}
          style={{ width: '120px', height: '120px' }}
        >
          <span className="text-sm font-semibold">{isBreathingIn ? "In" : "Out"}</span>
        </div>
      </div>
    </div>
  );
};

export default BreathingBubble;
