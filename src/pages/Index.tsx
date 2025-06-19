import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/auth/AuthPage';
import { GameDashboard } from '@/components/dashboard/GameDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Index = () => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-rose-50 via-amber-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Show admin dashboard for admin users
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Show game dashboard for regular users
  return <GameDashboard />;
};

export default Index;
