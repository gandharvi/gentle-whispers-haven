
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, PencilLine, Sparkles, Activity, Leaf, Gamepad, BookHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import DailyAffirmation from '@/components/DailyAffirmation';

const HomePage = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 dark:border-solace-dark-lavender/20 shadow-sm bg-white/80 dark:bg-solace-dark-purple/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Heart className="h-7 w-7 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Solace
          </h1>
        </div>
        
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="solace-container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Welcome to Solace
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80 max-w-2xl mx-auto">
            "You're not alone. I'm here, and we'll take it one gentle breath at a time."
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Main Feature - Conversation */}
          <div className="mb-16">
            <div className="solace-card p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Start a Supportive Conversation</h2>
              <p className="text-xl text-foreground/70 mb-6">
                Speak or type freely with a compassionate AI companion who listens without judgment.
                Our conversation interface provides a safe space for your thoughts and feelings.
              </p>
              <Link to="/conversation">
                <Button size="lg" className="w-full md:w-auto text-lg">
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Featured Section - Primary Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Additional Wellness Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mood Rating Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <Activity className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mood Rating</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Track your daily emotional state with a simple, visual tool to monitor your wellbeing.
                </p>
                <Link to="/index#mood" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    Rate Your Mood
                  </Button>
                </Link>
              </div>
              
              {/* Drawing Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <PencilLine className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Creative Drawing</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Express yourself through art with our simple drawing canvas to help process emotions.
                </p>
                <Link to="/drawing" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    Start Drawing
                  </Button>
                </Link>
              </div>
              
              {/* Grounding Exercise Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <Sparkles className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Grounding Exercises</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Practice mindfulness techniques to stay present and reduce anxiety when feeling overwhelmed.
                </p>
                <Link to="/grounding" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    Try Exercises
                  </Button>
                </Link>
              </div>
              
              {/* Journal Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <BookHeart className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Journaling</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Record your thoughts and feelings in a private journal to track your emotional journey.
                </p>
                <Link to="/index#journal" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    Open Journal
                  </Button>
                </Link>
              </div>
              
              {/* Daily Affirmation Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <Sparkles className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Affirmations</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Start your day with positive affirmations that inspire confidence and peace.
                </p>
                <Link to="/index#affirmation" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    View Affirmations
                  </Button>
                </Link>
              </div>
              
              {/* Feeling Wheel Feature */}
              <div className="solace-card flex flex-col items-center text-center p-6">
                <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <Activity className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Feeling Wheel</h3>
                <p className="text-lg text-foreground/70 mb-4">
                  Explore and identify your emotions with an interactive feeling wheel.
                </p>
                <Link to="/feeling-wheel" className="mt-auto">
                  <Button variant="outline" className="w-full text-base">
                    Explore Feelings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Leaf Catcher Game */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Take a Mindful Break</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-6">
              Sometimes a simple activity can help calm your mind. Try our Leaf Catcher game for a moment of mindful focus.
            </p>
            <div className="solace-card flex flex-col items-center text-center p-6 max-w-md mx-auto">
              <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                <Leaf className="h-10 w-10 text-solace-lavender dark:text-solace-dark-lavender" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Leaf Catcher Game</h3>
              <p className="text-lg text-foreground/70 mb-4">
                A simple, calming game to help you focus and relax your mind.
              </p>
              <Link to="/leaf-catcher" className="mt-auto">
                <Button className="w-full md:w-auto text-base">
                  Play Game
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">How Solace Helps</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-6">
              Solace provides a safe space for emotional support through gentle conversation, 
              creative expression, breathing exercises, and grounding techniques. 
              We're here to accompany you on your journey toward emotional well-being.
            </p>
            <Link to="/conversation">
              <Button size="lg" className="text-lg">
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-base border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
      
      {/* Daily Affirmation Pop-up */}
      <DailyAffirmation showOnLoad={true} />
    </div>
  );
};

export default HomePage;
