
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, Sun, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodEntry {
  date: string; // ISO string
  mood: 'happy' | 'neutral' | 'sad';
}

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todayRecorded, setTodayRecorded] = useState(false);
  
  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedMoods = localStorage.getItem('solace-mood-history');
    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods) as MoodEntry[];
      setMoodHistory(parsedMoods);
      
      // Check if today's mood was already recorded
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = parsedMoods.find(entry => entry.date.startsWith(today));
      
      if (todayEntry) {
        setSelectedMood(todayEntry.mood);
        setTodayRecorded(true);
      }
    }
  }, []);
  
  const saveMood = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      date: today,
      mood: selectedMood
    };
    
    // Remove any existing entry for today
    const filteredHistory = moodHistory.filter(entry => !entry.date.startsWith(today));
    
    // Add the new entry
    const updatedHistory = [...filteredHistory, newEntry];
    
    // Save to state and localStorage
    setMoodHistory(updatedHistory);
    localStorage.setItem('solace-mood-history', JSON.stringify(updatedHistory));
    setTodayRecorded(true);
  };
  
  const getMoodIcon = (mood: MoodEntry['mood']) => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-5 h-5" />;
      case 'neutral':
        return <Meh className="w-5 h-5" />;
      case 'sad':
        return <Frown className="w-5 h-5" />;
    }
  };
  
  const getRecentMoods = () => {
    return moodHistory.slice(-7).reverse(); // Get last 7 entries, most recent first
  };
  
  return (
    <div className="solace-card mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mood Check-in</h2>
        <div className="flex items-center text-sm text-foreground/60">
          <Sun size={14} className="mr-1" />
          <span>Today</span>
        </div>
      </div>
      
      {!todayRecorded ? (
        <>
          <p className="text-center text-foreground/80 mb-4">
            How are you feeling today?
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            {(['happy', 'neutral', 'sad'] as const).map((mood) => (
              <button
                key={mood}
                className={cn(
                  "p-4 rounded-full transition-all",
                  selectedMood === mood 
                    ? "bg-solace-lavender scale-110 shadow-md" 
                    : "bg-gray-100 hover:bg-gray-200"
                )}
                onClick={() => setSelectedMood(mood)}
              >
                {mood === 'happy' && <Smile size={28} />}
                {mood === 'neutral' && <Meh size={28} />}
                {mood === 'sad' && <Frown size={28} />}
              </button>
            ))}
          </div>
          
          <Button 
            className="w-full solace-button"
            onClick={saveMood}
            disabled={!selectedMood}
          >
            Save My Mood
          </Button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-foreground/80 mb-3">
            Today you're feeling:
          </p>
          
          <div className="inline-block p-4 rounded-full bg-solace-lavender mb-4">
            {selectedMood && getMoodIcon(selectedMood)}
          </div>
          
          <p className="text-sm text-foreground/60">
            Your mood has been recorded for today. Come back tomorrow for a new check-in!
          </p>
        </div>
      )}
      
      {/* Show recent mood history if available */}
      {moodHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/80">Recent Moods</h3>
            <CalendarDays size={14} className="text-foreground/60" />
          </div>
          
          <div className="flex justify-between">
            {getRecentMoods().map((entry, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={cn(
                  "p-2 rounded-full",
                  entry.mood === 'happy' ? "bg-green-100" : 
                  entry.mood === 'neutral' ? "bg-blue-100" : "bg-red-100"
                )}>
                  {getMoodIcon(entry.mood)}
                </div>
                <span className="text-xs mt-1">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
