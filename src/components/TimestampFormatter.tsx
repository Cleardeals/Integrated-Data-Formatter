import React, { useState } from 'react';
import { Clock, Copy, ArrowRight, Sparkles, Wand2, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

interface TimestampFormatterProps {
  onSwitchToProperty: (formattedText: string) => void;
}

const TimestampFormatter: React.FC<TimestampFormatterProps> = ({ onSwitchToProperty }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info' | 'confirm';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
  };

  const formatTimestamps = async () => {
    if (!inputText.trim()) {
      showModal('error', 'Input Required', 'Please paste your WhatsApp message before formatting.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    const timestampPattern = /\[\d{1,2}:\d{2}\s*(am|pm),\s*\d{1,2}\/\d{1,2}\/\d{4}\]/gi;

    const correctedText = inputText.replace(timestampPattern, (match) => {
      const [timePart, datePart] = match.slice(1, -1).split(',');
      const amPmMatch = timePart.match(/(am|pm)/i);
      const amPm = amPmMatch ? amPmMatch[0].toLowerCase() : '';
      let timeClean = timePart.replace(/\s*(am|pm)/i, '').trim();
      let [hours, minutes] = timeClean.split(':').map(num => parseInt(num));
      
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
      
      timeClean = `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
      const [day, month] = datePart.trim().split('/').slice(0, 2);
      return `[${parseInt(day)}/${parseInt(month)}, ${timeClean}]`;
    });

    setOutputText(correctedText);
    setIsProcessing(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
    
    if (correctedText !== inputText) {
      showModal('success', 'Formatting Complete!', 'Your WhatsApp timestamps have been successfully formatted with precision.');
    } else {
      showModal('info', 'Already Perfect!', 'Your message timestamps are already in the correct format.');
    }
  };

  const copyAndSwitch = async () => {
    if (!outputText.trim()) {
      showModal('error', 'No Output Available', 'Please format your message first before copying and switching.');
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      onSwitchToProperty(outputText);
      showModal('success', 'Success!', 'Text copied to clipboard and switched to Property Formatter.');
    } catch (err) {
      showModal('error', 'Copy Failed', 'Failed to copy to clipboard. Please try again or copy manually.');
    }
  };

  return (
    <div className="animate-slideInUp">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-8 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg animate-pulse-gentle">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>WhatsApp Timestamp Formatter</span>
          </h2>
          <p className="text-gray-300 text-lg">Automatically format and correct WhatsApp message timestamps</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="flex items-center text-lg font-semibold text-white">
              <Wand2 className="w-5 h-5 mr-3 text-purple-400" />
              Paste WhatsApp Message
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-all duration-300 resize-none text-base leading-relaxed hover:bg-white/10"
                placeholder="Paste your WhatsApp message here..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Format Button */}
          <div className="flex justify-center">
            <button
              onClick={formatTimestamps}
              disabled={isProcessing}
              className="group relative px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" />
                    <span>Formatting Magic...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Formatted!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Format Timestamps</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <label className="flex items-center text-lg font-semibold text-white">
              <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
              Formatted Output
            </label>
            <div className="relative">
              <textarea
                value={outputText}
                readOnly
                rows={10}
                className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 text-white resize-none text-base leading-relaxed font-mono"
                placeholder="Your beautifully formatted message will appear here..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={copyAndSwitch}
              disabled={!outputText.trim()}
              className="group relative px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Copy className="w-6 h-6" />
                <span>Copy & Switch to Property Formatter</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default TimestampFormatter;