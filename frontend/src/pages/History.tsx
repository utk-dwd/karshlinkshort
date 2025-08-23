import { useLinkStore } from '@/store/linkStore';
import { LinkCard } from '@/components/LinkCard';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Link2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const History = () => {
  const { links, folders, isAuthenticated, fetchAllData } = useLinkStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links;

    if (searchQuery) {
      filtered = filtered.filter(
        (link) =>
          link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // CORRECTED: Filter by folderId
    if (selectedFolder !== 'all') {
      filtered = filtered.filter((link) => link.folderId === selectedFolder);
    }

    // CORRECTED: Sort by converting date strings to Date objects
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'clicks':
        return filtered.sort((a, b) => b.clicks - a.clicks);
      default:
        return filtered;
    }
  }, [links, searchQuery, selectedFolder, sortBy]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="bento-card text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your link history and analytics.
            </p>
            <Button onClick={handleLogin} className="bg-gradient-to-r from-primary to-primary-glow">
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
            <h1 className="text-3xl font-bold text-foreground">Link History</h1>
            <p className="text-muted-foreground">Manage and track all your shortened links</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {links.length} total links
            </Badge>
            <Badge variant="outline" className="bg-green/10 text-green border-green/20">
              {activeLinks} active
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-white/80 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">{Math.ceil(links.length * 0.6)}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bento-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${folder.color.toLowerCase()}-500`} />
                      <span>{folder.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="clicks">Most Clicks</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Links Grid */}
        {filteredAndSortedLinks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAndSortedLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <Card className="bento-card text-center p-12">
            <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No links found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedFolder !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "Start by creating your first shortened link!"}
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default History;