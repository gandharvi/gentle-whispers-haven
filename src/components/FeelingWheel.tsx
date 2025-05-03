
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Define the emotion categories and their subcategories
const emotions = [
  {
    name: 'Joy',
    color: 'bg-yellow-400',
    textColor: 'text-gray-800',
    subcategories: ['Happy', 'Playful', 'Content', 'Interested', 'Proud', 'Accepted', 'Powerful', 'Peaceful', 'Trusting']
  },
  {
    name: 'Sadness',
    color: 'bg-blue-500',
    textColor: 'text-white',
    subcategories: ['Lonely', 'Vulnerable', 'Despair', 'Guilty', 'Depressed', 'Hurt', 'Disappointed', 'Disheartened', 'Miserable']
  },
  {
    name: 'Fear',
    color: 'bg-purple-600',
    textColor: 'text-white',
    subcategories: ['Scared', 'Anxious', 'Insecure', 'Weak', 'Rejected', 'Threatened', 'Nervous', 'Worried', 'Inadequate']
  },
  {
    name: 'Disgust',
    color: 'bg-green-600',
    textColor: 'text-white',
    subcategories: ['Disapproving', 'Disappointed', 'Awful', 'Repelled', 'Revolted', 'Hesitant', 'Judgmental', 'Loathing', 'Aversion']
  },
  {
    name: 'Anger',
    color: 'bg-red-600',
    textColor: 'text-white',
    subcategories: ['Critical', 'Distant', 'Frustrated', 'Aggressive', 'Mad', 'Jealous', 'Hateful', 'Resentful', 'Irritable']
  },
  {
    name: 'Surprise',
    color: 'bg-pink-500',
    textColor: 'text-white',
    subcategories: ['Startled', 'Confused', 'Amazed', 'Excited', 'Stunned', 'Astonished', 'Shocked', 'Dismayed', 'Perplexed']
  }
];

const FeelingWheel: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion);
    setSelectedSubEmotion(null);
  };

  const handleSubEmotionClick = (subEmotion: string) => {
    setSelectedSubEmotion(subEmotion);
  };

  const getSelectedEmotionData = () => {
    return emotions.find(e => e.name === selectedEmotion);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        {selectedEmotion ? (
          <div className="text-center mb-4">
            <h3 className="text-2xl font-semibold mb-2">
              {selectedSubEmotion ? `I'm feeling ${selectedSubEmotion}` : `I'm feeling ${selectedEmotion}`}
            </h3>
            {selectedEmotion && !selectedSubEmotion && (
              <p className="text-lg">Select a more specific emotion below</p>
            )}
            {selectedSubEmotion && (
              <button 
                onClick={() => {
                  setSelectedEmotion(null);
                  setSelectedSubEmotion(null);
                }}
                className="mt-4 py-2 px-4 bg-solace-lavender dark:bg-solace-dark-lavender text-foreground rounded-full text-base hover:opacity-90 transition-opacity"
              >
                Start Over
              </button>
            )}
          </div>
        ) : (
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold">How are you feeling today?</h3>
            <p className="text-lg">Click on the emotion that resonates with you</p>
          </div>
        )}
      </div>

      {!selectedEmotion ? (
        // Primary emotion wheel
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {emotions.map((emotion) => (
            <button
              key={emotion.name}
              onClick={() => handleEmotionClick(emotion.name)}
              className={cn(
                "p-6 rounded-full aspect-square flex items-center justify-center text-xl font-bold transition-transform hover:scale-105",
                emotion.color,
                emotion.textColor
              )}
            >
              {emotion.name}
            </button>
          ))}
        </div>
      ) : (
        // Secondary emotions (subcategories)
        <div className="grid grid-cols-3 gap-4">
          {getSelectedEmotionData()?.subcategories.map((subEmotion) => (
            <button
              key={subEmotion}
              onClick={() => handleSubEmotionClick(subEmotion)}
              className={cn(
                "p-4 rounded-xl flex items-center justify-center text-lg font-medium transition-transform hover:scale-105",
                getSelectedEmotionData()?.color,
                getSelectedEmotionData()?.textColor,
                selectedSubEmotion === subEmotion ? "ring-4 ring-white/50" : ""
              )}
            >
              {subEmotion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeelingWheel;
