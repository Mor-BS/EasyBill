
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Camera, 
  Plus, 
  ReceiptText,
  Droplets,
  Home,
  Wifi,
  Phone,
  Flame,
  Shield,
  FileSpreadsheet,
  X,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { InvoiceCategory } from '../types';
import { createInvoice } from '../services/invoiceService';
import { InvoiceStatus } from '../types';

interface CategoryOption {
  value: InvoiceCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const InvoiceUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addInvoice } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [isManualForm, setIsManualForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<InvoiceCategory>('electricity');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');

  const categories: CategoryOption[] = [
    { value: 'electricity', label: 'Electricity', icon: <ReceiptText />, color: '#3E8E9E' },
    { value: 'water', label: 'Water', icon: <Droplets />, color: '#8EE3EF' },
    { value: 'property_tax', label: 'Property Tax', icon: <Home />, color: '#70CAD1' },
    { value: 'internet', label: 'Internet', icon: <Wifi />, color: '#A8E0FF' },
    { value: 'phone', label: 'Phone', icon: <Phone />, color: '#2F4858' },
    { value: 'gas', label: 'Gas', icon: <Flame />, color: '#6D9DC5' },
    { value: 'insurance', label: 'Insurance', icon: <Shield />, color: '#80BCBD' },
    { value: 'other', label: 'Other', icon: <FileSpreadsheet />, color: '#4E6E81' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        simulateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        simulateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const simulateScan = () => {
    setIsScanning(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanComplete(true);
            setIsScanning(false);
            // Auto-fill form with mock data after scan
            setSupplier('City Electric Co.');
            setAmount('98.75');
            setCategory('electricity');
            
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);
            setIssueDate(lastMonth.toISOString().split('T')[0]);
            
            const nextMonth = new Date();
            nextMonth.setDate(today.getDate() + 20);
            setDueDate(nextMonth.toISOString().split('T')[0]);
            
            setBillNumber(`INV-${Math.floor(Math.random() * 10000)}`);
            setIsManualForm(true);
          }, 500);
        }
        return newProgress;
      });
    }, 50);
  };

  const handleCameraScan = () => {
    // In a real app, this would activate the device camera
    // For demo purposes, we'll simulate the file upload instead
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleManualEntry = () => {
    setIsManualForm(true);
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const id = `inv-${Date.now()}`;
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const newInvoice = {
    id,
    userId: currentUser.id,
    category,
    supplier,
    amount: parseFloat(amount),
    dueDate: new Date(dueDate).toISOString(),
    issueDate: new Date(issueDate).toISOString(),
    status: 'due_soon' as InvoiceStatus,
    billNumber,
    barcode: Math.random().toString(36).substring(2, 15),
    isPaid: false,
    isRecurring,
    notes,
    attachmentUrl: selectedImage || undefined,
  };

  try {
    const savedInvoice = await createInvoice(newInvoice);
    addInvoice(savedInvoice); // שמירה גם בקונטקסט לניווט מיידי
    navigate(`/invoices/${savedInvoice.id}`);
  } catch (error) {
    console.error('❌ Failed to save invoice:', error);
  }
};

  const resetForm = () => {
    setSelectedImage(null);
    setIsScanning(false);
    setScanComplete(false);
    setUploadProgress(0);
    setIsManualForm(false);
    setSupplier('');
    setAmount('');
    setCategory('electricity');
    setIssueDate('');
    setDueDate('');
    setBillNumber('');
    setIsRecurring(false);
    setNotes('');
  };

  return (
    <Layout title="Upload Invoice">
      <div className="max-w-3xl mx-auto">
        {!isManualForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 md:p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-500 mb-2">Add a New Invoice</h2>
              <p className="text-neutral-600">
                Upload your bill by scanning or taking a photo, or enter the details manually
              </p>
            </div>
            
            {!isScanning && !scanComplete && (
              <div 
                className="glass-card bg-white/40 border-dashed border-2 border-primary-300 rounded-xl p-10 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-primary-500 mb-2">Drag & Drop Your Invoice</h3>
                <p className="text-neutral-600 mb-6">
                  Supported formats: JPG, PNG, PDF
                </p>
                
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload File</span>
                  </button>
                  
                  <button
                    onClick={handleCameraScan}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Take a Photo</span>
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={handleManualEntry}
                    className="text-primary-400 hover:text-primary-500 font-medium flex items-center gap-1 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enter details manually</span>
                  </button>
                </div>
              </div>
            )}
            
            {isScanning && (
              <div className="text-center">
                <div className="relative mx-auto w-64 h-64 mb-6 overflow-hidden rounded-xl">
                  {selectedImage && (
                    <img 
                      src={selectedImage} 
                      alt="Invoice" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-primary-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-primary-500 mb-4">Scanning Your Invoice</h3>
                
                <div className="w-full bg-white/30 h-2 rounded-full mb-2 overflow-hidden">
                  <div 
                    className="bg-primary-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-neutral-600">Extracting data... ({uploadProgress}%)</p>
              </div>
            )}
            
            {scanComplete && (
              <div className="text-center">
                <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-success-500" />
                </div>
                
                <h3 className="text-xl font-medium text-primary-500 mb-2">Scan Complete!</h3>
                <p className="text-neutral-600 mb-6">
                  We've extracted the information from your invoice. You can review and edit the details.
                </p>
                
                <button
                  onClick={() => setIsManualForm(true)}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <span>Review Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary-500">
                {scanComplete ? 'Review Invoice Details' : 'Enter Invoice Details'}
              </h2>
              <button
                onClick={resetForm}
                className="btn-secondary flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {selectedImage && (
                <div className="glass-card rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedImage} 
                      alt="Invoice preview" 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">Uploaded Invoice</h4>
                      <p className="text-sm text-neutral-600">Image attached</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-neutral-500 hover:text-danger-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-medium text-lg text-primary-500 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-neutral-700 mb-1">
                      Supplier / Company
                    </label>
                    <input
                      id="supplier"
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="input-field w-full"
                      placeholder="e.g. City Electric Co."
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                        $
                      </span>
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-field w-full pl-8"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bill Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                          category === cat.value
                            ? `bg-white/50 border-2 border-${cat.color.substring(1)}`
                            : 'glass-card hover:bg-white/40'
                        }`}
                        style={
                          category === cat.value 
                            ? { borderColor: cat.color } 
                            : undefined
                        }
                      >
                        <span 
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                          style={{ backgroundColor: cat.color }}
                        >
                          {React.cloneElement(cat.icon as any, { 
                            className: "w-5 h-5 text-white" 
                          })}
                        </span>
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-medium text-lg text-primary-500 mb-4">Additional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-neutral-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      id="issueDate"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                      Bill / Invoice Number
                    </label>
                    <input
                      id="billNumber"
                      type="text"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="input-field w-full"
                      placeholder="e.g. INV-12345"
                    />
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <label className="text-sm font-medium text-neutral-700 mr-4">
                      Recurring Bill
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="isRecurring"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                          isRecurring ? 'bg-primary-400' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform ${
                            isRecurring ? 'translate-x-4 bg-white' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field w-full h-20 resize-none"
                    placeholder="Add any additional notes here..."
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceUploadPage;