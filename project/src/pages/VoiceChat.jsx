import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { getProfile } from '../api.js';

const VoiceChat = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    initializeSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const loadProfile = async () => {
    const response = await getProfile();
    if (response.success) {
      setProfile(response.data);
    } else {
      setProfile({ 
        identity: { preferred_name: 'AI Assistant' },
        name: 'AI Assistant' 
      });
    }
    setLoading(false);
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  const startListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceInput = async (text) => {
    setIsProcessing(true);
    
    try {
      const uid = sessionStorage.getItem('uid');
      if (!uid) throw new Error('No user ID found');

      // Get the user's profile to fetch voice_id
      const profileResponse = await getProfile(uid);
      console.log('Profile Response:', profileResponse);
      let voiceId = "wDxs3TZ5uaeV7cm9U5LD"; // Default voice_id
      
      if (profileResponse) {
        voiceId = profileResponse.data.voice_id;
      }
      console.log('Using voice_id:', voiceId);
      // Prepare the payload following the exact schema
      const payload = {
        user_id: uid,
        message: text,
        voice_id: voiceId,
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: "",
        language: "en"
      };

      // Call /chat/speak endpoint
      const response = await fetch('https://rz7fp2tv-8006.inc1.devtunnels.ms//chat/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      // Check content type to determine how to handle response
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('audio')) {
        // Response is direct audio (MP3/WAV)
        const audioBlob = await response.blob();
        const aiResponse = `AI responded with voice (${Math.round(audioBlob.size / 1024)}KB audio)`;
        setResponse(aiResponse);
        
        // Add to conversation history
        setConversationHistory(prev => [...prev, 
          { type: 'user', content: text, timestamp: new Date() },
          { type: 'ai', content: aiResponse, timestamp: new Date() }
        ]);
        
        // Play the audio directly
        await playAudioFromBlob(audioBlob);
        
      } else {
        // Response is JSON
        const responseData = await response.json();
        
        // Handle different possible response formats
        if (responseData.audio_url) {
          // Audio URL provided
          const aiResponse = responseData.text || responseData.message || "AI voice response";
          setResponse(aiResponse);
          
          setConversationHistory(prev => [...prev, 
            { type: 'user', content: text, timestamp: new Date() },
            { type: 'ai', content: aiResponse, timestamp: new Date() }
          ]);
          
          await playAudioFromUrl(responseData.audio_url);
          
        } else if (responseData.audio) {
          // Base64 audio data
          const aiResponse = responseData.text || responseData.message || "AI voice response";
          setResponse(aiResponse);
          
          setConversationHistory(prev => [...prev, 
            { type: 'user', content: text, timestamp: new Date() },
            { type: 'ai', content: aiResponse, timestamp: new Date() }
          ]);
          
          await playAudioFromBase64(responseData.audio);
          
        } else {
          // Text-only response (fallback)
          const aiResponse = responseData.text || responseData.message || responseData.response || "I'm here to help!";
          setResponse(aiResponse);
          
          setConversationHistory(prev => [...prev, 
            { type: 'user', content: text, timestamp: new Date() },
            { type: 'ai', content: aiResponse, timestamp: new Date() }
          ]);
        }
      }

    } catch (error) {
      console.error('Error processing voice input:', error);
      const fallbackResponse = "I'm sorry, I couldn't process your request. Please try again.";
      setResponse(fallbackResponse);
      
      // Add error to conversation history
      setConversationHistory(prev => [...prev, 
        { type: 'user', content: text, timestamp: new Date() },
        { type: 'ai', content: fallbackResponse, timestamp: new Date() }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioFromBlob = async (audioBlob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio from blob:', error);
      setIsPlaying(false);
    }
  };

  const playAudioFromUrl = async (audioUrl) => {
    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio from URL:', error);
      setIsPlaying(false);
    }
  };

  const playAudioFromBase64 = async (base64Audio) => {
    try {
      // Remove data URL prefix if present
      const base64Data = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
      
      await playAudioFromBlob(audioBlob);
    } catch (error) {
      console.error('Error playing audio from base64:', error);
      setIsPlaying(false);
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const resetConversation = () => {
    setTranscript('');
    setResponse('');
    setConversationHistory([]);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
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
      <div className="flex items-center justify-between p-6 border-b border-neutral-800">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-neutral-900 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-semibold text-white text-lg">
              Voice Chat with {userName}
            </h1>
            <p className="text-sm text-neutral-400">
              Speak naturally and get voice responses
            </p>
          </div>
        </div>

        <button
          onClick={resetConversation}
          className="p-2 hover:bg-neutral-900 rounded-lg transition-colors duration-200"
          title="Reset conversation"
        >
          <RotateCcw className="w-6 h-6 text-neutral-400" />
        </button>
      </div>

      {/* Main Voice Interface */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Voice Visualizer */}
        <div className="mb-12">
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'border-red-500 bg-red-500/10 animate-pulse' 
              : isProcessing
              ? 'border-yellow-500 bg-yellow-500/10'
              : isPlaying
              ? 'border-green-500 bg-green-500/10 animate-pulse'
              : 'border-neutral-600 bg-neutral-900/50'
          }`}>
            {isListening ? (
              <Mic className="w-12 h-12 text-red-500" />
            ) : isProcessing ? (
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Volume2 className="w-12 h-12 text-green-500" />
            ) : (
              <Mic className="w-12 h-12 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {isListening 
              ? 'Listening...' 
              : isProcessing 
              ? 'Processing...' 
              : isPlaying 
              ? 'Speaking...'
              : 'Ready to chat'
            }
          </h2>
          <p className="text-neutral-400">
            {isListening 
              ? 'Speak now, I\'m listening' 
              : isProcessing 
              ? 'Understanding your message' 
              : isPlaying 
              ? 'Playing response'
              : 'Tap the microphone to start talking'
            }
          </p>
        </div>

        {/* Transcript and Response */}
        {(transcript || response) && (
          <div className="w-full max-w-2xl space-y-6 mb-8">
            {transcript && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">You said:</h3>
                <p className="text-white text-lg leading-relaxed">{transcript}</p>
              </div>
            )}
            
            {response && (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-400">{userName} responded:</h3>
                  {audioRef.current && (
                    <button
                      onClick={toggleAudioPlayback}
                      className="p-2 hover:bg-neutral-700 rounded-lg transition-colors duration-200"
                      title={isPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-white text-lg leading-relaxed">{response}</p>
              </div>
            )}
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || !speechSupported}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          {audioRef.current && (
            <button
              onClick={toggleAudioPlayback}
              className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-all duration-200"
              title={isPlaying ? "Pause audio" : "Replay audio"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Instructions */}
        {!speechSupported && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-xl max-w-md">
            <p className="text-red-400 text-sm text-center">
              Voice input is not supported in your browser. Please try Chrome, Safari, or Edge.
            </p>
          </div>
        )}

        {conversationHistory.length === 0 && speechSupported && (
          <div className="mt-8 p-4 bg-neutral-900 border border-neutral-800 rounded-xl max-w-md">
            <p className="text-neutral-400 text-sm text-center">
              This is a voice-first experience. Speak naturally and get instant voice responses from your AI clone.
            </p>
          </div>
        )}
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="border-t border-neutral-800 p-6">
          <h3 className="text-white font-medium mb-4">Recent Conversation</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {conversationHistory.slice(-4).map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  item.type === 'user' 
                    ? 'bg-neutral-700 text-white' 
                    : 'bg-white text-black'
                }`}>
                  {item.type === 'user' ? 'U' : 'AI'}
                </div>
                <p className="text-neutral-300 text-sm flex-1 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;