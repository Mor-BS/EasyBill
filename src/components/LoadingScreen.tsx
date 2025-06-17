import React from 'react';
import { RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-100 to-primary-400 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RotateCw size={40} className="text-primary-500" />
        </motion.div>
        <h2 className="text-xl font-semibold text-primary-500 mt-4">Loading EasyBill</h2>
        <p className="text-neutral-600 mt-2">Please wait...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;