import { useState } from "react";
import { BsRobot, BsX } from "react-icons/bs";

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 hover:scale-110 transition-all group"
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <BsX className="text-2xl" />
        ) : (
          <BsRobot className="text-2xl group-hover:animate-bounce" />
        )}
        
        {/* Pulse Animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20"></span>
        )}
      </button>

      {/* Coming Soon Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 rounded-2xl border border-white/10 bg-[#18181B] shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 px-5 py-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <BsRobot className="text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">AI Assistant</h3>
              <p className="text-xs text-neutral-400">Your career companion</p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 mb-4">
              <BsRobot className="text-3xl text-indigo-400" />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">
              Coming Soon!
            </h4>
            
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Our AI assistant will help you with resume reviews, interview preparation, application strategies, and personalized career advice.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/30 border border-indigo-500/20">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-300">
                Under Development
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 text-xs text-neutral-500">
              Expected Launch: Q2 2027
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
