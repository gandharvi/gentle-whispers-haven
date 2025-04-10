
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DrawingCanvas from '@/components/DrawingCanvas';
import { ThemeToggle } from '@/components/ThemeToggle';

const DrawingPage = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
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
      
      {/* Main Content */}
      <main className="solace-container py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Express Through Drawing</h2>
          <p className="text-foreground/70">
            Use this canvas to express your emotions or simply enjoy a creative moment.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <DrawingCanvas />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default DrawingPage;
