
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { User, Lock, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userData: any) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);
      
      if (user || (username === 'admin' && password === 'admin123')) {
        const userData = user || { username: 'admin', password: 'admin123' };
        onLogin(userData);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full animate-fade-in backdrop-blur-sm bg-white/95 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg animate-glow">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <p className="text-gray-600">Sign in to continue your journey</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-12 h-12 border-2 border-violet-200 focus:border-violet-500 transition-colors rounded-xl"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500 w-5 h-5" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-12 h-12 border-2 border-violet-200 focus:border-violet-500 transition-colors rounded-xl"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
          <div className="text-center">
            <Button 
              type="button" 
              variant="link"
              onClick={onSwitchToRegister}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Don't have an account? Create one here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
