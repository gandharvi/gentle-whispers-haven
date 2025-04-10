
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BookHeart, Menu, Heart, MessageCircle, PencilLine, Sparkles, Activity, CalendarCheck } from 'lucide-react';
import BreathingBubble from '@/components/BreathingBubble';
import DrawingCanvas from '@/components/DrawingCanvas';
import AffirmationCard from '@/components/AffirmationCard';
import GroundingExercise from '@/components/GroundingExercise';
import MoodTracker from '@/components/MoodTracker';
import ConversationInterface from '@/components/ConversationInterface';

const Index = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleJournalSubmit = () => {
    // Save journal entry to localStorage
    if (journalEntry.trim()) {
      const now = new Date();
      const entry = {
        id: now.getTime(),
        text: journalEntry,
        date: now.toISOString()
      };
      
      // Get existing entries
      const existingEntries = JSON.parse(localStorage.getItem('solace-journal') || '[]');
      
      // Add new entry
      localStorage.setItem('solace-journal', JSON.stringify([...existingEntries, entry]));
      
      // Clear the textarea
      setJournalEntry('');
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Heart className="h-6 w-6 mr-2 text-solace-lavender" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Solace
          </h1>
        </div>
        
        {/* Journal Modal Trigger */}
        <div className="hidden md:block">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <BookHeart size={18} />
                <span>Journal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Today's Journal</DialogTitle>
                <DialogDescription>
                  Take a moment to reflect on your thoughts and feelings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="How are you really feeling today? What's on your mind?"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleJournalSubmit} className="solace-button">
                  Save Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu />
        </Button>
      </header>
      
      {/* Main Content */}
      <main className="solace-container py-8">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground/80">
            "You're not alone. I'm here, and we'll take it one gentle breath at a time."
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Sidebar/Top Section */}
          <div className="space-y-6">
            <div className="solace-card">
              <BreathingBubble />
            </div>
            
            <MoodTracker />
            
            <AffirmationCard />
            
            {/* Mobile Journal */}
            <div className="md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <BookHeart size={18} />
                    <span>Open Journal</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Today's Journal</DialogTitle>
                    <DialogDescription>
                      Take a moment to reflect on your thoughts and feelings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Textarea
                      placeholder="How are you really feeling today? What's on your mind?"
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleJournalSubmit} className="solace-button">
                      Save Entry
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <Tabs defaultValue="conversation" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="conversation" className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">Conversation</span>
                </TabsTrigger>
                <TabsTrigger value="drawing" className="flex items-center gap-2">
                  <PencilLine size={16} />
                  <span className="hidden sm:inline">Drawing</span>
                </TabsTrigger>
                <TabsTrigger value="grounding" className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">Grounding</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="conversation" className="pt-4">
                <ConversationInterface />
              </TabsContent>
              
              <TabsContent value="drawing" className="pt-4">
                <DrawingCanvas />
              </TabsContent>
              
              <TabsContent value="grounding" className="pt-4">
                <GroundingExercise />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default Index;
