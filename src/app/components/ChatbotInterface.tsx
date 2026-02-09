import { useState, useEffect, useRef } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, ChatMessage } from '../types';
import { Send, Bot, UserCircle } from 'lucide-react';

interface ChatbotInterfaceProps {
  user: User;
  onNavigateToDashboard: () => void;
  onNavigateToLessons: () => void;
  onNavigateToProgress: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function ChatbotInterface({
  user,
  onNavigateToDashboard,
  onNavigateToLessons,
  onNavigateToProgress,
  onNavigateToProfile,
  onLogout,
}: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting: ChatMessage = {
      id: 'M1',
      sender: 'bot',
      message: user.targetLanguage === 'kinyarwanda'
        ? 'Muraho! Amakuru? I\'m your AI language tutor. I can help you practice Kinyarwanda! Try asking me how to say something or practice a conversation.'
        : `Hello! I'm your AI language tutor. I can help you practice ${user.targetLanguage}. Try asking me questions or starting a conversation!`,
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
  }, [user.targetLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Kinyarwanda responses
    if (user.targetLanguage === 'kinyarwanda') {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('muraho')) {
        return 'Muraho! (Hello!) Great to hear from you! In Kinyarwanda, we also say "Mwaramutse" for good morning and "Mwiriwe" for good afternoon. How can I help you practice today?';
      }
      if (lowerMessage.includes('how are you') || lowerMessage.includes('amakuru')) {
        return 'Ni meza! (I\'m fine!) In Rwanda, asking "Amakuru?" (How are you?) is very important. The response is usually "Ni meza" (I\'m fine) or "Ni meza cyane" (I\'m very fine). Would you like to practice more greetings?';
      }
      if (lowerMessage.includes('thank you') || lowerMessage.includes('urakoze')) {
        return 'Nimwiriwe! (You\'re welcome!) When someone says "Urakoze" (thank you), you respond with "Nimwiriwe" or "Ntakibazo" (no problem). Politeness is very valued in Rwandan culture!';
      }
      if (lowerMessage.includes('hotel') || lowerMessage.includes('room') || lowerMessage.includes('hoteri')) {
        return 'Ndashaka icyumba! (I want a room!) For hotels, you can say "Ndashaka icyumba" (I want a room). To ask the price, say "Ni amafranga angahe?" (How much is it?). Would you like more hotel phrases?';
      }
      if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('ibiryo')) {
        return 'Ndashaka gusaba ibiryo! (I want to order food!) At a restaurant, say "Mpa umwuka" (Give me the menu) and "Ndashaka gusaba ibiryo" (I want to order food). What specific food phrases would you like to learn?';
      }
      if (lowerMessage.includes('help') || lowerMessage.includes('ubufasha')) {
        return 'Ndakeneye ubufasha! (I need help!) In emergencies, say "Ndakeneye ubufasha!" or "Hamagara polisi!" (Call the police!). Rwanda is very safe, but it\'s good to know these phrases. What else would you like to practice?';
      }
      if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye') || lowerMessage.includes('murabeho')) {
        return 'Murabeho! (Goodbye!) You can also say "Tuzabonana" (See you later) or "Mwiriwe" when parting in the evening. Keep practicing, and you\'ll be fluent in no time!';
      }
    } else {
      // English responses for tourism workers
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('greeting')) {
        return 'Welcome to Rwanda! When greeting tourists, always say "Welcome to Rwanda!" with a smile. You can follow with "How can I help you?" - this shows you\'re ready to assist them.';
      }
      if (lowerMessage.includes('reservation') || lowerMessage.includes('booking')) {
        return 'To ask about reservations, say: "Do you have a reservation?" If yes, ask "What name is the reservation under?" If no, say "Let me check if we have availability."';
      }
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return 'When discussing prices, be clear: "The price is [amount] dollars per night" or "That will be [amount] dollars, please." Always offer a receipt: "Here is your receipt."';
      }
      if (lowerMessage.includes('direction') || lowerMessage.includes('location')) {
        return 'For giving directions: "It\'s on your left/right" or "Go straight ahead" or "Turn at the corner." You can also say "Would you like me to show you on a map?"';
      }
      if (lowerMessage.includes('emergency') || lowerMessage.includes('problem')) {
        return 'In emergencies, stay calm and say: "Don\'t worry, I will help you" and "Let me call someone who can assist." Know the emergency number: 112 for police, 912 for medical.';
      }
    }

    // Generic responses
    const genericResponses = [
      'That\'s interesting! Can you tell me more about what you\'d like to learn?',
      'I\'m here to help you practice! Try asking me about greetings, hotels, restaurants, or transportation.',
      'Great question! Would you like me to teach you specific phrases or help you with pronunciation?',
      'Let\'s practice together! What situation would you like to prepare for?',
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `M${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMsg: ChatMessage = {
        id: `M${Date.now() + 1}`,
        sender: 'bot',
        message: botResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = user.targetLanguage === 'kinyarwanda' 
    ? [
        'How do I say hello?',
        'Teach me restaurant phrases',
        'How to ask for directions?',
        'Emergency phrases',
      ]
    : [
        'How to greet tourists?',
        'Taking hotel reservations',
        'Explaining prices',
        'Giving directions',
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="chatbot"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToProgress={onNavigateToProgress}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={() => {}}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Language Tutor</h1>
          <p className="text-gray-600">Practice conversations and get instant feedback</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'bot' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {msg.sender === 'bot' ? (
                    <Bot className="w-6 h-6 text-blue-600" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-4 rounded-lg ${
                    msg.sender === 'bot' 
                      ? 'bg-blue-50 text-gray-900' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    {msg.translation && (
                      <p className="text-xs mt-2 opacity-75 italic">{msg.translation}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Practice</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Ask specific questions about phrases you want to learn</li>
            <li>• Practice common scenarios (greetings, ordering food, asking directions)</li>
            <li>• Don't be afraid to make mistakes - that's how you learn!</li>
            <li>• Try to use the words and phrases you've learned in lessons</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
