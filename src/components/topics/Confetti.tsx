
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfettiPiece = ({ x, y, color, size, delay }: {x: number, y: number, color: string, size: number, delay: number}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ 
        x: x, 
        y: -10, 
        opacity: 1,
        scale: 1,
        rotate: 0
      }}
      animate={{ 
        x: x + (Math.random() - 0.5) * 200,
        y: window.innerHeight + 100,
        opacity: 0,
        scale: 0,
        rotate: 360
      }}
      transition={{ 
        duration: 3,
        delay: delay,
        ease: "easeOut"
      }}
      style={{
        position: 'fixed',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    />
  );
};

const CustomConfetti = ({ isVisible, onComplete }: {isVisible: boolean, onComplete?: () => void}) => {
  const [pieces, setPieces] = useState<React.ReactNode[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isVisible && isClient) {
      const newPieces = [];
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
      
      for (let i = 0; i < 100; i++) {
        newPieces.push(
          <ConfettiPiece
            key={i}
            x={Math.random() * window.innerWidth}
            y={0}
            color={colors[Math.floor(Math.random() * colors.length)]}
            size={Math.random() * 8 + 4}
            delay={Math.random() * 2}
          />
        );
      }
      setPieces(newPieces);
    }
  }, [isVisible, isClient]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
          {pieces}
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomConfetti;
