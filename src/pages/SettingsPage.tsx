import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  CreditCard, 
  Users,
  Check,
  X
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Mock settings state
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    remindersBefore: 3, // days
    remindersDue: true,
    remindersOverdue: true
  });
  const [paymentMethods, setPaymentMethods] = useState([
    { 
      id: '1', 
      type: 'card',
      name: 'Personal Card', 
      last4: '4242', 
      expiry: '12/24', 
      isDefault: true 
    }
  ]);
  const [sharedAccounts, setSharedAccounts] = useState([
    { id: '1', name: 'Roommate 1', email: 'roommate1@example.com', status: 'active' },
    { id: '2', name: 'Roommate 2', email: 'roommate2@example.com', status: 'invited' }
  ]);

  const handleSaveSettings = () => {
    // This would actually save settings to an API
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleRemoveSharedAccount = (id: string) => {
    setSharedAccounts(prev => prev.filter(account => account.id !== id));
  };

  const handleDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  return (
    <Layout title="Settings">
      <div className="max-w-4xl mx-auto">
        {/* Settings Navigation */}
        <div className="glass-card rounded-xl p-2 mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'bg-primary-300 text-white' 
                : 'hover:bg-white/30'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-primary-300 text-white' 
                : 'hover:bg-white/30'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'payment' 
                ? 'bg-primary-300 text-white' 
                : 'hover:bg-white/30'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Payment</span>
          </button>
          
          <button
            onClick={() => setActiveTab('sharing')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sharing' 
                ? 'bg-primary-300 text-white' 
                : 'hover:bg-white/30'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Sharing</span>
          </button>
        </div>
        
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-primary-500 border-b border-white/20 pb-2">
              Profile Settings
            </h2>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-32 flex flex-col items-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-300 flex items-center justify-center text-white text-xl font-medium">
                    {name.substring(0, 1)}
                  </div>
                )}
                
                <button className="mt-3 text-sm text-primary-400 hover:text-primary-500 font-medium">
                  Change Photo
                </button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value="••••••••"
                    readOnly
                    className="input-field w-full"
                  />
                  <button className="mt-1 text-sm text-primary-400 hover:text-primary-500 font-medium">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveSettings}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-primary-500 border-b border-white/20 pb-2">
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-neutral-600">Receive bill updates via email</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="emailNotif"
                    checked={notifications.email}
                    onChange={() => setNotifications({...notifications, email: !notifications.email})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="emailNotif"
                    className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                      notifications.email ? 'bg-primary-400' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full transform transition-transform ${
                        notifications.email ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-neutral-600">Receive push notifications on your device</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="pushNotif"
                    checked={notifications.push}
                    onChange={() => setNotifications({...notifications, push: !notifications.push})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="pushNotif"
                    className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                      notifications.push ? 'bg-primary-400' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full transform transition-transform ${
                        notifications.push ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </label>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <h3 className="font-medium mb-3">Reminder Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="reminderDays" className="block text-sm text-neutral-600 mb-1">
                      Send reminder before due date (days)
                    </label>
                    <select
                      id="reminderDays"
                      value={notifications.remindersBefore}
                      onChange={(e) => setNotifications({...notifications, remindersBefore: parseInt(e.target.value)})}
                      className="input-field w-full md:w-48"
                    >
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={5}>5 days before</option>
                      <option value={7}>7 days before</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="reminderDue"
                      checked={notifications.remindersDue}
                      onChange={() => setNotifications({...notifications, remindersDue: !notifications.remindersDue})}
                      className="w-4 h-4 text-primary-400 rounded"
                    />
                    <label htmlFor="reminderDue" className="text-sm">
                      Remind me on the due date
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="reminderOverdue"
                      checked={notifications.remindersOverdue}
                      onChange={() => setNotifications({...notifications, remindersOverdue: !notifications.remindersOverdue})}
                      className="w-4 h-4 text-primary-400 rounded"
                    />
                    <label htmlFor="reminderOverdue" className="text-sm">
                      Remind me when bills are overdue
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveSettings}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-primary-500 border-b border-white/20 pb-2">
              Payment Methods
            </h2>
            
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className="glass-card bg-white/20 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-neutral-600">
                        •••• {method.last4} | Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {method.isDefault ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-500">
                        <Check className="w-3 h-3 mr-1" />
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDefaultPaymentMethod(method.id)}
                        className="text-sm text-primary-400 hover:text-primary-500"
                      >
                        Set as default
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="text-neutral-500 hover:text-danger-500 ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="btn-primary flex items-center gap-2 w-full justify-center">
                <CreditCard className="w-5 h-5" />
                <span>Add Payment Method</span>
              </button>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <h3 className="font-medium mb-4">Automatic Payments</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Enable Auto-Pay</h4>
                  <p className="text-sm text-neutral-600">Bills will be paid automatically when due</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="autoPay"
                    checked={true}
                    className="sr-only"
                  />
                  <label
                    htmlFor="autoPay"
                    className="block h-6 overflow-hidden rounded-full cursor-pointer bg-primary-400"
                  >
                    <span
                      className="block h-6 w-6 rounded-full transform translate-x-6 bg-white"
                    />
                  </label>
                </div>
              </div>
              
              <div className="glass-card bg-white/20 rounded-lg p-4">
                <p className="text-sm text-neutral-600">
                  When enabled, bills will be automatically paid on their due date using your default payment method.
                  You can disable auto-pay for individual bills.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Sharing Settings */}
        {activeTab === 'sharing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-primary-500 border-b border-white/20 pb-2">
              Shared Access
            </h2>
            
            <div className="space-y-4">
              <p className="text-neutral-600">
                Share your bills with roommates or family members. They'll be able to view and contribute to shared bills.
              </p>
              
              {sharedAccounts.map(account => (
                <div 
                  key={account.id}
                  className="glass-card bg-white/20 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center text-white font-medium">
                      {account.name.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-neutral-600">{account.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.status === 'active' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {account.status === 'active' ? 'Active' : 'Invited'}
                    </span>
                    
                    <button
                      onClick={() => handleRemoveSharedAccount(account.id)}
                      className="text-neutral-500 hover:text-danger-500 ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="glass-card bg-white/20 rounded-lg p-4">
                <h3 className="font-medium mb-3">Invite New Member</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="input-field flex-1"
                  />
                  <button className="btn-primary">
                    Send Invite
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h3 className="font-medium mb-4">Sharing Preferences</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Auto-share new bills</h4>
                    <p className="text-sm text-neutral-600">Automatically share new bills with all members</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="autoShare"
                      checked={true}
                      className="sr-only"
                    />
                    <label
                      htmlFor="autoShare"
                      className="block h-6 overflow-hidden rounded-full cursor-pointer bg-primary-400"
                    >
                      <span
                        className="block h-6 w-6 rounded-full transform translate-x-6 bg-white"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow members to add bills</h4>
                    <p className="text-sm text-neutral-600">Let shared members add new bills to your account</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="allowAdd"
                      checked={false}
                      className="sr-only"
                    />
                    <label
                      htmlFor="allowAdd"
                      className="block h-6 overflow-hidden rounded-full cursor-pointer bg-neutral-300"
                    >
                      <span
                        className="block h-6 w-6 rounded-full transform translate-x-0 bg-white"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-6 right-6 glass-card rounded-lg p-4 bg-white/70 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-success-500" />
            </div>
            <p className="font-medium">Settings saved successfully!</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SettingsPage;