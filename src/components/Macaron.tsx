import React, { useId } from 'react';
import { motion } from 'motion/react';

interface MacaronProps {
  color?: string;
  fillingColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  bitten?: boolean;
  biteColor?: string;
}

export const Macaron: React.FC<MacaronProps> = ({ 
  color = '#FCE4EC', 
  fillingColor = '#FFFFFF',
  size = 'md', 
  className = '',
  animate = false,
  bitten = false,
  biteColor = '#FFFFFF'
}) => {
  const rawId = useId();
  const biteId = `bite-${rawId.replace(/:/g, '')}`;
  
  const sizeMap = {
    sm: 'w-8 h-6',
    md: 'w-16 h-12',
    lg: 'w-24 h-18',
    xl: 'w-48 h-36'
  };

  const variants = {
    idle: { scale: 1 },
    jump: {
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      animate={animate ? "jump" : "idle"}
      className={`relative flex flex-col items-center justify-center ${sizeMap[size]} ${className}`}
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))' }}
    >
      {/* SVG ClipPath Definition */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id={biteId} clipPathUnits="objectBoundingBox">
            {/* A realistic jagged bite path on the right side */}
            <path d="M 0,0 L 0.85,0 C 0.82,0.1 0.78,0.2 0.82,0.3 C 0.75,0.35 0.75,0.45 0.82,0.5 C 0.75,0.55 0.75,0.65 0.82,0.7 C 0.78,0.8 0.82,0.9 0.85,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Macaron Content with ClipPath */}
        <motion.div 
          className="w-full h-full flex flex-col items-center justify-center"
          initial={false}
          animate={{ 
            clipPath: bitten ? `url(#${biteId})` : 'inset(0% 0% 0% 0%)',
          }}
          style={{
            WebkitClipPath: bitten ? `url(#${biteId})` : 'inset(0% 0% 0% 0%)'
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* Top half */}
          <div 
            className="w-full h-[40%] rounded-t-full border-b border-black/5 relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          </div>
          
          {/* Cream layer */}
          <div 
            className="w-[105%] h-[22%] rounded-full blur-[0.3px] z-10 -my-1 border-y border-black/10 flex items-center justify-center relative overflow-hidden shadow-inner"
            style={{ backgroundColor: fillingColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" />
          </div>
          
          {/* Bottom half */}
          <div 
            className="w-full h-[40%] rounded-b-full border-t border-black/5 relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30" />
          </div>
        </motion.div>

        {/* Crumbs - Outside the clip-path */}
        {bitten && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: [0, 10, 5], y: [0, 15, 25] }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute right-[10%] top-[40%] w-1.5 h-1.5 rounded-full z-40"
              style={{ backgroundColor: color }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: [0, 15, 10], y: [0, 10, 20] }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="absolute right-[5%] top-[50%] w-1 h-1 rounded-full z-40"
              style={{ backgroundColor: color }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: [0, 8, 12], y: [0, 20, 30] }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute right-[15%] top-[60%] w-1.2 h-1.2 rounded-full z-40"
              style={{ backgroundColor: color }}
            />
          </>
        )}
        
        {/* Shine effect - Always visible for smoothness */}
        <div className="absolute top-[10%] left-[10%] w-1/3 h-1/4 bg-white/40 rounded-full blur-[3px] pointer-events-none z-30" />
        <div className="absolute top-[15%] left-[15%] w-1/6 h-[10%] bg-white/60 rounded-full blur-[1px] pointer-events-none z-30" />
      </div>
    </motion.div>
  );
};
