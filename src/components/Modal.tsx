import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Download, Sparkles } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-400" />;
      case 'confirm':
        return <Download className="w-8 h-8 text-amber-400" />;
      default:
        return <Info className="w-8 h-8 text-blue-400" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 'confirm':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />
      <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-500 animate-modalSlideIn border border-white/20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl"></div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                {getIcon()}
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 mb-8 leading-relaxed text-lg">{message}</p>
          
          <div className="flex justify-end space-x-3">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-300 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={type === 'confirm' ? onConfirm : onClose}
              className={`px-8 py-3 text-white rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg ${getButtonColor()}`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>{type === 'confirm' ? confirmText : 'OK'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;