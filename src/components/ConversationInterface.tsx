
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, MicOff, Volume2, VolumeX, Sparkles, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BreathingBubble from '@/components/BreathingBubble';
import AffirmationCard from '@/components/AffirmationCard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Define the SpeechRecognition types to fix TS errors
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface ConversationInterfaceProps {
  initialFeeling?: string | null;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ initialFeeling }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm here to listen and support you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState('chat');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const initialFeelingProcessed = useRef(false);
  
  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Speech synthesis
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    // Set up speech recognition if available
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          
          setInput(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event);
          setIsListening(false);
        };
      }
    }
    
    // Set up speech synthesis
    synthRef.current = new SpeechSynthesisUtterance();
    
    if (synthRef.current) {
      // Find a soft-sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
      
      if (femaleVoice) {
        synthRef.current.voice = femaleVoice;
      }
      
      synthRef.current.rate = 0.9; // Slightly slower rate
      synthRef.current.pitch = 1.1; // Slightly higher pitch
      synthRef.current.volume = 0.8; // Not too loud
    }
    
    // Load voices when they're available
    window.speechSynthesis.onvoiceschanged = () => {
      if (synthRef.current) {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
        
        if (femaleVoice) {
          synthRef.current.voice = femaleVoice;
        }
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
      
      window.speechSynthesis.cancel();
    };
  }, []);
  
  useEffect(() => {
    // Handle initial feeling if provided and not yet processed
    if (initialFeeling && !initialFeelingProcessed.current) {
      const message = `I'm feeling ${initialFeeling} today.`;
      setInput(message);
      
      // Use setTimeout to allow the component to fully render before sending
      setTimeout(() => {
        sendMessage(message);
        initialFeelingProcessed.current = true;
      }, 1000);
    }
  }, [initialFeeling]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (audioEnabled) {
      window.speechSynthesis.cancel();
    }
  };
  
  const speakMessage = (text: string) => {
    if (!audioEnabled || !synthRef.current) return;
    
    window.speechSynthesis.cancel(); // Stop any current speech
    
    synthRef.current.text = text;
    window.speechSynthesis.speak(synthRef.current);
  };
  
  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-conversation', {
        body: { message: userMessage }
      });
      
      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: "Unable to get a response. Please try again.",
        variant: "destructive"
      });
      return "I'm sorry, I'm having trouble responding right now. Could you try again in a moment?";
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessage = async (overrideText?: string) => {
    const messageText = overrideText || input;
    if ((!messageText.trim() || isLoading) && !overrideText) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Get AI response
    const aiText = await fetchAIResponse(messageText);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // Speak the AI response
    speakMessage(aiText);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="solace-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Supportive Conversation</h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleAudio}
          className={!audioEnabled ? "bg-red-50 text-red-500" : ""}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
      </div>
      
      <Tabs value={activeToolTab} onValueChange={setActiveToolTab} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="text-lg">Chat</TabsTrigger>
          <TabsTrigger value="breathing" className="text-lg">Breathing</TabsTrigger>
          <TabsTrigger value="affirmations" className="text-lg">Affirmations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="pt-4">
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 min-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[85%] rounded-2xl px-5 py-3 animate-fade-up",
                  message.sender === 'user'
                    ? "ml-auto bg-solace-lavender dark:bg-solace-dark-lavender/80 text-foreground"
                    : "bg-white/80 dark:bg-solace-dark-blue/30 border border-gray-100 dark:border-gray-700 shadow-sm"
                )}
              >
                <p className="text-xl leading-relaxed">{message.text}</p>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          
          <div className="border-t pt-4 mt-auto">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(isListening && "bg-red-100 text-red-500 animate-pulse")}
                onClick={toggleListening}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message or click the mic to speak..."
                className="min-h-[40px] max-h-[120px] resize-none flex-1 overflow-y-auto text-xl"
                rows={1}
              />
              
              <Button 
                size="icon" 
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className={isLoading ? "opacity-70" : ""}
              >
                <Send size={18} />
              </Button>
            </div>
            
            {isListening && (
              <p className="text-xs text-center mt-2 text-red-500">
                Listening... Speak clearly
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="breathing" className="pt-4">
          <div className="flex flex-col items-center justify-center p-4">
            <h3 className="text-2xl font-semibold mb-4">Breathing Exercise</h3>
            <p className="text-lg text-center mb-6">
              Take a moment to breathe deeply and calm your mind.
            </p>
            <BreathingBubble />
          </div>
        </TabsContent>
        
        <TabsContent value="affirmations" className="pt-4">
          <div className="flex flex-col items-center justify-center p-4">
            <h3 className="text-2xl font-semibold mb-4">Daily Affirmations</h3>
            <p className="text-lg text-center mb-6">
              Positive affirmations to uplift your spirits.
            </p>
            <AffirmationCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

ConversationInterface.defaultProps = {
  initialFeeling: null
};

export default ConversationInterface;
