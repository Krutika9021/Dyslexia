import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface ReadingComprehensionGameProps {
  user: any;
  onBack: () => void;
}

export const ReadingComprehensionGame = ({ user, onBack }: ReadingComprehensionGameProps) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPassage, setCurrentPassage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const [usedPassages, setUsedPassages] = useState<number[]>([]);

  const passages = {
    easy: [
      {
        text: "The cat sat on the mat. It was a sunny day. The cat was happy.",
        question: "Where did the cat sit?",
        options: ["On the mat", "On the chair", "On the bed", "On the floor"],
        correct: "On the mat"
      },
      {
        text: "Tom has a red ball. He likes to play with it in the park.",
        question: "What color is Tom's ball?",
        options: ["Blue", "Red", "Green", "Yellow"],
        correct: "Red"
      },
      {
        text: "The dog ran fast. It was chasing a stick in the yard.",
        question: "What was the dog chasing?",
        options: ["A ball", "A stick", "A cat", "A bird"],
        correct: "A stick"
      },
      {
        text: "Mary loves ice cream. Her favorite flavor is chocolate.",
        question: "What is Mary's favorite ice cream flavor?",
        options: ["Vanilla", "Strawberry", "Chocolate", "Mint"],
        correct: "Chocolate"
      },
      {
        text: "The sun is bright today. Birds are singing in the trees.",
        question: "What are the birds doing?",
        options: ["Flying", "Sleeping", "Singing", "Eating"],
        correct: "Singing"
      }
    ],
    moderate: [
      {
        text: "Sarah loved reading books. Every evening, she would sit by the window with her favorite novel. The warm sunlight made her feel cozy as she turned each page carefully.",
        question: "When did Sarah usually read?",
        options: ["In the morning", "In the evening", "At noon", "At night"],
        correct: "In the evening"
      },
      {
        text: "The old lighthouse stood tall on the rocky cliff. For many years, it had guided ships safely to shore during stormy nights. The lighthouse keeper took great pride in maintaining the bright beacon.",
        question: "What was the lighthouse keeper's main responsibility?",
        options: ["Cleaning the rocks", "Maintaining the beacon", "Watching ships", "Cooking meals"],
        correct: "Maintaining the beacon"
      },
      {
        text: "Emma decided to plant a garden in her backyard. She carefully chose seeds for tomatoes, carrots, and lettuce. Every morning, she watered the plants and watched them grow.",
        question: "What did Emma do every morning?",
        options: ["Picked vegetables", "Watered the plants", "Bought seeds", "Ate breakfast"],
        correct: "Watered the plants"
      },
      {
        text: "The school orchestra was preparing for their annual concert. The students practiced their instruments for hours each day. The conductor was pleased with their dedication and progress.",
        question: "How often did the students practice?",
        options: ["Once a week", "Every other day", "Hours each day", "Only on weekends"],
        correct: "Hours each day"
      },
      {
        text: "During the camping trip, the children learned to identify different types of birds. They used a field guide and binoculars to observe the wildlife around their campsite.",
        question: "What tools did the children use to observe birds?",
        options: ["Camera and notebook", "Field guide and binoculars", "Map and compass", "Telescope and timer"],
        correct: "Field guide and binoculars"
      }
    ],
    difficult: [
      {
        text: "The phenomenon of bioluminescence occurs when living organisms produce light through chemical reactions. This remarkable process is found in various species including fireflies, deep-sea fish, and certain bacteria. The light production serves multiple purposes such as communication, predator deterrence, and prey attraction.",
        question: "What is the primary cause of bioluminescence?",
        options: ["Electrical reactions", "Chemical reactions", "Heat reactions", "Nuclear reactions"],
        correct: "Chemical reactions"
      },
      {
        text: "Quantum mechanics revolutionized our understanding of atomic and subatomic particles. Unlike classical physics, which deals with predictable outcomes, quantum mechanics introduces probability and uncertainty. Scientists like Heisenberg and Schrödinger contributed significantly to this field.",
        question: "How does quantum mechanics differ from classical physics?",
        options: ["It's more complex", "It introduces probability and uncertainty", "It's easier to understand", "It only applies to large objects"],
        correct: "It introduces probability and uncertainty"
      },
      {
        text: "Photosynthesis is the process by which plants convert carbon dioxide and water into glucose using sunlight energy. This biochemical reaction is crucial for life on Earth as it produces oxygen as a byproduct and forms the base of most food chains.",
        question: "What is produced as a byproduct of photosynthesis?",
        options: ["Carbon dioxide", "Water", "Oxygen", "Nitrogen"],
        correct: "Oxygen"
      },
      {
        text: "Archaeological evidence suggests that the ancient civilization of Mesopotamia developed the first known writing system around 3200 BCE. This cuneiform script was initially used for record-keeping and trade transactions before evolving into a tool for literature and law.",
        question: "What was cuneiform script initially used for?",
        options: ["Religious ceremonies", "Record-keeping and trade", "Military communications", "Artistic expression"],
        correct: "Record-keeping and trade"
      },
      {
        text: "Climate change affects global weather patterns through complex interactions between the atmosphere, oceans, and land surfaces. Rising temperatures cause shifts in precipitation patterns, sea level changes, and ecosystem disruptions worldwide.",
        question: "What causes shifts in precipitation patterns according to the passage?",
        options: ["Ocean currents", "Rising temperatures", "Land development", "Atmospheric pressure"],
        correct: "Rising temperatures"
      }
    ]
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
    setUsedPassages([]);
    generateQuestion(selectedDifficulty);
  };

  const generateQuestion = (diff: string) => {
    const passageSet = passages[diff as keyof typeof passages];
    const availableIndices = passageSet
      .map((_, index) => index)
      .filter(index => !usedPassages.includes(index));
    
    if (availableIndices.length === 0) {
      // Reset if all passages are used
      setUsedPassages([]);
    }
    
    const indicesToUse = availableIndices.length > 0 ? availableIndices : passageSet.map((_, index) => index);
    const selectedIndex = indicesToUse[Math.floor(Math.random() * indicesToUse.length)];
    const passage = passageSet[selectedIndex];
    
    setCurrentPassage(passage.text);
    setCurrentQuestion(passage.question);
    setOptions(passage.options.sort(() => Math.random() - 0.5));
    setCorrectAnswer(passage.correct);
    setUsedPassages(prev => [...prev, selectedIndex]);
    setTimeLeft(30);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was "${correctAnswer}"`,
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
      game: 'Reading Comprehension',
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
              <CardTitle>Reading Comprehension Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">Read passages and answer questions. Select your difficulty:</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => startGame('easy')} 
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Easy - Simple sentences
                </Button>
                <Button 
                  onClick={() => startGame('moderate')} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Moderate - Short paragraphs
                </Button>
                <Button 
                  onClick={() => startGame('difficult')} 
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Difficult - Complex passages
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Reading Comprehension</h1>
            <div className="text-right">
              <p>Round {currentRound + 1}/10</p>
              <p>Score: {score}</p>
            </div>
          </div>
          <Progress value={(currentRound / 10) * 100} className="mb-2" />
          <p className="text-center text-sm text-gray-600">Time left: {timeLeft}s</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Read the passage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{currentPassage}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="h-16 text-left justify-start"
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
    </div>
  );
};
