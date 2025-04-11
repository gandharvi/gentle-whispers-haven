
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const affirmations = [
  "You are capable of amazing things.",
  "Today is full of possibilities.",
  "You are worthy of love and respect.",
  "Your strength is greater than any struggle.",
  "You have the power to create positive change.",
  "Every day is a fresh start.",
  "You are enough exactly as you are.",
  "Your potential is endless.",
  "Good things are coming your way.",
  "You deserve peace and happiness.",
  "Your voice matters.",
  "You are making progress even when you don't feel it.",
  "Trust yourself and your journey.",
  "Small steps still move you forward.",
  "You are resilient and can overcome challenges.",
  "Your presence makes a difference.",
  "It's okay to take time for yourself.",
  "Your feelings are valid.",
  "You bring unique gifts to the world.",
  "This moment is a gift."
];

interface DailyAffirmationProps {
  showOnLoad?: boolean;
}

const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ showOnLoad = true }) => {
  const [open, setOpen] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  
  // Get a new random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex];
  };
  
  // Set a new affirmation
  const refreshAffirmation = () => {
    const newAffirmation = getRandomAffirmation();
    setCurrentAffirmation(newAffirmation);
    
    if (!open) {
      toast({
        title: "New Affirmation",
        description: newAffirmation,
        duration: 5000
      });
    }
  };
  
  // Check if we should show the affirmation based on time
  useEffect(() => {
    // Initial affirmation
    setCurrentAffirmation(getRandomAffirmation());
    
    // Show on load if enabled
    if (showOnLoad) {
      const hasShownToday = localStorage.getItem('solace-affirmation-shown');
      const today = new Date().toDateString();
      
      if (hasShownToday !== today) {
        // Only show once per day by default
        setTimeout(() => {
          setOpen(true);
          localStorage.setItem('solace-affirmation-shown', today);
        }, 1000);
      }
    }
    
    // Set up hourly refresh
    const intervalId = setInterval(() => {
      refreshAffirmation();
    }, 60 * 60 * 1000); // Every hour
    
    return () => clearInterval(intervalId);
  }, [showOnLoad]);
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] border-solace-lavender/30 dark:border-solace-dark-lavender/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-solace-lavender dark:text-solace-dark-lavender" />
              Daily Affirmation
            </DialogTitle>
            <DialogDescription>
              Take a moment to reflect on today's affirmation
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 p-6 rounded-xl border border-solace-lavender/20 dark:border-solace-dark-lavender/20 bg-solace-lavender/5 dark:bg-solace-dark-lavender/10 text-center">
            <p className="text-lg font-medium text-foreground">"{currentAffirmation}"</p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button 
              className="solace-button flex items-center gap-2"
              onClick={refreshAffirmation}
            >
              <RefreshCw size={16} />
              New Affirmation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="solace-card h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-solace-lavender dark:text-solace-dark-lavender" />
            Daily Affirmation
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshAffirmation}
            className="hover:text-solace-lavender hover:bg-solace-lavender/10 dark:hover:text-solace-dark-lavender dark:hover:bg-solace-dark-lavender/10"
          >
            <RefreshCw size={18} />
          </Button>
        </div>
        
        <div className={cn(
          "flex-1 flex items-center justify-center p-6 rounded-xl border border-solace-lavender/20 dark:border-solace-dark-lavender/20",
          "bg-solace-lavender/5 dark:bg-solace-dark-lavender/10"
        )}>
          <p className="text-lg font-medium text-center text-foreground">"{currentAffirmation}"</p>
        </div>
        
        <Button 
          className="solace-button mt-4"
          onClick={() => setOpen(true)}
        >
          View Full Screen
        </Button>
      </div>
    </>
  );
};

export default DailyAffirmation;
