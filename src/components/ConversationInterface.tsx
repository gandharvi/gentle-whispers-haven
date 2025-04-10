
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample AI responses for the demo
const aiResponses = [
  "I'm here with you. It sounds like you're going through a difficult time right now.",
  "That's completely understandable. Your feelings are valid, and it's okay to feel this way.",
  "You're showing such strength by acknowledging these emotions. Would taking a few deep breaths help?",
  "Remember, healing isn't linear. Some days are harder than others, and that's normal.",
  "I notice you're feeling overwhelmed. Let's try to focus on just this moment right now.",
  "You're not alone in this. Many people experience similar feelings.",
  "That sounds really challenging. Is there something small that might bring you comfort right now?",
  "I appreciate you sharing this with me. It takes courage to express these feelings.",
  "Would it help to try our grounding exercise? It can help bring you back to the present moment.",
  "Your resilience through this is remarkable, even if it doesn't feel that way right now."
];

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
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Speech synthesis
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    // Set up speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInput(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
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
  
  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      speakMessage(randomResponse);
    }, 1000);
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
          
          <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
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
