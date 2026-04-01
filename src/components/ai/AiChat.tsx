import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useCollectionsStore } from '../../stores/collectionsStore';
import { useResourcesStore } from '../../stores/resourcesStore';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const AiChat = () => {
  const { user } = useAuthStore();
  const { currentCollection } = useCollectionsStore();
  const { currentResource } = useResourcesStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (currentCollection) {
      setMessages([{
        id: 'system-1',
        role: 'system',
        content: `Witaj w czacie AI dla kolekcji "${currentCollection.name}". Jak mogę pomóc w pracy z Twoimi zasobami?`,
        timestamp: new Date(),
      }]);
    } else {
      setMessages([{
        id: 'system-1',
        role: 'system',
        content: 'Witaj! Jak mogę Ci pomóc?',
        timestamp: new Date(),
      }]);
    }
  }, [currentCollection?.id]);

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
      let context = '';
      if (currentCollection) {
        context += `Collection: ${currentCollection.name}\n`;
        if (currentCollection.description) {
          context += `Description: ${currentCollection.description}\n`;
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
            .map(m => ({ role: m.role, content: m.content })),
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
    } catch (error: any) {
      setError(error.message || 'Przepraszamy, wystąpił błąd podczas komunikacji z AI. Proszę spróbować ponownie.');
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
    if (currentCollection) {
      setMessages([{
        id: 'system-clear',
        role: 'system',
        content: `Czat został wyczyszczony. Jak mogę pomóc w pracy z kolekcją "${currentCollection.name}"?`,
        timestamp: new Date(),
      }]);
    } else {
      setMessages([{
        id: 'system-clear',
        role: 'system',
        content: 'Czat został wyczyszczony. Jak mogę Ci pomóc?',
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center min-w-0">
          <Bot className="h-5 w-5 text-primary-600 mr-2 shrink-0" />
          <h3 className="font-medium text-sm text-gray-900 shrink-0">Asystent AI</h3>
          {currentCollection && (
            <span className="text-xs text-gray-500 ml-2 truncate">
              {currentCollection.name}
            </span>
          )}
        </div>
        <button
          onClick={clearChat}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 shrink-0"
          aria-label="Clear chat"
          title="Wyczyść czat"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
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
            <div className="bg-error-50 border border-error-200 text-error-700 px-3 py-2 rounded-md text-xs">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 shrink-0">
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
          />
        </div>
      </div>
    </div>
  );
};

export default AiChat;
