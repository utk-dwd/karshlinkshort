import { useLinkStore } from '@/store/linkStore';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Mail, Link2, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Profile = () => {
  // Get real user data and actions from the store
  const { user, isAuthenticated, logout, links } = useLinkStore();

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  // Unauthenticated View
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="bento-card text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to karshLinksh</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to access your profile and track your links.
            </p>
            <Button onClick={handleLogin} className="bg-gradient-to-r from-primary to-primary-glow">
              <User className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Authenticated View
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your statistics</p>
          </div>
          
          <Button
            variant="outline"
            onClick={logout} // Use logout action from the store
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Info */}
        <Card className="bento-card bento-card-purple p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="w-24 h-24 ring-4 ring-white/20">
              <AvatarImage src={user.avatar || ''} alt={user.name || 'User'} />
              <AvatarFallback className="bg-white/20 text-white text-xl">
                {user.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <div className="flex items-center space-x-2 text-white/80 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/20">
                  Plan: {user.plan}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bento-card bento-card-blue p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Links</p>
                <p className="text-2xl font-bold text-white">{links.length}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
          <Card className="bento-card bento-card-green p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
          {/* Add other stats cards as needed */}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;