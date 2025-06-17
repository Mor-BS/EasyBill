import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Invoice } from '../types';
import { login as apiLogin } from '../services/authService';
import { fetchInvoices } from '../services/invoiceService';

type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  loading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

useEffect(() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (savedUser && token) {
    setUser(JSON.parse(savedUser));
    fetchInvoices().then(setInvoices);  // ⬅️ טען מהשרת
  }
  setLoading(false);
}, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  try {
    const raw = await apiLogin(email, password);
const data = raw as { token: string; user: User };
  // 👈 הפתרון פה
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return true;
  } catch (error) {
    console.error('❌ Login error:', error);
    return false;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (id: string, updatedInvoice: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
