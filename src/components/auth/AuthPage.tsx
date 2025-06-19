import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, UserPlus, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (!email.trim()) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive"
        });
        return;
      }
      await handleForgotPassword();
      return;
    }
    
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!email.trim() || !username.trim() || !password.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting to sign in with email:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Email login error:', error);
          toast({
            title: "Login Failed",
            description: "Invalid email or password",
            variant: "destructive"
          });
        }
      } else {
        // Sign up
        const { error } = await signUp(email, password, username);
        if (error) {
          console.log('Sign up error:', error);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isLogin ? "Login Failed" : "Sign Up Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setIsForgotPassword(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-rose-50 via-amber-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-gradient rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/4 -right-16 w-36 h-36 bg-rose-gradient rounded-full opacity-25 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-amber-gradient rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 bg-emerald-gradient rounded-full opacity-25 animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full mb-4 shadow-xl animate-glow">
              <span className="text-3xl animate-rainbow">🧠</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold rainbow-text mb-3">
            DyslexiaDetect
          </h1>
          <p className="text-gray-700 text-lg font-medium">Early detection through interactive games</p>
        </div>
        
        <Card className="w-full animate-fade-in backdrop-blur-sm bg-white/95 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-8">
            <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${
              isForgotPassword
                ? 'from-orange-500 via-red-500 to-pink-500'
                : isLogin 
                ? 'from-violet-500 via-purple-500 to-indigo-500' 
                : 'from-emerald-500 via-teal-500 to-cyan-500'
            } rounded-full flex items-center justify-center mb-4 shadow-lg animate-glow`}>
              {isForgotPassword ? <Mail className="w-8 h-8 text-white" /> : isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className={`text-3xl bg-gradient-to-r ${
              isForgotPassword
                ? 'from-orange-600 via-red-600 to-pink-600'
                : isLogin 
                ? 'from-violet-600 via-purple-600 to-indigo-600' 
                : 'from-emerald-600 via-teal-600 to-cyan-600'
            } bg-clip-text text-transparent`}>
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join Us Today'}
            </CardTitle>
            <p className="text-gray-600">
              {isForgotPassword ? 'Enter your email to reset password' : isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isForgotPassword ? 'text-orange-500' : isLogin ? 'text-violet-500' : 'text-emerald-500'
                } w-5 h-5`} />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`pl-12 h-12 border-2 ${
                    isForgotPassword 
                      ? 'border-orange-200 focus:border-orange-500' 
                      : isLogin 
                      ? 'border-violet-200 focus:border-violet-500'
                      : 'border-emerald-200 focus:border-emerald-500'
                  } transition-colors rounded-xl`}
                />
              </div>
              
              {!isForgotPassword && !isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-12 h-12 border-2 border-emerald-200 focus:border-emerald-500 transition-colors rounded-xl"
                  />
                </div>
              )}
              
              {!isForgotPassword && (
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isLogin ? 'text-violet-500' : 'text-emerald-500'
                  } w-5 h-5`} />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`pl-12 h-12 border-2 ${
                      isLogin 
                        ? 'border-violet-200 focus:border-violet-500' 
                        : 'border-emerald-200 focus:border-emerald-500'
                    } transition-colors rounded-xl`}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className={`w-full h-12 bg-gradient-to-r ${
                  isForgotPassword
                    ? 'from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600'
                    : isLogin 
                    ? 'from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600' 
                    : 'from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600'
                } text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isForgotPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
              
              <div className="text-center space-y-2">
                {!isForgotPassword && (
                  <Button 
                    type="button" 
                    variant="link"
                    onClick={switchMode}
                    className={`${
                      isLogin ? 'text-violet-600 hover:text-violet-700' : 'text-emerald-600 hover:text-emerald-700'
                    } font-medium`}
                  >
                    {isLogin 
                      ? "Don't have an account? Create one here" 
                      : "Already have an account? Sign in here"
                    }
                  </Button>
                )}
                
                {isLogin && (
                  <Button 
                    type="button" 
                    variant="link"
                    onClick={toggleForgotPassword}
                    className="text-gray-600 hover:text-gray-700 font-medium"
                  >
                    {isForgotPassword ? 'Back to Sign In' : 'Forgot Password?'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <p className="font-semibold mb-2">For Testing:</p>
          <p>• Use your email address: <strong>krutikasalve24@gmail.com</strong></p>
          <p>• Sign-in works with email and password only</p>
        </div>
      </div>
    </div>
  );
};
