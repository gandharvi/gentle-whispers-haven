
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BookHeart, Menu, Heart, MessageCircle, PencilLine, Sparkles, Activity, CalendarCheck, Gamepad, ArrowLeft } from 'lucide-react';
import BreathingBubble from '@/components/BreathingBubble';
import DrawingCanvas from '@/components/DrawingCanvas';
import AffirmationCard from '@/components/AffirmationCard';
import GroundingExercise from '@/components/GroundingExercise';
import MoodTracker from '@/components/MoodTracker';
import ConversationInterface from '@/components/ConversationInterface';
import DailyAffirmation from '@/components/DailyAffirmation';
import MoodRatingSlider from '@/components/MoodRatingSlider';
import LeafCatcherGame from '@/components/LeafCatcherGame';

const Index = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('conversation');
  const location = useLocation();
  
  // Handle hash fragments for direct tab navigation
  useEffect(() => {
    // Check if there's a hash in the URL and set the active tab accordingly
    if (location.hash) {
      const tab = location.hash.substring(1); // Remove the # character
      const validTabs = ['conversation', 'drawing', 'grounding', 'affirmation', 'mood', 'games', 'journal'];
      if (validTabs.includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [location]);
  
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
      
      // Switch to the journal tab
      setActiveTab('journal');
    }
  };
  
  // Get all journal entries for display
  const getJournalEntries = () => {
    return JSON.parse(localStorage.getItem('solace-journal') || '[]');
  };
  
  const journalEntries = getJournalEntries();
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-solace-dark-purple/80 dark:border-solace-dark-lavender/20">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-base font-normal">
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Button>
          </Link>
          <div className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
            <h1 className="text-2xl font-normal bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Solace
            </h1>
          </div>
        </div>
        
        {/* Journal Modal Trigger */}
        <div className="hidden md:block">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 font-normal">
                <BookHeart size={18} />
                <span>Journal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-normal">Today's Journal</DialogTitle>
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
                <Button onClick={handleJournalSubmit} className="solace-button font-normal">
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
          <h2 className="text-xl md:text-2xl font-normal text-foreground">
            "You're not alone. I'm here, and we'll take it one gentle breath at a time."
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Sidebar/Top Section */}
          <div className="space-y-6">
            <div className="solace-card border border-solace-lavender/30 dark:border-solace-dark-lavender/30">
              <BreathingBubble />
            </div>
            
            <MoodTracker />
            
            <AffirmationCard />
            
            {/* Mobile Journal */}
            <div className="md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 font-normal">
                    <BookHeart size={18} />
                    <span>Open Journal</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="font-normal">Today's Journal</DialogTitle>
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
                    <Button onClick={handleJournalSubmit} className="solace-button font-normal">
                      Save Entry
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="conversation" className="flex items-center gap-2 font-normal">
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">Conversation</span>
                </TabsTrigger>
                <TabsTrigger value="drawing" className="flex items-center gap-2 font-normal">
                  <PencilLine size={16} />
                  <span className="hidden sm:inline">Drawing</span>
                </TabsTrigger>
                <TabsTrigger value="grounding" className="flex items-center gap-2 font-normal">
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">Grounding</span>
                </TabsTrigger>
                <TabsTrigger value="affirmation" className="flex items-center gap-2 font-normal">
                  <CalendarCheck size={16} />
                  <span className="hidden sm:inline">Affirmation</span>
                </TabsTrigger>
                <TabsTrigger value="mood" className="flex items-center gap-2 font-normal">
                  <Activity size={16} />
                  <span className="hidden sm:inline">Mood</span>
                </TabsTrigger>
                <TabsTrigger value="games" className="flex items-center gap-2 font-normal">
                  <Gamepad size={16} />
                  <span className="hidden sm:inline">Leaves</span>
                </TabsTrigger>
                <TabsTrigger value="journal" className="flex items-center gap-2 font-normal">
                  <BookHeart size={16} />
                  <span className="hidden sm:inline">Journal</span>
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
              
              <TabsContent value="affirmation" className="pt-4">
                <DailyAffirmation showOnLoad={false} />
              </TabsContent>
              
              <TabsContent value="mood" className="pt-4">
                <MoodRatingSlider />
              </TabsContent>
              
              <TabsContent value="games" className="pt-4">
                <LeafCatcherGame />
              </TabsContent>
              
              <TabsContent value="journal" className="pt-4">
                <div className="solace-card">
                  <h2 className="text-2xl font-normal mb-6">Journal Entries</h2>
                  
                  {journalEntries.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-lg text-muted-foreground">No journal entries yet.</p>
                      <p className="mt-2">Write your first entry using the journal button at the top.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {journalEntries.slice().reverse().map((entry: any) => (
                        <div key={entry.id} className="border border-solace-lavender/20 dark:border-solace-dark-lavender/20 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                            </p>
                          </div>
                          <p className="text-lg whitespace-pre-wrap">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="solace-button font-normal">Add New Entry</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="font-normal">Add Journal Entry</DialogTitle>
                          <DialogDescription>
                            Write about your thoughts and feelings.
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
                          <Button onClick={handleJournalSubmit} className="solace-button font-normal">
                            Save Entry
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20 mt-8">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
      
      {/* Daily Affirmation Pop-up */}
      <DailyAffirmation showOnLoad={true} />
    </div>
  );
};

export default Index;
