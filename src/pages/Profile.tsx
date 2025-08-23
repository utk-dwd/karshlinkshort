import { useLinkStore } from '@/store/linkStore';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  TrendingUp, 
  Link2, 
  Calendar,
  MapPin,
  Mail,
  Globe,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, setUser, links } = useLinkStore();

  const handleGoogleLogin = () => {
    // Mock Google login
    setUser({
      name: 'Sandra Glam',
      email: 'sandra@example.com',
      avatar: '/lovable-uploads/cd22b732-7a98-4f5e-9c1e-ca8f3009b631.png',
      totalLinks: 12,
      totalClicks: 340,
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const avgClicksPerLink = links.length > 0 ? Math.round(totalClicks / links.length) : 0;
  const thisMonthLinks = Math.ceil(links.length * 0.6); // Mock calculation

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
              Sign in to access your profile, track your links, and view detailed analytics.
            </p>
            <Button onClick={handleGoogleLogin} className="bg-gradient-to-r from-primary to-primary-glow">
              <User className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your link statistics</p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="hover:bg-destructive hover:text-destructive-foreground border-destructive/20 text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Info */}
        <Card className="bento-card bento-card-purple p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="w-24 h-24 ring-4 ring-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-white/20 text-white text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <div className="flex items-center space-x-2 text-white/80 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80 mb-4">
                <MapPin className="w-4 h-4" />
                <span>Denmark, Copenhagen</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/20">
                  Member since Nov 2024
                </Badge>
                <Badge className="bg-white/20 text-white border-white/20">
                  Pro User
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

          <Card className="bento-card bento-card-orange p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Avg per Link</p>
                <p className="text-2xl font-bold text-white">{avgClicksPerLink}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bento-card bento-card-purple p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">{thisMonthLinks}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Activity and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bento-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Link created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-green/10 text-green border-green/20">
                  +1 click
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Profile updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="outline">Update</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Folder created</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <Badge variant="outline" className="bg-blue/10 text-blue border-blue/20">
                  Work
                </Badge>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="bento-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Account Overview</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <Badge className="bg-primary/10 text-primary border-primary/20">Pro</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm font-medium">12 / 1000 links</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Custom Domain</span>
                <Badge variant="outline">Available</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Access</span>
                <Badge className="bg-green/10 text-green border-green/20">Enabled</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;