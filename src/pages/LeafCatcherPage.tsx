
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import LeafCatcherGame from '@/components/LeafCatcherGame';

const LeafCatcherPage = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 dark:border-solace-dark-lavender/20 shadow-sm bg-white/80 dark:bg-solace-dark-purple/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Heart className="h-7 w-7 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Solace
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-base">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Leaf Catcher</h2>
          <p className="text-xl text-foreground/70 mt-2">A mindful game to help you focus and find moments of calm</p>
          <p className="text-lg text-foreground/60 mt-1">Catch the falling leaves and collect inspiring messages along the way</p>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <LeafCatcherGame />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-base border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default LeafCatcherPage;
