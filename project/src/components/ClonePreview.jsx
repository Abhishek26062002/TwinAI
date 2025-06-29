import React from 'react';
import { X, Bot, Loader } from 'lucide-react';

const ClonePreview = ({ isOpen, onClose, content, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-neutral-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neutral-900 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Clone Preview
              </h3>
              <p className="text-sm text-neutral-400">
                See how your AI clone introduces itself
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-900 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                <p className="text-neutral-400">
                  Generating your AI clone's introduction...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 flex-1">
                  <p className="text-white leading-relaxed">
                    {content}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-400">
                  <strong className="text-white">Preview Note:</strong> This is how your AI clone will introduce itself to users. 
                  The actual responses will be more dynamic and contextual based on the conversation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-4 bg-neutral-900/50 border-t border-neutral-800">
            <button
              onClick={onClose}
              className="btn-primary ml-auto"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClonePreview;