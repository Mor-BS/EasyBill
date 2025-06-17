import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-500 flex flex-col">
      <Navbar title={title} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 md:pt-24"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;