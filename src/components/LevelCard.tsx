import React from 'react';
import { Level } from '../types';
import { Macaron } from './Macaron';
import { motion } from 'motion/react';

interface LevelCardProps {
  level: Level;
  title: string;
  flavor: string;
  colors: { bg: string; accent: string; macaron: string };
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  title,
  flavor,
  colors,
  description,
  isSelected,
  onSelect
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative w-full p-6 rounded-3xl text-left transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-slate-400 shadow-lg' 
          : 'border-transparent shadow-sm hover:shadow-md'
      }`}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 opacity-70">
            {level}
          </span>
          <h3 className="text-xl font-bold mt-1">{title}</h3>
          <p className="text-sm font-medium text-slate-600 mt-1 italic">{flavor}</p>
        </div>
        <Macaron color={colors.macaron} size="md" animate={isSelected} />
      </div>
      <p className="text-sm text-slate-500 mt-4 leading-relaxed">
        {description}
      </p>
      
      {isSelected && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-full font-bold"
        >
          SELECTED
        </motion.div>
      )}
    </motion.button>
  );
};
