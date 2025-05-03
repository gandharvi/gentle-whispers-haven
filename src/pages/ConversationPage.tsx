
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import ConversationInterface from '@/components/ConversationInterface';

const ConversationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const feeling = queryParams.get('feeling');

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
      <main className="flex-1 flex flex-col p-2 sm:p-6">
        <div className="flex-1 flex flex-col">
          <ConversationInterface initialFeeling={feeling} />
        </div>
      </main>
    </div>
  );
};

export default ConversationPage;
