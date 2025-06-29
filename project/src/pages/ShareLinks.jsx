import React, { useState, useEffect } from 'react';
import { MessageCircle, Instagram, Copy, Check, ExternalLink, Mic, Send, Activity, RefreshCw, AlertCircle } from 'lucide-react';

const ShareLinks = () => {
  const [shareLinks, setShareLinks] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  
  // Get user ID from URL params or storage
  const getUidFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
  };
  
  const uid = getUidFromUrl() || sessionStorage.getItem('uid') || 'demo-user-123';

  const iconMap = {
    MessageCircle,
    Instagram,
    Mic,
    Send,
    ExternalLink
  };

  // Mock data for demonstration (replace with actual API calls)
  const mockShareLinks = {
    webchat: {
      title: "Text Chat",
      description: "Traditional chat interface with text and voice responses",
      url: `${window.location.origin}/chat?uid=${uid}`,
      platform: "web",
      icon: "MessageCircle",
      color: "bg-blue-500"
    },
    voicechat: {
      title: "Voice Chat", 
      description: "Hands-free voice conversation experience",
      url: `${window.location.origin}/voice?uid=${uid}`,
      platform: "voice",
      icon: "Mic",
      color: "bg-purple-500"
    },
    whatsapp: {
      title: "WhatsApp",
      description: "Chat via WhatsApp messaging",
      url: `https://wa.me/+14155238886?text=clone%3A%20${uid}`,
      platform: "whatsapp", 
      icon: "MessageCircle",
      color: "bg-green-500"
    },
    telegram: {
      title: "Telegram",
      description: "Chat via Telegram bot",
      url: `https://t.me/your_bot?start=${uid}`,
      platform: "telegram",
      icon: "Send", 
      color: "bg-blue-400"
    },
    instagram: {
      title: "Instagram DM",
      description: "Direct message on Instagram", 
      url: "https://ig.me/m/your_handle",
      platform: "instagram",
      icon: "Instagram",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    }
  };

  // Fetch share links from backend
  useEffect(() => {
    const fetchShareLinks = async () => {
      if (!uid) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an actual API call:
        // const response = await fetch(`/webhook/share-links/${uid}`);
        // const data = await response.json();
        
        // For now, use mock data
        setShareLinks(mockShareLinks);
        sessionStorage.setItem('uid', uid);
        
      } catch (err) {
        console.error('Error fetching share links:', err);
        setError('Failed to load share links. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShareLinks();
  }, [uid]);

  // Fetch user activity (mock data)
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!uid) return;
      
      try {
        // Mock activity data
        setUserActivity({
          user_id: uid,
          platform: 'web',
          message_count: 42,
          last_activity: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error fetching user activity:', err);
      }
    };

    setTimeout(fetchUserActivity, 1500);
  }, [uid]);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShareAction = (option) => {
    if (option.platform === 'web' || option.platform === 'voice') {
      // Internal navigation
      window.location.href = option.url;
    } else {
      // External link
      window.open(option.url, '_blank');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setShareLinks(mockShareLinks);
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your AI clone share links...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!shareLinks) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400">No share links available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your AI Clone is Ready! 🎉
          </h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto mb-4">
            Choose how you want to interact with your AI clone
          </p>
          
          {/* User Activity Stats */}
          {userActivity && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900 bg-opacity-20 border border-blue-800 rounded-full text-blue-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">
                {userActivity.message_count} messages • Last active: {
                  userActivity.last_activity 
                    ? new Date(userActivity.last_activity).toLocaleDateString()
                    : 'Never'
                }
              </span>
            </div>
          )}
        </div>

        {/* Share options */}
        <div className="space-y-6">
          {Object.entries(shareLinks).map(([key, option], index) => {
            const IconComponent = iconMap[option.icon] || MessageCircle;
            
            return (
              <div
                key={key}
                className="bg-gray-800 bg-opacity-80 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-gray-600 transition-all duration-200 opacity-0 animate-slide-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${option.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {option.title}
                      </h3>
                      <p className="text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShareAction(option)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
                    >
                      <span>
                        {option.platform === 'web' || option.platform === 'voice' 
                          ? `Open ${option.title}` 
                          : `Chat on ${option.title}`
                        }
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(option.url, key)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white p-3 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      {copiedStates[key] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Link preview */}
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <code className="text-sm text-gray-400 break-all">
                    {option.url}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success message & actions */}
        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-900 bg-opacity-20 border border-green-800 rounded-full text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Clone successfully created and deployed</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={refreshData}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Links</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-gray-900 bg-opacity-50 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">How to use:</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• <strong className="text-gray-300">WhatsApp:</strong> Message the bot with "clone: {uid} [your message]"</li>
            <li>• <strong className="text-gray-300">Telegram:</strong> Use /start command with your user ID, then chat normally</li>
            <li>• <strong className="text-gray-300">Web/Voice:</strong> Click the buttons above to open the chat interfaces</li>
            <li>• <strong className="text-gray-300">Instagram:</strong> Send a DM to the configured Instagram account</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShareLinks;