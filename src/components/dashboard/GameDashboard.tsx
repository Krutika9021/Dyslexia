import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordRecognitionGame } from '../games/WordRecognitionGame';
import { LetterSequencingGame } from '../games/LetterSequencingGame';
import { ReadingComprehensionGame } from '../games/ReadingComprehensionGame';
import { Gamepad2, BookOpen, Shuffle, Brain, Star, Trophy, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const GameDashboard = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const games = [
    {
      id: 'word-recognition',
      title: 'Word Recognition',
      description: 'Identify and match words quickly to test reading speed and accuracy',
      icon: BookOpen,
      gradient: 'from-violet-500 via-purple-500 to-indigo-600',
      bgGradient: 'from-violet-50 via-purple-50 to-indigo-50',
      shadowColor: 'shadow-violet-200',
      component: WordRecognitionGame
    },
    {
      id: 'letter-sequencing',
      title: 'Letter Sequencing',
      description: 'Arrange letters in the correct order to form words',
      icon: Shuffle,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
      shadowColor: 'shadow-emerald-200',
      component: LetterSequencingGame
    },
    {
      id: 'reading-comprehension',
      title: 'Reading Comprehension',
      description: 'Read passages and answer questions to test understanding',
      icon: Brain,
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
      bgGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
      shadowColor: 'shadow-rose-200',
      component: ReadingComprehensionGame
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-rose-50 via-amber-50 to-emerald-100 relative overflow-hidden p-6">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => setSelectedGame(null)}
              variant="outline"
              className="mb-6 border-2 border-violet-300 hover:border-violet-500 hover:text-violet-700 transition-all duration-300 rounded-xl"
            >
              ← Back to Dashboard
            </Button>
            <GameComponent 
              difficulty="easy"
              onGameComplete={(score: number) => {
                console.log('Game completed with score:', score);
                setSelectedGame(null);
              }}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-rose-50 via-amber-50 to-emerald-100 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-violet-gradient rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-gradient rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-amber-gradient rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-emerald-gradient rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-teal-gradient rounded-full opacity-30 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold rainbow-text mb-2">
                Welcome, {user?.email}! 🎮
              </h1>
              <p className="text-gray-700 text-lg font-medium">Choose a game to start your assessment journey</p>
            </div>
            <Button 
              onClick={signOut} 
              variant="outline"
              className="border-2 border-violet-300 hover:border-violet-500 hover:text-violet-700 transition-all duration-300 rounded-xl"
            >
              Logout
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {games.map((game, index) => {
              const IconComponent = game.icon;
              return (
                <Card 
                  key={game.id} 
                  className={`group hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 animate-fade-in bg-gradient-to-br ${game.bgGradient} border-0 overflow-hidden relative ${game.shadowColor} hover:shadow-xl`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${game.gradient} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-800 group-hover:text-gray-900 transition-colors font-bold">
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 mb-6 leading-relaxed">{game.description}</p>
                    <Button className={`w-full bg-gradient-to-r ${game.gradient} hover:shadow-lg transform transition-all duration-300 group-hover:scale-105 text-white border-0 rounded-xl font-semibold`}>
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Start Game
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced how it works section */}
          <Card className="max-w-4xl mx-auto animate-fade-in bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl" style={{ animationDelay: '0.8s' }}>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 rainbow-text">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Choose Difficulty</h3>
                  <p className="text-gray-600">Select from Easy, Moderate, or Difficult levels</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Complete 10 Rounds</h3>
                  <p className="text-gray-600">Play through 10 engaging rounds of the game</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Get Results</h3>
                  <p className="text-gray-600">Receive detailed analysis and recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
