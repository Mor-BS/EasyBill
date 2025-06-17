import React from 'react';
import { Menu, User, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, toggleSidebar }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card px-4 py-3 md:px-6 md:py-4 border-b border-white/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-primary-500" />
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold gradient-text">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="p-2 rounded-full hover:bg-white/20 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-primary-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="User menu"
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white/50"
                />
              ) : (
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-300 flex items-center justify-center text-white font-medium">
                  {user?.name?.substring(0, 1) || 'U'}
                </div>
              )}
            </button>
            
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 glass-card rounded-lg py-2 shadow-lg"
              >
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="font-medium text-primary-500">{user?.name}</p>
                  <p className="text-sm text-neutral-600 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white/20 transition-colors"
                >
                  <User className="w-4 h-4 text-primary-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white/20 transition-colors text-danger-500"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;