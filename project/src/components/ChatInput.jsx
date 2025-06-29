import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Handle speech recognition results
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setMessage(transcript);
      };
      
      // Handle speech recognition end
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      // Handle speech recognition errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    const messageToSend = message.trim();
    setMessage('');
    setSending(true);

    try {
      await onSendMessage(messageToSend);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please try Chrome, Safari, or Edge.');
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Could not start voice input. Please check your microphone permissions.');
      }
    }
  };

  return (
    <div className="bg-neutral-900/90 backdrop-blur-sm rounded-2xl border border-neutral-700 p-4 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Input Field */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Ask any question you want to know about me"}
            className="w-full bg-transparent text-white placeholder:text-neutral-500 resize-none border-none outline-none"
            rows={1}
            style={{
              minHeight: '24px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            disabled={sending}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={sending}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : speechSupported
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
            title={
              !speechSupported
                ? 'Voice input not supported'
                : isListening
                ? 'Stop listening'
                : 'Start voice input'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="p-2 bg-white hover:bg-neutral-200 disabled:bg-neutral-700 text-black disabled:text-neutral-500 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Voice Input Status */}
      {isListening && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-neutral-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listening... Speak now</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;