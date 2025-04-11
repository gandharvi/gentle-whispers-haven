
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Heart, Save, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MoodEntry {
  timestamp: number;
  rating: number;
  note?: string;
}

const MoodRatingSlider: React.FC = () => {
  const [moodRating, setMoodRating] = useState<number>(5);
  const [moodNote, setMoodNote] = useState<string>('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todayRecorded, setTodayRecorded] = useState(false);
  
  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedMoods = localStorage.getItem('solace-mood-ratings');
    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods) as MoodEntry[];
      setMoodHistory(parsedMoods);
      
      // Check if today's mood was already recorded
      const today = new Date().setHours(0, 0, 0, 0);
      const todayEntry = parsedMoods.find(entry => {
        const entryDate = new Date(entry.timestamp).setHours(0, 0, 0, 0);
        return entryDate === today;
      });
      
      if (todayEntry) {
        setMoodRating(todayEntry.rating);
        setMoodNote(todayEntry.note || '');
        setTodayRecorded(true);
      }
    }
  }, []);
  
  const saveMoodRating = () => {
    const now = Date.now();
    const newEntry: MoodEntry = {
      timestamp: now,
      rating: moodRating,
      note: moodNote
    };
    
    // Remove any existing entry for today if it exists
    const today = new Date().setHours(0, 0, 0, 0);
    const filteredHistory = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp).setHours(0, 0, 0, 0);
      return entryDate !== today;
    });
    
    // Add the new entry
    const updatedHistory = [...filteredHistory, newEntry];
    
    // Sort by timestamp (newest first)
    updatedHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    // Save to state and localStorage
    setMoodHistory(updatedHistory);
    localStorage.setItem('solace-mood-ratings', JSON.stringify(updatedHistory));
    setTodayRecorded(true);
  };
  
  const getMoodLabel = (value: number) => {
    if (value <= 2) return "Not so good";
    if (value <= 4) return "A bit low";
    if (value <= 6) return "Okay";
    if (value <= 8) return "Good";
    return "Great";
  };
  
  const getMoodColor = (value: number) => {
    if (value <= 2) return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    if (value <= 4) return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
    if (value <= 6) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
    if (value <= 8) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
  };
  
  return (
    <div className="solace-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-solace-lavender dark:text-solace-dark-lavender" />
          Mood Rating
        </h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-solace-lavender hover:bg-solace-lavender/10 dark:hover:text-solace-dark-lavender dark:hover:bg-solace-dark-lavender/10"
            >
              <History size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <h3 className="font-medium mb-2">Recent Mood History</h3>
            {moodHistory.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {moodHistory.slice(0, 7).map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                      getMoodColor(entry.rating)
                    )}>
                      {entry.rating}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{getMoodLabel(entry.rating)}</p>
                      <p className="text-xs text-foreground/60">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/60">No mood history yet</p>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className={cn(
          "text-center p-4 rounded-xl mb-6",
          getMoodColor(moodRating)
        )}>
          <p className="text-2xl font-bold">{moodRating}</p>
          <p className="font-medium">{getMoodLabel(moodRating)}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-foreground/70 mb-2">How are you feeling today?</p>
          <Slider
            value={[moodRating]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setMoodRating(value[0])}
            disabled={todayRecorded}
            className={todayRecorded ? "opacity-70" : ""}
          />
          <div className="flex justify-between text-xs text-foreground/50 mt-1">
            <span>Not so good</span>
            <span>Great</span>
          </div>
        </div>
        
        <div className="mb-6">
          <textarea
            placeholder="Add a note about how you're feeling (optional)"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            disabled={todayRecorded}
            className={cn(
              "w-full p-3 rounded-lg border border-input resize-none h-20 text-sm",
              todayRecorded ? "opacity-70 bg-muted" : ""
            )}
          />
        </div>
      </div>
      
      <Button 
        className="solace-button flex items-center gap-2"
        onClick={saveMoodRating}
        disabled={todayRecorded}
      >
        <Save size={16} />
        {todayRecorded ? "Mood Saved for Today" : "Save Mood Rating"}
      </Button>
    </div>
  );
};

export default MoodRatingSlider;
