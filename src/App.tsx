import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, Sweetness, UserProgress } from './types';
import { words } from './data/words';
import { Macaron } from './components/Macaron';
import { LevelCard } from './components/LevelCard';
import { GoalSelector } from './components/GoalSelector';
import { LearningSession } from './components/LearningSession';
import { Sparkles, Calendar, Trophy, Settings, Play } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [sessionWords, setSessionWords] = useState<typeof words>([]);
  const [view, setView] = useState<'home' | 'learning' | 'summary'>('home');
  const [progress, setProgress] = useState<UserProgress>({
    learnedCount: 0,
    dailyGoal: Sweetness.HALF,
    streak: 3,
    medals: ['2026-03-04', '2026-03-05', '2026-03-06'],
    currentLevel: Level.A1_A2,
    learnedWords: []
  });

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartLearning = () => {
    const filtered = words.filter(w => 
      w.level === progress.currentLevel && 
      !progress.learnedWords.includes(w.id)
    );
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, progress.dailyGoal);
    setSessionWords(selected);
    setView('learning');
  };

  const handleComplete = (learnedIds: string[]) => {
    setProgress(prev => ({
      ...prev,
      learnedCount: prev.learnedCount + learnedIds.length,
      learnedWords: [...prev.learnedWords, ...learnedIds],
      medals: [...prev.medals, new Date().toISOString().split('T')[0]]
    }));
    setView('summary');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-ballet-rosa flex flex-col items-center justify-center">
        <div className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]">
          <Macaron size="xl" animate color="#FCE4EC" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Maca-Maca</h1>
          <p className="text-slate-400 mt-2 font-medium italic">Deutsch lernen, so süß wie ein Macaron.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto p-6"
          >
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-bold">Maca-Maca</h1>
                <p className="text-slate-400 text-sm font-medium">Guten Morgen, Lerner!</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Settings className="w-6 h-6 text-slate-400" />
              </div>
            </header>

            {/* Stats Card */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm mb-8 border border-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="font-bold text-sm">今日甜度</span>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                  {progress.learnedCount >= progress.dailyGoal ? (
                    <span className="text-pink-500 flex items-center gap-1">
                      目标达成! <Sparkles className="w-3 h-3" />
                    </span>
                  ) : (
                    `${progress.learnedCount} / ${progress.dailyGoal} 词`
                  )}
                </div>
              </div>
              
              <div className="relative h-4 bg-slate-50 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progress.learnedCount / progress.dailyGoal) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-pink-200 to-pink-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{progress.streak}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">连胜天数</div>
                </div>
                <div className="text-center border-x border-slate-100">
                  <div className="text-xl font-bold">{progress.medals.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">获得勋章</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">A2</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">当前等级</div>
                </div>
              </div>
            </div>

            {/* Level Selection */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold">选择你的口味</h2>
              </div>
              <div className="space-y-4">
                <LevelCard 
                  level={Level.A1_A2}
                  title="初级入门"
                  flavor="香草海盐"
                  colors={{ bg: '#F0F9FF', accent: '#BAE6FD', macaron: '#BAE6FD' }}
                  description="基础名词、打招呼、生活碎碎念。适合刚开始接触德语的你。"
                  isSelected={progress.currentLevel === Level.A1_A2}
                  onSelect={() => setProgress(p => ({ ...p, currentLevel: Level.A1_A2 }))}
                />
                <LevelCard 
                  level={Level.B1_B2}
                  title="进阶日常"
                  flavor="清爽薄荷"
                  colors={{ bg: '#F0FDF4', accent: '#BBF7D0', macaron: '#BBF7D0' }}
                  description="复句、语法进阶、职场日常。让你的表达更地道、更丰富。"
                  isSelected={progress.currentLevel === Level.B1_B2}
                  onSelect={() => setProgress(p => ({ ...p, currentLevel: Level.B1_B2 }))}
                />
                <LevelCard 
                  level={Level.C1_C2}
                  title="深度探讨"
                  flavor="梦幻薰衣草"
                  colors={{ bg: '#FAF5FF', accent: '#E9D5FF', macaron: '#E9D5FF' }}
                  description="德语新闻、深度探讨、文学赏析。挑战德语学习的巅峰。"
                  isSelected={progress.currentLevel === Level.C1_C2}
                  onSelect={() => setProgress(p => ({ ...p, currentLevel: Level.C1_C2 }))}
                />
              </div>
            </section>

            {/* Goal Selection */}
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold">设定每日甜度</h2>
              </div>
              <GoalSelector 
                selectedGoal={progress.dailyGoal}
                onSelect={(goal) => setProgress(p => ({ ...p, dailyGoal: goal }))}
              />
            </section>
          </motion.div>
        )}

        {view === 'learning' && (
          <LearningSession 
            key="learning"
            words={sessionWords}
            level={progress.currentLevel}
            onComplete={handleComplete}
            onExit={() => setView('home')}
          />
        )}

        {view === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center overflow-hidden"
          >
            {/* Floating Celebration Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth - window.innerWidth / 2, 
                  y: window.innerHeight + 100,
                  rotate: 0,
                  opacity: 0.8
                }}
                animate={{ 
                  y: -100,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute pointer-events-none"
              >
                <Macaron 
                  size="sm" 
                  color={['#FCE4EC','#E1F5FE','#E8F5E9','#FFFDE7','#F3E5F5'][i%5]} 
                />
              </motion.div>
            ))}

            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <Macaron size="xl" color="#FCE4EC" />
            </motion.div>
            <h2 className="text-4xl font-bold mt-12 mb-4">太棒了!</h2>
            <p className="text-slate-500 mb-12 max-w-xs mx-auto">
              你今天已经完成了学习目标，获得了一颗新的“马卡龙勋章”。
            </p>
            
            <div className="w-full max-w-xs bg-slate-50 rounded-3xl p-6 mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-400">本周进度</span>
                <span className="text-sm font-bold text-pink-400">4 / 7</span>
              </div>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i <= 4 ? 'bg-pink-100 text-pink-500' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {i <= 4 ? <Trophy className="w-4 h-4" /> : i}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setView('home');
              }}
              className="w-full max-w-xs py-5 rounded-[24px] bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-200"
            >
              回到首页
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Only on Home) */}
      {view === 'home' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartLearning}
            className="w-full max-w-md mx-auto py-5 rounded-[24px] bg-slate-800 text-white font-bold text-lg shadow-2xl shadow-slate-300 flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>开始今日学习</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
