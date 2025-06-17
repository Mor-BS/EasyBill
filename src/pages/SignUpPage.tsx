import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [user_type, setUserType] = useState('standard');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, first_name, last_name, phone_number, user_type);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-8 md:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold gradient-text mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Create your account
          </motion.h1>
          <motion.p 
            className="text-neutral-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Start managing your bills smarter
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-danger-100 border border-danger-500/30 text-danger-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="First Name" value={first_name} onChange={setFirstName} icon={<User />} />
          <InputField label="Last Name" value={last_name} onChange={setLastName} icon={<User />} />
          <InputField label="Email" value={email} onChange={setEmail} icon={<Mail />} type="email" />
          <InputField label="Phone Number" value={phone_number} onChange={setPhoneNumber} icon={<Phone />} />

          {/* User Type Selection */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-neutral-700 mb-1">
              User Type
            </label>
            <div className="relative">
              <select
                id="userType"
                value={user_type}
                onChange={(e) => setUserType(e.target.value)}
                className="input-field w-full pl-3 pr-8 py-2 border rounded-md text-sm"
              >
                <option value="standard">Standard</option>
                <option value="admin">Admin</option>
                <option value="family">Family</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10 w-full"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Sign up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <div className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary-400 hover:text-primary-500">
              Log in
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  icon,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-10 w-full"
        placeholder={label}
      />
    </div>
  </div>
);

export default SignUpPage;
