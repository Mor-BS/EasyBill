import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Share, 
  Download, 
  Save,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Printer,
  Banknote
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/mockData';
import { Invoice } from '../types';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice } = useApp();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const foundInvoice = invoices.find(inv => inv.id === id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
        setEditedInvoice(foundInvoice);
      } else {
        navigate('/invoices');
      }
    }
  }, [id, invoices, navigate]);

  const handleEditToggle = () => {
    if (isEditing && editedInvoice) {
      // Save changes
      updateInvoice(editedInvoice.id, editedInvoice);
      setInvoice(editedInvoice);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedInvoice) return;
    
    const { name, value, type } = e.target;
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setEditedInvoice({
      ...editedInvoice,
      [name]: processedValue,
    });
  };

  const handleDeleteInvoice = () => {
    if (invoice) {
      deleteInvoice(invoice.id);
      navigate('/invoices');
    }
  };

  const getStatusIcon = () => {
    if (!invoice) return null;
    
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'due_soon':
        return <Clock className="w-5 h-5 text-warning-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-danger-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (): string => {
    if (!invoice) return '';
    
    switch (invoice.status) {
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

  const getStatusClass = (): string => {
    if (!invoice) return '';
    
    switch (invoice.status) {
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

  if (!invoice) {
    return <Layout title="Invoice Details"><div>Loading...</div></Layout>;
  }

  return (
    <Layout title="Invoice Details">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => navigate('/invoices')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invoices</span>
          </button>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleEditToggle}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-secondary flex items-center gap-2 hover:text-danger-500"
                >
                  <Trash className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button
                  className="btn-secondary flex items-center gap-2"
                >
                  <Share className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Invoice Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-500">
                {isEditing ? (
                  <input
                    type="text"
                    name="supplier"
                    value={editedInvoice?.supplier || ''}
                    onChange={handleInputChange}
                    className="input-field text-2xl font-bold text-primary-500 px-0 py-0 bg-transparent"
                  />
                ) : (
                  invoice.supplier
                )}
              </h1>
              <p className="text-neutral-600 mt-1 capitalize">
                {invoice.category.replace('_', ' ')}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-primary-500">
                {isEditing ? (
                  <div className="flex items-center justify-end">
                    <span className="mr-2">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={editedInvoice?.amount || 0}
                      onChange={handleInputChange}
                      className="input-field text-3xl font-bold text-primary-500 px-0 py-0 bg-transparent w-32 text-right"
                    />
                  </div>
                ) : (
                  formatCurrency(invoice.amount)
                )}
              </div>
              <div className="flex items-center justify-end mt-2 gap-1">
                {getStatusIcon()}
                <span 
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass()}`}
                >
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Bill Details</h3>
              <div className="glass-card bg-white/20 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Bill Number</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="billNumber"
                      value={editedInvoice?.billNumber || ''}
                      onChange={handleInputChange}
                      className="input-field bg-white/30 px-2 py-1 text-sm text-right"
                    />
                  ) : (
                    <span className="font-medium">{invoice.billNumber || '-'}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Issue Date</span>
                  {isEditing ? (
                    <input
                      type="date"
                      name="issueDate"
                      value={editedInvoice?.issueDate.split('T')[0] || ''}
                      onChange={handleInputChange}
                      className="input-field bg-white/30 px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Due Date</span>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dueDate"
                      value={editedInvoice?.dueDate.split('T')[0] || ''}
                      onChange={handleInputChange}
                      className="input-field bg-white/30 px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Barcode</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="barcode"
                      value={editedInvoice?.barcode || ''}
                      onChange={handleInputChange}
                      className="input-field bg-white/30 px-2 py-1 text-sm text-right"
                    />
                  ) : (
                    <span className="font-medium font-mono">{invoice.barcode || '-'}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Recurring</span>
                  {isEditing ? (
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        name="isRecurring"
                        id="isRecurring"
                        checked={editedInvoice?.isRecurring || false}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="isRecurring"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                          editedInvoice?.isRecurring ? 'bg-primary-400' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform ${
                            editedInvoice?.isRecurring ? 'translate-x-4 bg-white' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </label>
                    </div>
                  ) : (
                    <span className="font-medium">{invoice.isRecurring ? 'Yes' : 'No'}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Additional Information</h3>
              <div className="glass-card bg-white/20 rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-neutral-600 block mb-1">Notes</label>
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={editedInvoice?.notes || ''}
                      onChange={handleInputChange}
                      className="input-field bg-white/30 w-full h-24 resize-none"
                      placeholder="Add notes about this bill..."
                    />
                  ) : (
                    <p className="text-sm">
                      {invoice.notes || 'No notes provided.'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="text-neutral-600 block mb-1">Shared With</label>
                  {invoice.sharedWith && invoice.sharedWith.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {invoice.sharedWith.map((userId, index) => (
                        <div 
                          key={index}
                          className="bg-primary-100 text-primary-500 px-3 py-1 rounded-full text-sm"
                        >
                          User #{userId}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">Not shared with anyone.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            <span>Pay Now</span>
          </button>
          
          <button className="btn-secondary flex items-center gap-2">
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
          
          <button className="btn-secondary flex items-center gap-2">
            <Share className="w-5 h-5" />
            <span>Share with Roommates</span>
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card bg-white/50 rounded-xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="w-8 h-8 text-danger-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Delete Invoice</h3>
              <p className="text-neutral-600">
                Are you sure you want to delete this invoice? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              
              <button
                onClick={handleDeleteInvoice}
                className="bg-danger-500 hover:bg-danger-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-1 flex items-center justify-center gap-2"
              >
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default InvoiceDetailPage;