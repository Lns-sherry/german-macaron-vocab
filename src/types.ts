export enum Level {
  A1_A2 = 'A1-A2',
  B1_B2 = 'B1-B2',
  C1_C2 = 'C1-C2'
}

export enum Sweetness {
  MICRO = 10,
  HALF = 20,
  FULL = 50,
  EXTRA = 100
}

export interface Word {
  id: string;
  german: string;
  gender: 'der' | 'die' | 'das';
  plural: string;
  chinese: string;
  example: string;
  exampleChinese: string;
  pronunciation: string;
  mouthfeel: string;
  visualDesc: string;
  preBiteFlavor: string;
  midBiteFilling: string;
  postBiteEncouragement: string;
  level: Level;
}

export interface UserProgress {
  learnedCount: number;
  dailyGoal: Sweetness;
  streak: number;
  medals: string[]; // dates of completion
  currentLevel: Level;
  learnedWords: string[]; // IDs of mastered words
}
