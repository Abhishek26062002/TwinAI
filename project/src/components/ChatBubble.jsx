import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, VolumeX, Loader } from 'lucide-react';
import { speakMessage } from '../api.js';

const ChatBubble = ({ message, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Get audio from API with enhanced options
      const response = await speakMessage(message.content, {
        model_id: "eleven_multilingual_v2",
        voice_settings: JSON.stringify({
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }),
        language: "en"
      });
      
      if (response.success) {
        // Create audio URL from blob
        const audioUrl = URL.createObjectURL(response.data);
        
        // Create and play audio
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onplay = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          console.error('Audio playback error');
        };
        
        await audio.play();
      } else {
        console.error('Failed to generate speech:', response.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsLoading(false);
    }
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && message.isBot && !isPlaying && !isLoading) {
      // Small delay to ensure the message is fully rendered
      const timer = setTimeout(() => {
        handlePlayAudio();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, message.isBot]);

  return (
    <div className={`flex items-start space-x-3 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        message.isBot 
          ? 'bg-white text-black' 
          : 'bg-neutral-700 text-white'
      }`}>
        <span className="text-sm font-semibold">
          {message.isBot ? 'AI' : 'U'}
        </span>
      </div>

      {/* Message bubble */}
      <div className={`max-w-2xl ${message.isBot ? '' : 'text-right'}`}>
        <div className={`rounded-2xl px-4 py-3 relative group ${
          message.isBot
            ? 'bg-neutral-900 text-white border border-neutral-800'
            : 'bg-neutral-800 text-white'
        }`}>
          {/* Voice button for bot messages */}
          {message.isBot && (
            <button
              onClick={handlePlayAudio}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
              title={isPlaying ? "Stop audio" : "Play audio"}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 text-neutral-400 animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-neutral-400" />
              )}
            </button>
          )}

          {message.isBot ? (
            <div className="prose prose-invert prose-sm max-w-none pr-8">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-neutral-200">{children}</em>,
                  code: ({ children }) => <code className="bg-neutral-800 text-neutral-200 px-1 py-0.5 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-neutral-800 p-3 rounded-lg overflow-x-auto my-2">{children}</pre>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                  li: ({ children }) => <li className="text-neutral-200">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-neutral-600 pl-4 italic text-neutral-300 my-2">{children}</blockquote>,
                  h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium text-white mb-1">{children}</h3>,
                  a: ({ children, href }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="leading-relaxed">{message.content}</p>
          )}
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-neutral-500 mt-2 ${
          message.isBot ? 'text-left' : 'text-right'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;