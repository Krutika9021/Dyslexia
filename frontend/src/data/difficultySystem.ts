export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface GameContentItem {
  word: string
  image: string
}

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, {
  rounds: number
  time: number
  hintsEnabled: boolean
  scoreMultiplier: number
}> = {
  easy:   { rounds: 4, time: 18, hintsEnabled: true,  scoreMultiplier: 1   },
  medium: { rounds: 6, time: 12, hintsEnabled: true,  scoreMultiplier: 1.2 },
  hard:   { rounds: 9, time: 8,  hintsEnabled: false, scoreMultiplier: 1.5 },
}

/* ── Word pools ─────────────────────────────────────────────── */

const WORD_DATA: Record<GameDifficulty, Array<{ word: string; image: string }>> = {
  easy: [
    { word: 'cat',  image: '🐱' }, { word: 'dog',  image: '🐶' },
    { word: 'sun',  image: '☀️' }, { word: 'tree', image: '🌳' },
    { word: 'fish', image: '🐟' }, { word: 'book', image: '📘' },
    { word: 'ball', image: '⚽' }, { word: 'car',  image: '🚗' },
    { word: 'star', image: '⭐' }, { word: 'bird', image: '🐦' },
    { word: 'hat',  image: '🎩' }, { word: 'cup',  image: '☕' },
    { word: 'bed',  image: '🛏️' }, { word: 'box',  image: '📦' },
    { word: 'map',  image: '🗺️' }, { word: 'ant',  image: '🐜' },
    { word: 'bus',  image: '🚌' }, { word: 'hen',  image: '🐔' },
    { word: 'log',  image: '🪵' }, { word: 'pan',  image: '🍳' },
  ],
  medium: [
    { word: 'apple',  image: '🍎' }, { word: 'tiger',  image: '🐯' },
    { word: 'river',  image: '🌊' }, { word: 'chair',  image: '🪑' },
    { word: 'garden', image: '🌿' }, { word: 'rocket',  image: '🚀' },
    { word: 'planet', image: '🪐' }, { word: 'bridge',  image: '🌉' },
    { word: 'forest', image: '🌲' }, { word: 'cloud',   image: '☁️' },
    { word: 'stone',  image: '🪨' }, { word: 'flame',   image: '🔥' },
    { word: 'snake',  image: '🐍' }, { word: 'bread',   image: '🍞' },
    { word: 'grape',  image: '🍇' }, { word: 'knife',   image: '🔪' },
    { word: 'crane',  image: '🏗️' }, { word: 'brush',   image: '🖌️' },
    { word: 'shelf',  image: '🗄️' }, { word: 'globe',   image: '🌍' },
  ],
  hard: [
    { word: 'astronaut',  image: '👨‍🚀' }, { word: 'galaxy',     image: '🌌' },
    { word: 'elephant',   image: '🐘' }, { word: 'dinosaur',   image: '🦖' },
    { word: 'volcano',    image: '🌋' }, { word: 'microscope', image: '🔬' },
    { word: 'laboratory', image: '🧪' }, { word: 'satellite',  image: '🛰️' },
    { word: 'universe',   image: '✨' }, { word: 'algorithm',  image: '💻' },
    { word: 'parliament', image: '🏛️' }, { word: 'gymnasium',  image: '🏋️' },
    { word: 'architect',  image: '📐' }, { word: 'geography',  image: '🗺️' },
    { word: 'paragraph',  image: '📄' }, { word: 'chemistry',  image: '⚗️' },
    { word: 'telescope',  image: '🔭' }, { word: 'symphony',   image: '🎼' },
    { word: 'cathedral',  image: '⛪' }, { word: 'hypothesis', image: '🔍' },
  ],
}

/* ── Reading passages per difficulty ────────────────────────── */

export interface ReadingPassage {
  text: string
  questions: { question: string; options: string[]; correct: number }[]
  difficulty: GameDifficulty
}

