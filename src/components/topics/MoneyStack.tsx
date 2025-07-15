
'use client'
import { motion } from 'framer-motion';

const MoneyStack = ({ stackLayers } : { stackLayers: number }) => {
  const layers = Array.from({ length: stackLayers });
  
  return (
    <div className="relative w-52 h-48 mx-auto flex items-center justify-center">
        <motion.div
            className="relative w-40 h-24"
            whileHover="hover"
            initial="initial"
        >
            {layers.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-40 h-24 rounded-lg shadow-lg border-2 border-green-700/50 flex items-center justify-center text-green-900 font-bold text-2xl"
                    style={{
                        bottom: 0,
                        left: 0,
                        zIndex: i,
                        backgroundImage: 'linear-gradient(to right, #6ee7b7, #34d399, #059669)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}
                    variants={{
                        initial: {
                            y: i * -2,
                            x: i * -2,
                            rotate: -4 + i * 1.5,
                            scale: i === 0 ? 1 : 0,
                            opacity: i === 0 ? 1 : 0,
                        },
                        animate: {
                            y: i * -4,
                            x: i * -2,
                            rotate: -6 + i * 2,
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                                delay: i * 0.08,
                            }
                        },
                        hover: {
                            y: i * -12,
                            x: i * 2,
                            rotate: -10 + i * 5,
                            transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }
                        }
                    }}
                    animate="animate"
                >
                    <span style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>₹</span>
                </motion.div>
            ))}
        </motion.div>
      {stackLayers === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No money yet
        </div>
      )}
    </div>
  );
};

export default MoneyStack;
