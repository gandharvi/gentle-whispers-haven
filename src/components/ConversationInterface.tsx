
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

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

const ConversationInterface: React.FC = () => {
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
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
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
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Get AI response
    const aiText = await fetchAIResponse(input);
    
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
    <div className="solace-card h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conversation</h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleAudio}
          className={!audioEnabled ? "bg-red-50 text-red-500" : ""}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-max max-w-[80%] rounded-2xl px-4 py-3 animate-fade-up",
              message.sender === 'user'
                ? "ml-auto bg-solace-lavender text-foreground"
                : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="border-t pt-4">
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
            className="min-h-[40px] resize-none flex-1"
          />
          
          <Button 
            size="icon" 
            onClick={sendMessage} 
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
    </div>
  );
};

export default ConversationInterface;
