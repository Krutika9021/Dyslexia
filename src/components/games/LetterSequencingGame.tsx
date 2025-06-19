import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface LetterSequencingGameProps {
  user: any;
  onBack: () => void;
}

export const LetterSequencingGame = ({ user, onBack }: LetterSequencingGameProps) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targetWord, setTargetWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameComplete, setGameComplete] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  const wordSets = {
    easy: ['cat', 'dog', 'sun', 'run', 'big', 'hat', 'cup', 'pen', 'bat', 'man', 'box', 'toy', 'bee', 'sky', 'eye', 'egg', 'fox', 'leg', 'sea', 'map', 'nut', 'owl', 'pie', 'web', 'net'],
    moderate: ['house', 'water', 'green', 'table', 'phone', 'plant', 'chair', 'bread', 'clock', 'shirt', 'peace', 'dream', 'party', 'movie', 'beach', 'glass', 'paper', 'light', 'music', 'smile', 'world', 'heart', 'power', 'fresh', 'dance'],
    difficult: ['computer', 'elephant', 'beautiful', 'vacation', 'telephone', 'mountain', 'calendar', 'exercise', 'sandwich', 'dinosaur', 'umbrella', 'chocolate', 'interview', 'breakfast', 'hospital', 'adventure', 'butterfly', 'remember', 'celebrate', 'important', 'character', 'wonderful', 'dangerous', 'paragraph', 'chemistry']
  };

  useEffect(() => {
    if (gameStarted && currentRound < 10 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextRound();
    }
  }, [timeLeft, gameStarted, currentRound]);

  const startGame = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setUsedWords([]);
    generateQuestion(selectedDifficulty);
  };

  const generateQuestion = (diff: string) => {
    const words = wordSets[diff as keyof typeof wordSets];
    const availableWords = words.filter(word => !usedWords.includes(word));
    
    if (availableWords.length === 0) {
      // Reset if all words are used
      setUsedWords([]);
    }
    
    const wordsToUse = availableWords.length > 0 ? availableWords : words;
    const word = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
    const letters = word.split('').sort(() => Math.random() - 0.5);
    
    setTargetWord(word);
    setScrambledLetters(letters);
    setSelectedLetters([]);
    setUsedWords(prev => [...prev, word]);
    setTimeLeft(15);
  };

  const handleLetterClick = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter]);
    setScrambledLetters(scrambledLetters.filter((_, i) => i !== index));
  };

  const handleSelectedLetterClick = (index: number) => {
    const letter = selectedLetters[index];
    setScrambledLetters([...scrambledLetters, letter]);
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const formed = selectedLetters.join('');
    if (formed === targetWord) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct word was "${targetWord}"`,
        variant: "destructive"
      });
    }
    handleNextRound();
  };

  const handleNextRound = () => {
    if (currentRound + 1 >= 10) {
      completeGame();
    } else {
      setCurrentRound(currentRound + 1);
      generateQuestion(difficulty!);
    }
  };

  const completeGame = () => {
    setGameComplete(true);
    const result = {
      username: user.username,
      game: 'Letter Sequencing',
      score: score,
      difficulty: difficulty,
      hasDyslexia: score < 7,
      completedAt: new Date().toISOString()
    };
    
    const results = JSON.parse(localStorage.getItem('gameResults') || '[]');
    results.push(result);
    localStorage.setItem('gameResults', JSON.stringify(results));
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            ← Back to Games
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Letter Sequencing Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">Arrange scrambled letters to form words. Select your difficulty:</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => startGame('easy')} 
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Easy - 3-letter words
                </Button>
                <Button 
                  onClick={() => startGame('moderate')} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Moderate - 5-letter words
                </Button>
                <Button 
                  onClick={() => startGame('difficult')} 
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Difficult - Longer words
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Final Score: {score}/10</h2>
                <p className="text-gray-600">
                  {score >= 7 ? 'Great job! No signs of dyslexia detected.' : 'You might benefit from further assessment.'}
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Letter Sequencing</h1>
            <div className="text-right">
              <p>Round {currentRound + 1}/10</p>
              <p>Score: {score}</p>
            </div>
          </div>
          <Progress value={(currentRound / 10) * 100} className="mb-2" />
          <p className="text-center text-sm text-gray-600">Time left: {timeLeft}s</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Arrange the letters to form a word</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Your word:</h3>
              <div className="flex gap-2 min-h-[60px] border-2 border-dashed border-gray-300 rounded p-4">
                {selectedLetters.map((letter, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSelectedLetterClick(index)}
                    className="w-12 h-12 text-lg"
                    variant="default"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Available letters:</h3>
              <div className="flex gap-2 flex-wrap">
                {scrambledLetters.map((letter, index) => (
                  <Button
                    key={index}
                    onClick={() => handleLetterClick(letter, index)}
                    className="w-12 h-12 text-lg"
                    variant="outline"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={checkAnswer}
                disabled={selectedLetters.length === 0}
                className="px-8"
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
