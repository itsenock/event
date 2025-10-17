import React from "react";
import { motion } from "framer-motion";
import { PlusIcon, CalendarIcon } from "@heroicons/react/24/outline";

type Props = {
  onClick: () => void;
};

const FloatingButton: React.FC<Props> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        y: -2
      }}
      whileTap={{ 
        scale: 0.95,
        y: 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Main Button */}
      <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 backdrop-blur-sm">
        
        {/* Icon Container */}
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5" />
        </motion.div>
        
        {/* Text */}
        <span className="font-semibold text-sm whitespace-nowrap">
          Create Event
        </span>
        
        {/* Secondary Icon */}
        <CalendarIcon className="h-4 w-4 opacity-80" />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
      
      {/* Pulse Animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-md -z-10"
      />
    </motion.button>
  );
};

export default FloatingButton;