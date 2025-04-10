
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    count: 5,
    sense: "SEE",
    instruction: "Name five things you can see around you.",
    examples: "a plant, a book, a picture frame, a window, a lamp"
  },
  {
    count: 4,
    sense: "TOUCH",
    instruction: "Name four things you can feel or touch.",
    examples: "your clothes, the chair, the floor, a breeze"
  },
  {
    count: 3,
    sense: "HEAR",
    instruction: "Name three things you can hear right now.",
    examples: "traffic outside, a fan, your breathing"
  },
  {
    count: 2,
    sense: "SMELL",
    instruction: "Name two things you can smell.",
    examples: "coffee, soap, food, fresh air"
  },
  {
    count: 1,
    sense: "TASTE",
    instruction: "Name one thing you can taste.",
    examples: "mint gum, coffee, the taste in your mouth"
  }
];

const GroundingExercise: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(steps.length).fill(false));
  const [isComplete, setIsComplete] = useState(false);
  
  const handleNext = () => {
    const newCompleted = [...completed];
    newCompleted[currentStep] = true;
    setCompleted(newCompleted);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };
  
  const resetExercise = () => {
    setCurrentStep(0);
    setCompleted(Array(steps.length).fill(false));
    setIsComplete(false);
  };
  
  return (
    <div className="solace-card mb-8">
      <h2 className="text-xl font-semibold mb-4">Grounding Exercise</h2>
      
      {!isComplete ? (
        <div className="space-y-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all",
                  currentStep === index ? "border-solace-lavender bg-solace-lavender/20 text-foreground" : 
                  completed[index] ? "border-solace-lavender bg-solace-lavender text-white" :
                  "border-gray-200 text-gray-400"
                )}
              >
                {completed[index] ? <Check size={16} /> : step.count}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "absolute h-0.5 w-6 right-0 top-1/2 -translate-y-1/2 translate-x-full",
                    completed[index] ? "bg-solace-lavender" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-solace-lavender/10 p-6 rounded-lg">
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-solace-lavender/30 text-sm font-medium">
                {steps[currentStep].sense}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-center mb-2">
              {steps[currentStep].instruction}
            </h3>
            
            <p className="text-sm text-foreground/60 text-center">
              For example: {steps[currentStep].examples}
            </p>
          </div>
          
          <Button 
            className="w-full solace-button"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? (
              <>Next <ChevronRight size={16} /></>
            ) : (
              <>Complete <Check size={16} /></>
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Exercise Complete!</h3>
            <p className="text-sm">
              Great job bringing yourself to the present moment. How do you feel now?
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetExercise}
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroundingExercise;
