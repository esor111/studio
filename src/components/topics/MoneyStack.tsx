
'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

const MoneyStack = ({ stackLayers } : { stackLayers: number }) => {
  const layers = Array.from({ length: stackLayers });
  
  return (
    <div className="relative w-[420px] h-[240px] mx-auto flex items-center justify-center">
        <motion.div
            className="relative w-[400px] h-[180px]"
            whileHover="hover"
            initial="initial"
        >
            {layers.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[400px] h-[180px] rounded-lg shadow-lg flex items-center justify-center"
                    style={{
                        bottom: 0,
                        left: 0,
                        zIndex: i,
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
                            y: i * -5,
                            x: i * -3,
                            rotate: -8 + i * 2.5,
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
                            y: i * -14,
                            x: i * 3,
                            rotate: -12 + i * 6,
                            transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }
                        }
                    }}
                    animate="animate"
                >
                    <Image 
                        src="https://kaha-assets-dev.s3.ap-south-1.amazonaws.com/4c394e41564623597e7023695f3325306f7b73384f5e5037356b4f61_1752563892542"
                        alt="Money bill"
                        width={400}
                        height={180}
                        className="w-full h-full object-cover rounded-lg border-2 border-green-700/50"
                        data-ai-hint="money currency"
                        priority={i < 3} // Prioritize loading the first few images
                    />
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
