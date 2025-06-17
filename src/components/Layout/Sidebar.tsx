import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Upload, 
  Settings, 
  X,
  Wallet,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home /> },
    { name: 'Invoices', path: '/invoices', icon: <FileText /> },
    { name: 'Upload', path: '/upload', icon: <Upload /> },
    { name: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-900/50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 glass-card border-r border-white/20 pt-20 flex flex-col transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex items-center justify-between px-4 py-2 md:hidden">
          <h2 className="font-bold text-lg gradient-text">EasyBill</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-primary-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => toggleSidebar()}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-300/30 text-primary-500 font-medium' 
                      : 'hover:bg-white/20 text-neutral-700'
                  }`
                }
              >
                <span className={`${location.pathname === item.path ? 'text-primary-500' : 'text-neutral-500'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4">
          <div className="glass-card bg-white/40 rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-primary-500">Quick Pay</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-3">Pay your bills instantly with a single click.</p>
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Pay Now</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;