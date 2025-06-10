import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, MessageCircle, Copy, Check } from 'lucide-react';
import apiService from '../services/api';

function AIFeaturesPanel({ outfit, onClose }) {
  const [activeTab, setActiveTab] = useState('score');
  const [styleTips, setStyleTips] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(null);

  const getStyleTips = async () => {
    if (styleTips) return; // Already loaded
    
    setLoading(true);
    try {
      const result = await apiService.getStyleTips(outfit.imageUrl, outfit.caption);
      setStyleTips(result.data);
    } catch (error) {
      console.error('Failed to get style tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCaptions = async () => {
    if (captions) return; // Already loaded
    
    setLoading(true);
    try {
      const result = await apiService.generateCaptions(outfit.imageUrl);
      setCaptions(result.data);
    } catch (error) {
      console.error('Failed to generate captions:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = async (caption, index) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(index);
      setTimeout(() => setCopiedCaption(null), 2000);
    } catch (error) {
      console.error('Failed to copy caption:', error);
    }
  };

  const tabs = [
    { id: 'score', label: 'Drip Score', icon: Sparkles },
    { id: 'tips', label: 'Style Tips', icon: Lightbulb },
    { id: 'captions', label: 'Captions', icon: MessageCircle },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card border border-soft-purple/30 rounded-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-soft-purple/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading text-white flex items-center">
              <Sparkles size={24} className="mr-3 text-electric-cyan" />
              AI Fashion Assistant
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Outfit Preview */}
          <div className="mt-4 flex items-center space-x-3">
            <img
              src={outfit.imageUrl}
              alt="Outfit"
              className="w-12 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                @{outfit.user?.name || 'fashionista'}
              </p>
              <p className="text-gray-300 text-xs">
                {outfit.caption?.slice(0, 50)}...
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-soft-purple/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'tips') getStyleTips();
                  if (tab.id === 'captions') generateCaptions();
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-electric-cyan border-b-2 border-electric-cyan bg-electric-cyan/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={16} className="inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'score' && (
              <motion.div
                key="score"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {outfit.aiScore ? (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="text-6xl font-bold text-electric-cyan mb-2">
                        {outfit.aiScore.score}
                      </div>
                      <div className="text-gray-300 text-sm">out of 100</div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-soft-purple to-electric-cyan h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${outfit.aiScore.score}%` }}
                      ></div>
                    </div>
                    
                    <blockquote className="text-white italic text-lg leading-relaxed">
                      "{outfit.aiScore.comment}"
                    </blockquote>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No AI score available for this outfit</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-cyan mx-auto mb-4"></div>
                    <p className="text-gray-400">Getting style tips...</p>
                  </div>
                ) : styleTips ? (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Lightbulb size={20} className="mr-2 text-drip-green" />
                      AI Style Recommendations
                    </h3>
                    {styleTips.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-drip-green/10 border border-drip-green/20"
                      >
                        <p className="text-white">{tip}</p>
                      </div>
                    ))}
                  </div>
                ) : outfit.styleTips?.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Lightbulb size={20} className="mr-2 text-drip-green" />
                      Style Tips
                    </h3>
                    {outfit.styleTips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-drip-green/10 border border-drip-green/20"
                      >
                        <p className="text-white">{tip.tip}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Click to generate fresh style tips!</p>
                    <button
                      onClick={getStyleTips}
                      className="mt-4 btn-primary px-6 py-2 rounded-full"
                    >
                      Get Tips ✨
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'captions' && (
              <motion.div
                key="captions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-cyan mx-auto mb-4"></div>
                    <p className="text-gray-400">Generating captions...</p>
                  </div>
                ) : captions ? (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <MessageCircle size={20} className="mr-2 text-neon-peach" />
                      AI Caption Suggestions
                    </h3>
                    {captions.captions.map((caption, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-neon-peach/10 border border-neon-peach/20 flex items-center justify-between group"
                      >
                        <p className="text-white flex-1">"{caption}"</p>
                        <button
                          onClick={() => copyCaption(caption, index)}
                          className="ml-3 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCaption === index ? (
                            <Check size={16} className="text-drip-green" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : outfit.suggestedCaptions?.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <MessageCircle size={20} className="mr-2 text-neon-peach" />
                      Suggested Captions
                    </h3>
                    {outfit.suggestedCaptions.map((caption, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-neon-peach/10 border border-neon-peach/20 flex items-center justify-between"
                      >
                        <p className="text-white flex-1">"{caption}"</p>
                        <button
                          onClick={() => copyCaption(caption, index)}
                          className="ml-3 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCaption === index ? (
                            <Check size={16} className="text-drip-green" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Generate fire captions for this fit!</p>
                    <button
                      onClick={generateCaptions}
                      className="mt-4 btn-primary px-6 py-2 rounded-full"
                    >
                      Generate Captions 🔥
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AIFeaturesPanel;
