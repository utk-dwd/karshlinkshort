import { Link, useLocation } from 'react-router-dom';
import { Home, History, FolderOpen, User } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/folders', icon: FolderOpen, label: 'Folders' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};