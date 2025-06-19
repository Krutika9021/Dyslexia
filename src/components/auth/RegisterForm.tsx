import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { User, Lock, UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.username === username);
      
      if (existingUser) {
        toast({
          title: "Registration Failed",
          description: "Username already exists",
          variant: "destructive"
        });
      } else {
        const newUser = { username, password, registeredAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        onRegister(newUser);
        toast({
          title: "Registration Successful",
          description: `Welcome, ${username}!`
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full animate-fade-in backdrop-blur-sm bg-white/95 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg animate-glow">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Join Us Today
        </CardTitle>
        <p className="text-gray-600">Create your account to get started</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-12 h-12 border-2 border-emerald-200 focus:border-emerald-500 transition-colors rounded-xl"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-12 h-12 border-2 border-emerald-200 focus:border-emerald-500 transition-colors rounded-xl"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-12 h-12 border-2 border-emerald-200 focus:border-emerald-500 transition-colors rounded-xl"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
          <div className="text-center">
            <Button 
              type="button" 
              variant="link"
              onClick={onSwitchToLogin}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Already have an account? Sign in here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
