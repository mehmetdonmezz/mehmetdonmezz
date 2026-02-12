'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Admin context tipi
interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// Context oluştur
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin şifresi (gerçek projede database'de olur)
const ADMIN_PASSWORD = 'admin123';

// Provider component
export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage'dan admin durumunu yükle
  useEffect(() => {
    try {
      const adminStatus = localStorage.getItem('paw-store-admin');
      if (adminStatus === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error reading admin status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Admin girişi
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('paw-store-admin', 'true');
      return true;
    }
    return false;
  };

  // Admin çıkışı
  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('paw-store-admin');
  };

  const value = {
    isAdmin,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook kullanımı için
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}