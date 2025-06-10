import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Sparkles, Zap, MessageCircle } from 'lucide-react';
import apiService from '../services/api';

function UploadModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [enableAI, setEnableAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [suggestedCaptions, setSuggestedCaptions] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(selectedFile);
      setPreview(e.target.result);
      handleAIFeatures(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAIFeatures = async (imageUrl) => {
    if (!enableAI) return;
    
    try {
      setLoading(true);
      
      // Get all AI features in parallel
      const [dripScore, styleTips, captions] = await Promise.all([
        apiService.getDripScore(imageUrl, caption),
        apiService.getStyleTips(imageUrl, caption),
        apiService.generateCaptions(imageUrl)
      ]);
      
      setAiResults({
        score: dripScore.data,
        tips: styleTips.data,
      });
      setSuggestedCaptions(captions.data.captions);
      
    } catch (error) {
      console.error('AI features error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      // Convert file to base64 for upload
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        
        const outfitData = {
          image: base64Image,
          caption,
          isForSale,
          price: isForSale ? parseFloat(price) : null,
          sizes: isForSale ? sizes : [],
          enableAI
        };

        await apiService.createOutfit(outfitData);
        
        // Reset form and close modal
        setFile(null);
        setPreview(null);
        setCaption('');
        setAiResults(null);
        setSuggestedCaptions([]);
        onClose();
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const useSuggestedCaption = (suggestion) => {
    setCaption(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="upload-modal p-8 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-white">Drop Your Fit 🔥</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div
                className={`drag-zone border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? 'border-electric-cyan bg-electric-cyan bg-opacity-10' : 'border-soft-purple border-opacity-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setAiResults(null);
                        setSuggestedCaptions([]);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera size={48} className="mx-auto text-soft-purple mb-4" />
                    <p className="text-white mb-2">Drag & drop your fit or click to browse</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary px-6 py-2 rounded-full"
                    >
                      <Upload size={20} className="inline mr-2" />
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {/* AI Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableAI"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                  className="w-5 h-5 text-soft-purple bg-gray-100 border-gray-300 rounded focus:ring-soft-purple"
                />
                <label htmlFor="enableAI" className="text-white flex items-center">
                  <Sparkles size={20} className="mr-2 text-electric-cyan" />
                  Enable AI Drip Score & Style Tips
                </label>
              </div>

              {/* AI Results */}
              {aiResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-xl border border-soft-purple border-opacity-30"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Zap size={20} className="mr-2 text-electric-cyan" />
                    AI Drip Analysis
                  </h3>
                  
                  {/* Drip Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Drip Score</span>
                      <span className="text-2xl font-bold text-electric-cyan">
                        {aiResults.score.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-soft-purple to-electric-cyan h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${aiResults.score.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-300 mt-2 italic">"{aiResults.score.comment}"</p>
                  </div>

                  {/* Style Tips */}
                  {aiResults.tips.tips.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Style Tips</h4>
                      <ul className="space-y-1">
                        {aiResults.tips.tips.map((tip, index) => (
                          <li key={index} className="text-gray-300 text-sm">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Caption Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Caption your drip
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell us about this fit..."
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-soft-purple focus:ring-1 focus:ring-soft-purple"
                  rows={3}
                />
              </div>

              {/* Suggested Captions */}
              {suggestedCaptions.length > 0 && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2 flex items-center">
                    <MessageCircle size={16} className="mr-2" />
                    AI Caption Suggestions
                  </label>
                  <div className="space-y-2">
                    {suggestedCaptions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => useSuggestedCaption(suggestion)}
                        className="block w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-sm border border-gray-600 hover:border-soft-purple"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* For Sale Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="forSale"
                    checked={isForSale}
                    onChange={(e) => setIsForSale(e.target.checked)}
                    className="w-5 h-5 text-soft-purple bg-gray-100 border-gray-300 rounded focus:ring-soft-purple"
                  />
                  <label htmlFor="forSale" className="text-white">
                    List for sale in marketplace
                  </label>
                </div>

                {isForSale && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    {/* Price Input */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Price (KES)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2500"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-soft-purple focus:ring-1 focus:ring-soft-purple"
                      />
                    </div>

                    {/* Size Selection */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Available Sizes
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setSizes(prev => 
                                prev.includes(size) 
                                  ? prev.filter(s => s !== size)
                                  : [...prev, size]
                              );
                            }}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              sizes.includes(size)
                                ? 'bg-soft-purple border-soft-purple text-white'
                                : 'border-gray-600 text-gray-300 hover:border-soft-purple'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Drop the Fit 🔥'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UploadModal;
