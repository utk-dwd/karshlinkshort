import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLinkStore } from '@/store/linkStore';
import { LinkIcon, LogOut, User } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, setAuthenticated, setUser } = useLinkStore();

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/history', label: 'History' },
    { href: '/folders', label: 'Folders' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="hidden md:block border-b border-border bg-surface/95 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">karshLinksh</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleGoogleLogin} className="bg-gradient-to-r from-primary to-primary-glow">
                <User className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};