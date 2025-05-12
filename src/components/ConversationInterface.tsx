import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, MicOff, Volume2, VolumeX, ArrowLeft, Gamepad, Paintbrush, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BreathingBubble from '@/components/BreathingBubble';
import GroundingExercise from '@/components/GroundingExercise';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

// Intense emotion keywords to detect
const intenseEmotions = [
  'anxious', 'anxiety', 'panic', 'overwhelmed', 'stressed', 
  'depressed', 'sad', 'hopeless', 'angry', 'furious',
  'scared', 'terrified', 'worried', 'exhausted', 'lonely',
  'desperate', 'miserable', 'devastated', 'heartbroken', 'hurt'
];

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
  const [returnFromActivity, setReturnFromActivity] = useState<string | null>(null);
  // Track user message count to only suggest activities after several messages
  const [userMessageCount, setUserMessageCount] = useState(0);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const initialFeelingProcessed = useRef(false);
  const navigate = useNavigate();
  
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
  
  // Handle return from activity
  useEffect(() => {
    if (returnFromActivity) {
      const followUpMessage = `How do you feel after ${returnFromActivity}? Did it help?`;
      
      // Add AI follow-up message
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: followUpMessage,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      speakMessage(followUpMessage);
      
      // Clear the return state
      setReturnFromActivity(null);
    }
  }, [returnFromActivity]);
  
  // Check if we're returning from an activity
  useEffect(() => {
    const returnActivity = localStorage.getItem('returnToChat');
    if (returnActivity) {
      setReturnFromActivity(returnActivity);
      localStorage.removeItem('returnToChat');
    }
  }, []);
  
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
  
  const detectIntenseEmotion = (message: string): boolean => {
    const messageLower = message.toLowerCase();
    return intenseEmotions.some(emotion => messageLower.includes(emotion));
  };
  
  const suggestActivity = (emotion: string): Message => {
    let suggestion;
    
    // Determine which activity to suggest based on the emotion
    if (['anxious', 'stressed', 'overwhelmed', 'worried', 'panic'].some(e => emotion.includes(e))) {
      suggestion = "I notice you seem to be feeling quite intense emotions. Would you like to try a grounding exercise or the leaf catcher game to help calm your mind?";
    } else if (['sad', 'depressed', 'hopeless', 'lonely', 'miserable'].some(e => emotion.includes(e))) {
      suggestion = "I can see you're going through a difficult time. Would it help to express yourself with the drawing canvas or check the feeling wheel to explore your emotions?";
    } else {
      suggestion = "It sounds like you're experiencing some intense feelings. Would you like to try an activity to help process these emotions? You could try the grounding exercise, feeling wheel, drawing canvas, or a calming game.";
    }
    
    return {
      id: Date.now().toString(),
      text: suggestion,
      sender: 'ai',
      timestamp: new Date()
    };
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
    
    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);
    
    // Only suggest activities after several messages and if intense emotions are detected
    if (newUserMessageCount >= 4 && detectIntenseEmotion(messageText)) {
      const suggestionMessage = suggestActivity(messageText);
      setMessages(prev => [...prev, suggestionMessage]);
      speakMessage(suggestionMessage.text);
      return;
    }
    
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
  
  const navigateToActivity = (activity: string) => {
    switch(activity) {
      case 'grounding':
        navigate('/grounding');
        localStorage.setItem('returnToChat', 'the grounding exercise');
        break;
      case 'affirmations':
        setActiveToolTab('affirmations');
        break;
      case 'feeling-wheel':
        navigate('/feeling-wheel');
        localStorage.setItem('returnToChat', 'feeling wheel');
        break;
      case 'drawing':
        navigate('/drawing');
        localStorage.setItem('returnToChat', 'drawing');
        break;
      case 'leaf-catcher':
        navigate('/leaf-catcher');
        localStorage.setItem('returnToChat', 'the leaf catcher game');
        break;
      default:
        break;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="solace-card h-full flex flex-col bg-solace-lavender/20 dark:bg-solace-dark-purple/70 backdrop-blur-sm border border-solace-lavender/30 dark:border-solace-dark-lavender/30 rounded-2xl shadow-lg">
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeToolTab} onValueChange={setActiveToolTab} className="w-full flex-1 flex flex-col">
            <TabsContent value="chat" className="pt-4 flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 min-h-[300px] p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex max-w-[85%] rounded-2xl px-5 py-3 animate-fade-up",
                      message.sender === 'user'
                        ? "ml-auto bg-solace-lavender/90 dark:bg-solace-dark-lavender/90 text-foreground shadow-sm"
                        : "bg-white/90 dark:bg-solace-dark-blue/40 border border-gray-100 dark:border-gray-700 shadow-sm"
                    )}
                  >
                    <p className="text-xl leading-relaxed">{message.text}</p>
                  </div>
                ))}
                <div ref={endOfMessagesRef} />
              </div>
              
              <div className="border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20 pt-4 mt-auto px-4 pb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full border-solace-lavender/50 dark:border-solace-dark-lavender/50", 
                      isListening && "bg-red-100 text-red-500 animate-pulse"
                    )}
                    onClick={toggleListening}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </Button>
                  
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message or click the mic to speak..."
                    className="min-h-[50px] max-h-[120px] resize-none flex-1 overflow-y-auto text-xl rounded-xl border-solace-lavender/50 dark:border-solace-dark-lavender/50 focus:border-solace-lavender focus:ring-solace-lavender/30"
                    rows={1}
                  />
                  
                  <Button 
                    size="icon" 
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "rounded-full bg-solace-lavender hover:bg-solace-lavender/90 dark:bg-solace-dark-lavender dark:hover:bg-solace-dark-lavender/90",
                      isLoading ? "opacity-70" : ""
                    )}
                  >
                    <Send size={18} />
                  </Button>
                </div>
                
                {isListening && (
                  <p className="text-xs text-center mt-2 text-red-500">
                    Listening... Speak clearly
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full text-xs border-solace-lavender/50 dark:border-solace-dark-lavender/50 bg-white/50 dark:bg-solace-dark-blue/30"
                    onClick={() => navigateToActivity('grounding')}
                  >
                    Grounding Exercise
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full text-xs border-solace-lavender/50 dark:border-solace-dark-lavender/50 bg-white/50 dark:bg-solace-dark-blue/30"
                    onClick={() => navigateToActivity('feeling-wheel')}
                  >
                    Feeling Wheel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs border-solace-lavender/50 dark:border-solace-dark-lavender/50 bg-white/50 dark:bg-solace-dark-blue/30"
                    onClick={() => navigateToActivity('drawing')}
                  >
                    Drawing Canvas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full text-xs border-solace-lavender/50 dark:border-solace-dark-lavender/50 bg-white/50 dark:bg-solace-dark-blue/30"
                    onClick={() => navigateToActivity('leaf-catcher')}
                  >
                    Leaf Catcher
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="grounding" className="flex-1 flex flex-col">
              <div className="flex flex-col items-center justify-center p-4 h-full">
                <h3 className="text-2xl mb-4">Grounding Exercise</h3>
                <p className="text-lg text-center mb-6">
                  Use this exercise to center yourself when feeling overwhelmed.
                </p>
                <div className="flex-1 flex items-center justify-center w-full">
                  <GroundingExercise />
                </div>
                <Button 
                  onClick={() => setActiveToolTab('chat')} 
                  className="mt-8 flex items-center gap-2 bg-solace-lavender hover:bg-solace-lavender/90 dark:bg-solace-dark-lavender dark:hover:bg-solace-dark-lavender/90"
                >
                  <ArrowLeft size={16} />
                  Return to conversation
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-1/3 space-y-4 p-4 hidden md:flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl">Support Tools</h2>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleAudio}
              className={cn("rounded-full", !audioEnabled ? "bg-red-50 text-red-500" : "")}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
          </div>
          
          <div className="solace-card border border-solace-lavender/30 dark:border-solace-dark-lavender/30 overflow-hidden bg-white/60 dark:from-solace-dark-blue/60 dark:to-solace-dark-blue/30 rounded-xl h-full">
            <BreathingBubble />
          </div>
        </div>
      </div>
    </div>
  );
};

// Use default function parameters instead of defaultProps
const ConversationInterfaceWithDefaults: React.FC<Partial<ConversationInterfaceProps>> = 
  ({ initialFeeling = null }) => {
    return <ConversationInterface initialFeeling={initialFeeling} />;
  };

export default ConversationInterfaceWithDefaults;
