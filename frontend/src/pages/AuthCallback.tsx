// frontend/src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLinkStore } from '@/store/linkStore';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLinkStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token).then(() => {
        // IMPORTANT FIX: Navigate to the /profile page after login
        navigate('/profile'); 
      });
    } else {
      // Redirect home if no token is found
      navigate('/'); 
    }
  }, [location, login, navigate]);

  // You can show a loading spinner or a simple message here
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Authenticating, please wait...</p>
      </div>
    </div>
  );
};