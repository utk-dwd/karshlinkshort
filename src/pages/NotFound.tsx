import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Page not found</h1>
        <p className="text-xl text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-glow text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
