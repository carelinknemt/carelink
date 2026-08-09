import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('carelink_admin_auth') === 'true';
  });

  const login = (email: string, pass: string): boolean => {
    if (email.trim() !== '' && pass.length >= 4) {
      sessionStorage.setItem('carelink_admin_auth', 'true');
      setIsAuthenticated(true);

      return true;
    }

    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('carelink_admin_auth');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleAuthCheck = () => {
      setIsAuthenticated(sessionStorage.getItem('carelink_admin_auth') === 'true');
    };
    window.addEventListener('storage', handleAuthCheck);

    return () => window.removeEventListener('storage', handleAuthCheck);
  }, []);

  return { isAuthenticated, login, logout };
}
