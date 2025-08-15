import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { Collection } from '../../stores/collectionsStore';
import { Resource } from '../../stores/resourcesStore';

interface AiChatProps {
  collection?: Collection;
  currentResource?: Resource;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const AiChat = ({ collection, currentResource }: AiChatProps) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('aiChatPosition');
    if (savedPosition) {
      return JSON.parse(savedPosition);
    }
    return { x: 32, y: window.innerHeight - 48 };
  });
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  // Save position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiChatPosition', JSON.stringify(position));
  }, [position]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);
  
  // Initial system message
  useEffect(() => {
    if (collection && messages.length === 0) {
      setMessages([
        {
          id: 'system-1',
          role: 'system',
          content: `Witaj w czacie AI dla kolekcji "${collection.name}". Jak mogę pomóc w pracy z Twoimi zasobami?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [collection, messages.length]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !chatRef.current) return;

      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      const maxX = window.innerWidth - chatRef.current.offsetWidth;
      const maxY = window.innerHeight - 48;
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare context for the AI
      let context = '';
      if (collection) {
        context += `Collection: ${collection.name}\n`;
        if (collection.description) {
          context += `Description: ${collection.description}\n`;
        }
      }
      if (currentResource) {
        context += `Current resource: ${currentResource.title}\n`;
        context += `Content: ${currentResource.content}\n`;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.role !== 'system')
            .concat(userMessage)
            .map(m => ({
              role: m.role,
              content: m.content
            })),
          context
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Przepraszamy, wystąpił błąd podczas komunikacji z AI. Proszę spróbować ponownie.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
    if (collection) {
      setMessages([
        {
          id: 'system-clear',
          role: 'system',
          content: `Czat został wyczyszczony. Jak mogę pomóc w pracy z kolekcją "${collection.name}"?`,
          timestamp: new Date(),
        },
      ]);
    }
  };
  
  return (
    <div 
      ref={chatRef}
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 z-40 w-96 ${
        isDragging ? 'cursor-grabbing' : 'cursor-auto'
      }`}
      style={{
        left: `${position.x}px`,
        top: isExpanded ? `${position.y - 384 + 48}px` : `${position.y}px`,
        height: isExpanded ? '384px' : '48px'
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-2 border-b border-gray-200 flex items-center justify-between select-none"
      >
        <div 
          className="flex items-center flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Bot className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="font-medium text-gray-900">
            Asystent AI
            {collection && (
              <span className="text-sm text-gray-500 ml-2">
                - {collection.name}
              </span>
            )}
          </h3>
        </div>
        
        <div className="flex items-center space-x-1">
          {isExpanded && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearChat();
              }}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
              aria-label="Clear chat"
              title="Wyczyść czat"
            >
              <X size={16} />
            </button>
          )}
          <div
            className="p-1 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            title="Przeciągnij, aby zmienić pozycję"
          >
            <GripVertical size={16} className="text-gray-400" />
          </div>
          <button 
            className="p-1 text-gray-500"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>
      
      {/* Messages */}
      {isExpanded && (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.role === 'system'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {error && (
              <div className="flex justify-center">
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center space-x-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Napisz wiadomość..."
                className="flex-1 min-h-[40px] max-h-20 resize-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                disabled={isLoading}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                isLoading={isLoading}
                icon={<Send size={16} />}
                aria-label="Send message"
              >
                Wyślij
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat; 