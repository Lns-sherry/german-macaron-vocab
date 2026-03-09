import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, Level } from '../types';
import { Macaron } from './Macaron';
import { ChevronRight, ChevronLeft, Volume2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { generateExampleSentence } from '../services/geminiService';

interface LearningSessionProps {
  words: Word[];
  level: Level;
  onComplete: (learnedIds: string[]) => void;
  onExit: () => void;
}

export const LearningSession: React.FC<LearningSessionProps> = ({ 
  words, 
  level, 
  onComplete, 
  onExit 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [showPuff, setShowPuff] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dynamicExample, setDynamicExample] = useState<{ example: string; translation: string } | null>(null);
  const biteAudioRef = useRef<HTMLAudioElement>(new Audio('/sounds/bite.mp3'));

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleRefreshExample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    const result = await generateExampleSentence(currentWord.german, level);
    if (result) {
      setDynamicExample(result);
      speak(result.example, 0.8);
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    setDynamicExample(null);
  }, [currentIndex]);

  const speak = (text: string, rate = 0.7) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    
    // Voice selection logic: Prefer Natural/Google female voices
    const voices = window.speechSynthesis.getVoices();
    const deVoices = voices.filter(v => v.lang.startsWith('de'));
    
    const preferredVoice = deVoices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google')) && 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
    ) || deVoices.find(v => v.name.includes('Natural') || v.name.includes('Google')) 
      || deVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = rate;
    utterance.pitch = 1.2; // Young, clear voice
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis failed:", err);
    }
  };

  useEffect(() => {
    // Ensure voices are loaded
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    if (isFlipped) {
      speak(currentWord.german, 0.7);
    }
  }, [isFlipped, currentIndex]);

  const handleNext = (isKnown: boolean) => {
    const newLearnedIds = isKnown ? [...learnedIds, currentWord.id] : learnedIds;
    if (currentIndex < words.length - 1) {
      if (isKnown) setLearnedIds(prev => [...prev, currentWord.id]);
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete(newLearnedIds);
    }
  };

  const playCrunch = () => {
    if (biteAudioRef.current) {
      biteAudioRef.current.currentTime = 0;
      biteAudioRef.current.volume = 0.4;
      biteAudioRef.current.play().catch(() => {});
    }
  };

  const handleKnown = () => {
    // 1. Force audio trigger on user click for immediate activation
    // This is the "Chomp!" sound
    playCrunch();

    // 2. Ensure card flips to show the bite mark on the back
    if (!isFlipped) {
      setIsFlipped(true);
    }

    setShowPuff(true);
    const isLastWord = currentIndex === words.length - 1;

    if (isLastWord) {
      // 3. Handle last word transition with success sound
      setTimeout(() => {
        const success = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
        success.volume = 0.5;
        success.play().catch(() => {});
        
        setTimeout(() => {
          setShowPuff(false);
          const newLearnedIds = [...learnedIds, currentWord.id];
          onComplete(newLearnedIds);
        }, 800);
      }, 500);
    } else {
      // 4. Normal next word
      setTimeout(() => {
        setShowPuff(false);
        handleNext(true);
      }, 800); // Slightly longer delay to appreciate the bite
    }
  };

  const handleUnknown = () => {
    if (currentIndex > 0) {
      // Go back to previous word
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    } else {
      // If at first word, just move to next
      handleNext(false);
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case Level.A1_A2: return '#BAE6FD'; // Vanilla
      case Level.B1_B2: return '#BBF7D0'; // Mint
      case Level.C1_C2: return '#E9D5FF'; // Lavender
      default: return '#FCE4EC';
    }
  };

  const getShellColor = () => {
    switch (currentWord.gender) {
      case 'der': return '#FFFDE7'; // Vanilla Yellow
      case 'die': return '#E9D5FF'; // Lavender Purple
      case 'das': return '#BBF7D0'; // Mint Green
      default: return getLevelColor();
    }
  };

  const getDarkerShellColor = () => {
    switch (currentWord.gender) {
      case 'der': return '#7DD3FC'; // Sky Blue
      case 'die': return '#F9A8D4'; // Rose Pink
      case 'das': return '#FFF3B0'; // Yellow/Lemon
      default: return getLevelColor();
    }
  };

  const getGenderColor = () => {
    switch (currentWord.gender) {
      case 'der': return '#60A5FA'; // Blue/Vanilla
      case 'die': return '#F47286'; // Pink/Raspberry
      case 'das': return '#D495E0'; // Dark Perpul
      default: return '#1E293B';
    }
  };

  const getFrontFillingColor = () => {
    switch (currentWord.gender) {
      case 'der': return '#60A5FA'; // Blue/Vanilla
      case 'die': return '#F47286'; // Pink/Raspberry
      case 'das': return '#D495E0'; // Dark Perpul
      default: return '#FFFFFF';
    }
  };

  const getBackFillingColor = () => {
    switch (currentWord.gender) {
      case 'der': return '#60A5FA'; // Blue/Vanilla
      case 'die': return '#F47286'; // Pink/Raspberry
      case 'das': return '#D495E0'; // Dark Perpul
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FCE4EC] z-50 flex flex-col p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-6">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full"
              style={{ backgroundColor: getLevelColor() }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {level} FLAVOR
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {currentIndex + 1} / {words.length}
            </span>
          </div>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0, rotate: 5 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full max-w-sm aspect-[3/4] perspective-1000"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 20 }}
              className="w-full h-full relative preserve-3d cursor-pointer"
              onClick={() => {
                if (!isFlipped) playCrunch();
                setIsFlipped(!isFlipped);
              }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-2xl border-8 border-white flex flex-col items-center p-8 text-center macaron-shadow">
                {/* Top: Macaron */}
                <div className="mt-4">
                  <Macaron 
                    color={getShellColor()} 
                    fillingColor={getFrontFillingColor()} 
                    size="lg" 
                    animate 
                  />
                </div>
                
                {/* Middle: Word */}
                <div className="mt-8">
                  <h2 
                    className="text-4xl font-serif font-bold tracking-tight flex items-center justify-center gap-2"
                    style={{ color: getGenderColor() }}
                  >
                    <span className="uppercase text-sm font-sans font-black opacity-60">
                      {currentWord.gender.toUpperCase()}
                    </span>
                    {currentWord.german}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentWord.german, 0.8);
                      }}
                      className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                      <Volume2 className="w-5 h-5 opacity-40" />
                    </button>
                  </h2>
                  <p className="text-slate-600 text-xs mt-1 font-medium">
                    pl. {currentWord.plural}
                  </p>
                </div>
                
                {/* Below word: IPA + Mouthfeel */}
                <div className="mt-4 flex flex-col items-center gap-1">
                  <p className="text-slate-700 font-mono text-sm tracking-widest">
                    {currentWord.pronunciation}
                  </p>
                </div>

                {/* Bottom Bar: Speaker + TAP TO FLIP */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-2 bg-white/50 rounded-full text-slate-500">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">TAP TO FLIP</span>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-2xl border-8 border-white flex flex-col items-center p-8 text-center rotate-y-180 macaron-shadow overflow-hidden"
              >
                {/* Top: Bitten Macaron */}
                <div className="mt-2">
                  <Macaron 
                    color={getShellColor()} 
                    fillingColor={getFrontFillingColor()}
                    size="lg" 
                    animate 
                    bitten={true} 
                  />
                </div>

                {/* Word + Speaker 1 at the top */}
                <div className="mt-4">
                  <h3 
                    className="text-2xl font-serif font-bold flex items-center justify-center gap-2"
                    style={{ color: getGenderColor() }}
                  >
                    {currentWord.german}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentWord.german, 0.8);
                      }}
                      className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                      <Volume2 className="w-4 h-4 opacity-40" />
                    </button>
                  </h3>
                </div>

                {/* Phonetics in the middle */}
                <div className="mt-2">
                  <p className="text-slate-600 font-mono text-sm tracking-widest">
                    {currentWord.pronunciation}
                  </p>
                </div>

                {/* Chinese Translation below phonetics */}
                <div className="mt-6">
                  <h3 className="text-3xl font-bold text-slate-800 tracking-wide">
                    {currentWord.chinese}
                  </h3>
                </div>

                {/* German Example + Speaker 2 at the bottom */}
                <div className="mt-auto mb-8 space-y-3 w-full px-4 flex flex-col items-center">
                  <div className="flex items-start justify-center gap-2 group relative">
                    <p className={`text-slate-800 font-serif italic text-lg leading-snug max-w-[85%] transition-opacity ${isGenerating ? 'opacity-30' : 'opacity-100'}`}>
                      "{dynamicExample?.example || currentWord.example}"
                    </p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(dynamicExample?.example || currentWord.example, 0.8);
                        }}
                        className="p-1.5 bg-white/40 hover:bg-white/60 rounded-full transition-all shadow-sm"
                      >
                        <Volume2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={handleRefreshExample}
                        disabled={isGenerating}
                        className={`p-1.5 bg-white/40 hover:bg-white/60 rounded-full transition-all shadow-sm ${isGenerating ? 'animate-spin' : ''}`}
                        title="AI 重新生成例句"
                      >
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'text-pink-400' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm text-slate-500 font-medium transition-opacity ${isGenerating ? 'opacity-30' : 'opacity-100'}`}>
                    ({dynamicExample?.translation || currentWord.exampleChinese})
                  </p>
                </div>

                {/* Minimalist Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="flex items-center gap-2 text-slate-400/50">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">TAP TO FLIP BACK</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Puff Animation Overlay */}
        <AnimatePresence>
          {showPuff && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute pointer-events-none z-50 flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-slate-800 font-display">
                {currentWord.postBiteEncouragement}
              </div>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: -50, x: (i - 2) * 30, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: i === 2 ? getBackFillingColor() : getDarkerShellColor() }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto mb-4 flex gap-4 max-w-sm mx-auto w-full">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUnknown}
          className="flex-1 py-5 rounded-[32px] bg-white text-slate-400 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-slate-100 macaron-shadow"
        >
          <XCircle className="w-5 h-5" />
          <span>再看看</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleKnown}
          className="flex-1 py-5 rounded-[32px] text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl transition-all active:shadow-inner"
          style={{ backgroundColor: getBackFillingColor() }}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>吃掉了</span>
        </motion.button>
      </div>
    </div>
  );
};