export const READING_PASSAGES: ReadingPassage[] = [
  // ── EASY ──
  {
    difficulty: 'easy',
    text: 'The cat sat on the mat. It was a big, fluffy cat. The cat liked to sleep in the sun.',
    questions: [
      { question: 'Where did the cat sit?',      options: ['on the chair', 'on the mat', 'on the bed'],             correct: 1 },
      { question: 'What did the cat like to do?', options: ['play',        'eat',        'sleep in the sun'],       correct: 2 },
    ],
  },
  {
    difficulty: 'easy',
    text: 'Tim has a red ball. He plays with it in the park. The ball rolls fast on the grass.',
    questions: [
      { question: 'What colour is the ball?', options: ['blue', 'red', 'green'],            correct: 1 },
      { question: 'Where does Tim play?',     options: ['at home', 'in the park', 'school'], correct: 1 },
    ],
  },
  {
    difficulty: 'easy',
    text: 'A dog named Max loves to run. He chases birds in the garden every morning.',
    questions: [
      { question: "What is the dog's name?",   options: ['Rex', 'Max', 'Bob'],           correct: 1 },
      { question: 'What does Max like to do?', options: ['sleep', 'swim', 'run'],         correct: 2 },
    ],
  },

  // ── MEDIUM ──
  {
    difficulty: 'medium',
    text: 'Sarah went to the park with her dog Max. They played fetch with a red ball. Max ran very fast to catch the ball. Sarah was happy to see Max having fun.',
    questions: [
      { question: 'Who went to the park?',      options: ['Sarah and Max', 'Just Sarah', 'Just Max'],      correct: 0 },
      { question: 'What colour was the ball?',  options: ['blue',          'green',      'red'],           correct: 2 },
      { question: 'How did Max run?',           options: ['slowly',        'very fast',  'carefully'],     correct: 1 },
    ],
  },
  {
    difficulty: 'medium',
    text: 'The library was quiet and peaceful. Emma loved reading books about adventures. She found a book about pirates. The story made her want to explore new places.',
    questions: [
      { question: 'What was the library like?',        options: ['noisy',           'quiet and peaceful', 'crowded'],        correct: 1 },
      { question: 'What kind of books did Emma love?', options: ['adventure books', 'cooking books',      'science books'],  correct: 0 },
      { question: 'What did the story make Emma want?', options: ['sleep',           'explore new places', 'cook food'],     correct: 1 },
    ],
  },
  {
    difficulty: 'medium',
    text: 'The weather was warm and sunny. Jake decided to ride his bicycle to the market. He bought fruit, bread, and juice. On his way home he saw a rainbow in the sky.',
    questions: [
      { question: 'How did Jake travel to the market?', options: ['by bus', 'on his bicycle', 'on foot'],         correct: 1 },
      { question: 'What did Jake buy?',                 options: ['toys',   'fruit, bread and juice', 'clothes'], correct: 1 },
      { question: 'What did Jake see on the way home?', options: ['a cloud', 'a rainbow', 'a bird'],              correct: 1 },
    ],
  },

  // ── HARD ──
  {
    difficulty: 'hard',
    text: 'The Industrial Revolution fundamentally transformed human society between 1760 and 1840. Machines replaced manual labour in factories, and steam power enabled unprecedented production. Urban populations surged as workers migrated from rural areas. While living standards gradually improved, early conditions were often harsh and dangerous.',
    questions: [
      { question: 'When did the Industrial Revolution occur?',       options: ['1600–1700', '1760–1840', '1900–1950'],                    correct: 1 },
      { question: 'What enabled unprecedented production?',          options: ['wind power', 'steam power', 'water wheels'],             correct: 1 },
      { question: 'Why did urban populations grow?',                 options: ['higher birth rates', 'workers migrating from rural areas', 'immigration'], correct: 1 },
      { question: 'What were early factory conditions described as?', options: ['comfortable', 'harsh and dangerous', 'well-regulated'],  correct: 1 },
    ],
  },
  {
    difficulty: 'hard',
    text: 'Photosynthesis is the process by which plants convert light energy into chemical energy stored as glucose. Chlorophyll in the chloroplasts absorbs sunlight. Carbon dioxide from the air and water from the soil are combined to produce glucose and oxygen. This process is essential for all life on Earth.',
    questions: [
      { question: 'What do plants convert during photosynthesis?', options: ['water into oxygen', 'light energy into glucose', 'carbon dioxide into water'], correct: 1 },
      { question: 'Which molecule absorbs sunlight?',              options: ['glucose', 'chlorophyll', 'oxygen'],                                          correct: 1 },
      { question: 'What are the inputs to photosynthesis?',        options: ['glucose and light', 'CO₂ and water', 'oxygen and sunlight'],                correct: 1 },
      { question: 'Why is photosynthesis important?',              options: ['It produces rain', 'It is essential for all life', 'It creates soil'],      correct: 1 },
    ],
  },
]

/* ── Confusing words for hard mode ─────────────────────────── */

export const HARD_CONFUSING_WORDS = [
  ['form',   'from'  ],
  ['angel',  'angle' ],
  ['there',  'three' ],
  ['quiet',  'quite' ],
  ['trial',  'trail' ],
  ['planet', 'platen'],
  ['sacred', 'scared'],
  ['united', 'untied'],
  ['bored',  'robed' ],
  ['night',  'thing' ],
] as const

/* ── Helpers ────────────────────────────────────────────────── */

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const getGameContent = (difficulty: GameDifficulty, count?: number): GameContentItem[] => {
  const shuffled = shuffle(WORD_DATA[difficulty])
  return typeof count === 'number' ? shuffled.slice(0, Math.max(1, count)) : shuffled
}

export const getWordsForDifficulty = (difficulty: GameDifficulty): string[] =>
  WORD_DATA[difficulty].map(d => d.word)

export const getPassagesForDifficulty = (difficulty: GameDifficulty): ReadingPassage[] =>
  shuffle(READING_PASSAGES.filter(p => p.difficulty === difficulty))

export const pickConfusingWord = (baseWord: string): string | null => {
  const match = HARD_CONFUSING_WORDS.find(([a]) => a === baseWord.toLowerCase())
  return match?.[1] ?? null
}

// Legacy export kept for compatibility
export const WORD_POOLS = {
  easy:   WORD_DATA.easy.map(d => d.word).slice(0, 4) as readonly string[],
  medium: WORD_DATA.medium.map(d => d.word).slice(0, 3) as readonly string[],
  hard:   WORD_DATA.hard.map(d => d.word).slice(0, 3) as readonly string[],
} as const
