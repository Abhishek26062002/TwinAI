import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Mic } from 'lucide-react';
import { getProfile, sendMessage } from '../api.js';
import ChatBubble from '../components/ChatBubble.jsx';
import ChatInput from '../components/ChatInput.jsx';

const WebChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadProfile = async () => {
    const response = await getProfile();
    if (response.success) {
      setProfile(response.data);
    } else {
      // Create a minimal profile for testing
      setProfile({ 
        identity: { preferred_name: 'AI Assistant' },
        name: 'AI Assistant' 
      });
    }
    setLoading(false);
  };

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send to API
      const response = await sendMessage(content);
      if (response.success) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          content: response.data.reply,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('API response failed');
      }
    } catch (error) {
      // Fallback response for testing
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help! I can assist you with a wide range of topics including answering questions, providing recommendations, and helping with various tasks. What would you like to know about me?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlayEnabled(!autoPlayEnabled);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const userName = profile?.identity?.preferred_name || profile?.name || 'AI Assistant';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-black sticky top-0 z-10">
        <button
          onClick={() => navigate('/share')}
          className="p-2 hover:bg-neutral-900 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="font-semibold text-white">
            {userName}
          </h1>
        </div>

        {/* Header Controls */}
        <div className="flex items-center space-x-2">
          {/* Voice Chat Button */}
          <button
            onClick={() => navigate('/voice')}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors duration-200"
            title="Switch to voice chat"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Auto-play toggle */}
          <button
            onClick={toggleAutoPlay}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              autoPlayEnabled 
                ? 'bg-white text-black hover:bg-neutral-200' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title={autoPlayEnabled ? "Disable auto-play" : "Enable auto-play"}
          >
            {autoPlayEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center max-w-md">
              {/* Avatar */}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-xl">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Greeting */}
              <h2 className="text-2xl font-semibold text-white mb-2">
                Hi there!
              </h2>
              <h3 className="text-xl text-white mb-4">
                Can I help you with anything?
              </h3>
              
              {/* Feature notices */}
              <div className="space-y-4 mt-8">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Volume2 className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Voice Enabled</span>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    Click the speaker icon on AI responses to hear them spoken aloud, 
                    or toggle auto-play in the header.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mic className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Voice Chat Available</span>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    Switch to voice chat mode for a hands-free conversation experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatBubble 
                  key={message.id} 
                  message={message} 
                  autoPlay={autoPlayEnabled && message.isBot}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Floating Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-neutral-800 p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default WebChat;