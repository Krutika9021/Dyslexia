import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface WordRecognitionGameProps {
  user: any;
  onBack: () => void;
}

export const WordRecognitionGame = ({ user, onBack }: WordRecognitionGameProps) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameComplete, setGameComplete] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  const wordSets = {
    easy: ['cat', 'dog', 'sun', 'car', 'run', 'big', 'red', 'hat', 'cup', 'pen', 'bat', 'man', 'box', 'toy', 'bee', 'sky', 'eye', 'egg', 'fox', 'leg', 'sea', 'map', 'nut', 'owl', 'pie'],
    moderate: ['house', 'water', 'happy', 'green', 'table', 'phone', 'smile', 'paper', 'light', 'music', 'shirt', 'plant', 'chair', 'bread', 'clock', 'friend', 'beach', 'money', 'story', 'glass', 'peace', 'dream', 'party', 'movie', 'flower'],
    difficult: ['elephant', 'beautiful', 'computer', 'vacation', 'chemistry', 'telephone', 'paragraph', 'wonderful', 'dangerous', 'mountain', 'calendar', 'exercise', 'sandwich', 'dinosaur', 'umbrella', 'chocolate', 'interview', 'breakfast', 'hospital', 'adventure', 'butterfly', 'remember', 'celebrate', 'important', 'character']
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
      // If all words are used, reset the used words array
      setUsedWords([]);
    }
    
    const wordsToUse = availableWords.length > 0 ? availableWords : words;
    const correctWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
    
    // Get 3 different wrong words
    const wrongWords = words
      .filter(w => w !== correctWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5);
    
    setCurrentWord(correctWord);
    setOptions(allOptions);
    setUsedWords(prev => [...prev, correctWord]);
    setTimeLeft(10);
  };

  const handleAnswer = (selectedWord: string) => {
    if (selectedWord === currentWord) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was "${currentWord}"`,
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
      game: 'Word Recognition',
      score: score,
      difficulty: difficulty,
      hasDyslexia: score < 7,
      completedAt: new Date().toISOString()
    };
    
    const results = JSON.parse(localStorage.getItem('gameResults') || '[]');
    results.push(result);
    localStorage.setItem('gameResults', JSON.stringify(results));
    
    toast({
      title: "Game Complete!",
      description: `You scored ${score}/10`,
    });
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
              <CardTitle>Word Recognition Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">Select your difficulty level:</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => startGame('easy')} 
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Easy - Simple 3-letter words
                </Button>
                <Button 
                  onClick={() => startGame('moderate')} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Moderate - Common 5-letter words
                </Button>
                <Button 
                  onClick={() => startGame('difficult')} 
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Difficult - Complex longer words
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
            <h1 className="text-2xl font-bold">Word Recognition</h1>
            <div className="text-right">
              <p>Round {currentRound + 1}/10</p>
              <p>Score: {score}</p>
            </div>
          </div>
          <Progress value={(currentRound / 10) * 100} className="mb-2" />
          <p className="text-center text-sm text-gray-600">Time left: {timeLeft}s</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Which word matches the sound?</h2>
            <div className="text-4xl font-bold mb-8 text-blue-600">{currentWord}</div>
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="h-16 text-lg"
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
