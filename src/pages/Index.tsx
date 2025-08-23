import { useLinkStore } from '@/store/linkStore';
import { URLShortenerForm } from '@/components/URLShortenerForm';
import { LinkCard } from '@/components/LinkCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { 
  TrendingUp, 
  Link2, 
  Clock, 
  Zap,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';

const Index = () => {
  const { links, isAuthenticated, user } = useLinkStore();
  const recentLinks = links.slice(0, 3);
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  // Mock stats for demo
  const stats = [
    {
      title: "Total Links",
      value: links.length.toString(),
      change: "+12%",
      icon: Link2,
      color: "blue"
    },
    {
      title: "Total Clicks", 
      value: totalClicks.toString(),
      change: "+25%",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "This Month",
      value: "47",
      change: "+8%", 
      icon: BarChart3,
      color: "orange"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">karshLinksh</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your long URLs into powerful, trackable short links with beautiful analytics
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* URL Shortener Form - Takes full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2">
            <URLShortenerForm />
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`bento-card bento-card-${stat.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                      {stat.change} from last month
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Links */}
        {recentLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Links</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {links.length} total
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLinks.map((link) => (
                <LinkCard key={link.id} link={link} compact />
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bento-card text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Generate short links instantly with our optimized infrastructure</p>
          </Card>

          <Card className="bento-card text-center p-6">
            <div className="w-12 h-12 bg-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green" />
            </div>
            <h3 className="font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground">Track clicks, locations, and user engagement in real-time</p>
          </Card>

          <Card className="bento-card text-center p-6">
            <div className="w-12 h-12 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-orange" />
            </div>
            <h3 className="font-semibold mb-2">Global CDN</h3>
            <p className="text-sm text-muted-foreground">Fast redirects worldwide with our distributed network</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
