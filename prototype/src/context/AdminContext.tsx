import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  activeSection: 'DISPATCH' | 'FLEET' | 'SERVICES';
  setActiveSection: (section: 'DISPATCH' | 'FLEET' | 'SERVICES') => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('carelink_admin_auth') === 'true';
  });
  const [activeSection, setActiveSection] = useState<'DISPATCH' | 'FLEET' | 'SERVICES'>('DISPATCH');

  const login = (email: string, pass: string) => {
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

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, activeSection, setActiveSection }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }

  return context;
};
