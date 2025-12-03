import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Terminal } from 'lucide-react';
import { chatWithChuck } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChuckChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'INITIATING CHUCK_PROTOCOL v1.0... READY.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithChuck(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "SYSTEM ERROR. RETRY?", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end pointer-events-none font-mono">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-white border-[6px] border-chuck-primary shadow-[12px_12px_0px_#001a4d] w-full sm:w-96 transition-all duration-200 transform origin-bottom-right flex flex-col overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 h-[80vh] sm:h-[500px]' : 'scale-90 opacity-0 translate-y-20 pointer-events-none h-0'
        }`}
      >
        {/* Header */}
        <div className="bg-chuck-primary p-3 flex justify-between items-center border-b-[6px] border-chuck-primary">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1">
               <Terminal size={20} className="text-chuck-primary" />
            </div>
            <div>
              <h3 className="font-arcade text-xs text-white">CHUCK.EXE</h3>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:bg-chuck-burn p-1 transition-colors">
            <X size={24} strokeWidth={4} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white relative">
          {messages.map((msg, idx) => (
            <div key={idx} className={`relative z-10 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[90%] p-4 text-xs font-bold border-4 ${
                  msg.role === 'user' 
                    ? 'bg-chuck-secondary text-chuck-primary border-chuck-primary shadow-[6px_6px_0px_#002764]' 
                    : 'bg-chuck-primary text-white border-chuck-primary shadow-[-6px_6px_0px_#6E98DA]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-chuck-secondary border-4 border-chuck-primary p-2 animate-pulse">
                 <span className="font-arcade text-[10px] text-chuck-primary">PROCESSING...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-chuck-secondary border-t-[6px] border-chuck-primary">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ENTER COMMAND..."
              className="w-full bg-white text-chuck-primary font-mono placeholder-chuck-primary/50 border-4 border-chuck-primary py-3 pl-4 pr-12 focus:outline-none focus:shadow-[4px_4px_0px_#002764]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 p-2 text-chuck-primary hover:bg-chuck-primary hover:text-white transition-colors border-2 border-transparent hover:border-transparent"
            >
              <Send size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto mb-4 mr-4 sm:mb-0 sm:mr-0 w-16 h-16 bg-chuck-primary border-4 border-white text-white shadow-[8px_8px_0px_#000000] flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={32} strokeWidth={3} />
      </button>
    </div>
  );
};

export default ChuckChat;