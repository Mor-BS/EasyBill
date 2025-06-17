import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/mockData';
import { Invoice, InvoiceCategory, InvoiceStatus } from '../types';

const InvoiceListPage: React.FC = () => {
  const { invoices } = useApp();
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<InvoiceCategory | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, selectedStatus, selectedCategory]);

  const filterInvoices = () => {
    let filtered = [...invoices];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.supplier.toLowerCase().includes(query) ||
        invoice.category.toLowerCase().includes(query) ||
        invoice.amount.toString().includes(query)
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === selectedStatus);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(invoice => invoice.category === selectedCategory);
    }
    
    setFilteredInvoices(filtered);
  };

  const getCategoryColor = (category: InvoiceCategory): string => {
    const colors: Record<string, string> = {
      electricity: '#3E8E9E',
      water: '#8EE3EF',
      property_tax: '#70CAD1',
      internet: '#A8E0FF',
      phone: '#2F4858',
      gas: '#6D9DC5',
      insurance: '#80BCBD',
      other: '#4E6E81',
    };
    return colors[category] || '#2F4858';
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'due_soon':
        return <Clock className="w-4 h-4 text-warning-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-danger-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: InvoiceStatus): string => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'due_soon':
        return 'Due Soon';
      case 'overdue':
        return 'Overdue';
      default:
        return '';
    }
  };

  const getStatusClass = (status: InvoiceStatus): string => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-700';
      case 'due_soon':
        return 'bg-warning-100 text-warning-700';
      case 'overdue':
        return 'bg-danger-100 text-danger-700';
      default:
        return '';
    }
  };

  return (
    <Layout title="Invoices">
      <div className="space-y-6">
        {/* Top Actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">Filter</span>
            </button>
            
            <Link to="/upload" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">New Invoice</span>
            </Link>
          </div>
        </div>
        
        {/* Filter Section */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="input-field w-full"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="due_soon">Due Soon</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="input-field w-full"
                >
                  <option value="all">All Categories</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                  <option value="property_tax">Property Tax</option>
                  <option value="internet">Internet</option>
                  <option value="phone">Phone</option>
                  <option value="gas">Gas</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Status Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === 'all' 
                ? 'bg-primary-300 text-white' 
                : 'bg-white/30 text-neutral-700 hover:bg-white/50'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setSelectedStatus('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'paid' 
                ? 'bg-success-500 text-white' 
                : 'bg-success-100 text-success-700 hover:bg-success-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Paid</span>
          </button>
          <button 
            onClick={() => setSelectedStatus('due_soon')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'due_soon' 
                ? 'bg-warning-500 text-white' 
                : 'bg-warning-100 text-warning-700 hover:bg-warning-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Due Soon</span>
          </button>
          <button 
            onClick={() => setSelectedStatus('overdue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'overdue' 
                ? 'bg-danger-500 text-white' 
                : 'bg-danger-100 text-danger-700 hover:bg-danger-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Overdue</span>
          </button>
        </div>
        
        {/* Invoice List */}
        {filteredInvoices.length > 0 ? (
          <div className="space-y-4">
            {filteredInvoices.map(invoice => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="glass-card rounded-xl p-4 cursor-pointer"
                onClick={() => window.location.href = `/invoices/${invoice.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getCategoryColor(invoice.category) }}
                    >
                      <span className="text-white text-sm uppercase font-bold">
                        {invoice.category.substring(0, 2)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg">{invoice.supplier}</h3>
                      <p className="text-sm text-neutral-600">
                        {invoice.category.replace('_', ' ')}
                        {invoice.billNumber && ` • #${invoice.billNumber}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(invoice.amount)}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      {getStatusIcon(invoice.status)}
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(invoice.status)}`}
                      >
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-sm text-neutral-600">
                  <div>
                    <span className="font-medium">Issue:</span> {formatDate(invoice.issueDate)}
                  </div>
                  <div>
                    <span className="font-medium">Due:</span> {formatDate(invoice.dueDate)}
                  </div>
                  {invoice.isRecurring && (
                    <div className="bg-primary-100 text-primary-500 px-2 py-0.5 rounded-full text-xs">
                      Recurring
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-10 text-center">
            <h3 className="text-xl font-medium text-neutral-700 mb-2">No invoices found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your filters or search criteria</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add New Invoice</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceListPage;