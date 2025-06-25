import React, { useState, useEffect } from 'react';
import { Clock, Home, Sparkles, Zap, ArrowRight } from 'lucide-react';
import TimestampFormatter from './components/TimestampFormatter';
import PropertyFormatter from './components/PropertyFormatter';

function App() {
  const [currentView, setCurrentView] = useState<'timestamp' | 'property'>('timestamp');
  const [propertyInitialText, setPropertyInitialText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSwitchToProperty = (formattedText: string) => {
    setPropertyInitialText(formattedText);
    setCurrentView('property');
  };

  const handleBackToTimestamp = () => {
    setCurrentView('timestamp');
    setPropertyInitialText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center pt-12 pb-8 px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl animate-bounce-gentle">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-gradient-x">
            Integrated Formatter Suite
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional tools for WhatsApp message and property data formatting
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12 px-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20">
            <div className="flex space-x-2">
              <button
                onClick={handleBackToTimestamp}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  currentView === 'timestamp'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Timestamp Formatter</span>
                {currentView === 'timestamp' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-50 -z-10 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setCurrentView('property')}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  currentView === 'property'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Property Formatter</span>
                {currentView === 'property' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-50 -z-10 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {currentView === 'timestamp' ? (
              <TimestampFormatter onSwitchToProperty={handleSwitchToProperty} />
            ) : (
              <PropertyFormatter 
                initialText={propertyInitialText} 
                onBackToTimestamp={handleBackToTimestamp}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 px-6">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <Zap className="w-4 h-4" />
            <span>Powered by modern web technologies</span>
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;