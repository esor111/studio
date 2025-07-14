
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlyingNote = ({ isVisible, type, onComplete }: { isVisible: boolean, type: string, onComplete: () => void }) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (type === 'fly-in') {
      setStartPos({ x: window.innerWidth - 100, y: 50 });
      setEndPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } else if (type === 'fly-out') {
      setStartPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setEndPos({ x: window.innerWidth / 2, y: window.innerHeight + 100 });
    }
  }, [type, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            position: 'fixed',
            x: startPos.x,
            y: startPos.y,
            scale: 1,
            opacity: 1,
            zIndex: 1000,
            rotate: 0
          }}
          animate={{
            x: endPos.x,
            y: endPos.y,
            scale: type === 'fly-out' ? 0.3 : 1,
            opacity: type === 'fly-out' ? 0 : 1,
            rotate: type === 'fly-in' ? 360 : -180
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut"
          }}
          onAnimationComplete={onComplete}
          className="w-24 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg shadow-lg border-2 border-yellow-500 flex items-center justify-center text-black font-bold text-lg"
          style={{
            backgroundImage: 'linear-gradient(45deg, #FFD700 25%, transparent 25%), linear-gradient(-45deg, #FFD700 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFD700 75%), linear-gradient(-45deg, transparent 75%, #FFD700 75%)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
          }}
        >
          ₹
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlyingNote;
