import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get('http://localhost:8000/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token'); 
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;