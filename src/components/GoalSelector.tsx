import React from 'react';
import { Sweetness } from '../types';
import { motion } from 'motion/react';

interface GoalSelectorProps {
  selectedGoal: Sweetness;
  onSelect: (goal: Sweetness) => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({ selectedGoal, onSelect }) => {
  const goals = [
    { value: Sweetness.MICRO, label: '微糖', desc: '10 词/日', sub: '忙碌生活里的一点小确幸' },
    { value: Sweetness.HALF, label: '半糖', desc: '20 词/日', sub: '刚刚好的进步节奏' },
    { value: Sweetness.FULL, label: '全糖', desc: '50 词/日', sub: '元气满满的学习动力' },
    { value: Sweetness.EXTRA, label: '多加糖', desc: '100 词/日', sub: '挑战极限的学霸盛宴' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {goals.map((goal) => (
        <motion.button
          key={goal.value}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(goal.value)}
          className={`p-4 rounded-2xl text-left transition-all ${
            selectedGoal === goal.value
              ? 'bg-slate-800 text-white shadow-md'
              : 'bg-white text-slate-800 border border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{goal.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedGoal === goal.value ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {goal.desc}
            </span>
          </div>
          <p className={`text-[10px] mt-1 opacity-70 leading-tight`}>
            {goal.sub}
          </p>
        </motion.button>
      ))}
    </div>
  );
};
