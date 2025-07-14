
'use client'
import { motion } from 'framer-motion';

const MoneyStack = ({ stackLayers } : { stackLayers: number }) => {
  const layers = [];
  
  for (let i = 0; i < stackLayers; i++) {
    layers.push(
      <motion.div
        key={i}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: i * 0.1 }}
        className="absolute"
        style={{
          bottom: `${i * 12}px`,
          left: `${i * 2}px`,
          transform: `rotate(${i * 5}deg)`,
          zIndex: i
        }}
      >
        <div 
          className="w-24 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg shadow-lg border-2 border-yellow-500 flex items-center justify-center text-black font-bold text-lg"
          style={{
            backgroundImage: 'linear-gradient(45deg, #FFD700 25%, transparent 25%), linear-gradient(-45deg, #FFD700 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFD700 75%), linear-gradient(-45deg, transparent 75%, #FFD700 75%)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
          }}
        >
          ₹
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-32 h-32 mx-auto">
      {layers}
      {stackLayers === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No money yet
        </div>
      )}
    </div>
  );
};

export default MoneyStack;
