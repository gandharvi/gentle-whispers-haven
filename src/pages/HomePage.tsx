
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, PencilLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const HomePage = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 dark:border-solace-dark-lavender/20 shadow-sm bg-white/80 dark:bg-solace-dark-purple/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Heart className="h-6 w-6 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversation Feature */}
            <div className="solace-card flex flex-col items-center text-center p-6">
              <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                <MessageCircle className="h-8 w-8 text-solace-lavender dark:text-solace-dark-lavender" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Supportive Conversation</h3>
              <p className="text-foreground/70 mb-4">
                Speak or type freely with a compassionate AI companion who listens without judgment.
              </p>
              <Link to="/conversation" className="mt-auto">
                <Button className="w-full">
                  Start a Conversation
                </Button>
              </Link>
            </div>
            
            {/* Drawing Feature */}
            <div className="solace-card flex flex-col items-center text-center p-6">
              <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                <PencilLine className="h-8 w-8 text-solace-lavender dark:text-solace-dark-lavender" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Express Through Art</h3>
              <p className="text-foreground/70 mb-4">
                Draw, doodle, or sketch to express emotions that might be difficult to put into words.
              </p>
              <Link to="/drawing" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Open Canvas
                </Button>
              </Link>
            </div>
            
            {/* Grounding Feature */}
            <div className="solace-card flex flex-col items-center text-center p-6">
              <div className="mb-4 bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                <Sparkles className="h-8 w-8 text-solace-lavender dark:text-solace-dark-lavender" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grounding Exercises</h3>
              <p className="text-foreground/70 mb-4">
                Practice simple techniques to help bring you back to the present moment.
              </p>
              <Link to="/grounding" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Try Exercises
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">How Solace Helps</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              Solace provides a safe space for emotional support through gentle conversation, 
              creative expression, breathing exercises, and grounding techniques. 
              We're here to accompany you on your journey toward emotional well-being.
            </p>
            <Link to="/conversation">
              <Button size="lg">
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default HomePage;
