
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroundingExercise from '@/components/GroundingExercise';

const GroundingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-solace-lavender" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Solace
            </h1>
          </Link>
        </div>
        
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
        </Link>
      </header>
      
      {/* Main Content */}
      <main className="solace-container py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Grounding Exercises</h2>
          <p className="text-foreground/70">
            Simple techniques to help you connect with the present moment.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <GroundingExercise />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default GroundingPage;
