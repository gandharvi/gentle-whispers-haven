
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConversationInterface from '@/components/ConversationInterface';
import BreathingBubble from '@/components/BreathingBubble';
import { ThemeToggle } from '@/components/ThemeToggle';

const ConversationPage = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 dark:border-solace-dark-lavender/20 shadow-sm bg-white/80 dark:bg-solace-dark-purple/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Solace
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main Content - Full screen */}
      <main className="flex-1 flex flex-col">
        <div className="text-center py-6">
          <h2 className="text-xl md:text-2xl font-medium text-foreground/80">
            "You're not alone. I'm here, and we'll take it one gentle breath at a time."
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 md:px-8 pb-6">
          {/* Breathing Exercise - Sidebar */}
          <div className="md:w-1/4 animate-fade-in">
            <div className="solace-card h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Take a Moment to Breathe</h3>
              <div className="flex-1 flex items-center justify-center">
                <BreathingBubble />
              </div>
              <p className="text-sm text-foreground/70 text-center mt-4">
                Breathe with the animation to help center yourself before or during our conversation.
              </p>
            </div>
          </div>
          
          {/* Main Conversation Area - Enhanced for focus */}
          <div className="md:w-3/4 flex-1 animate-fade-in">
            <ConversationInterface />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default ConversationPage;
