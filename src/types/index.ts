export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
};

export type InvoiceStatus = 'paid' | 'due_soon' | 'overdue';

export type InvoiceCategory = 
  | 'electricity' 
  | 'water' 
  | 'property_tax' 
  | 'internet' 
  | 'phone' 
  | 'gas'
  | 'insurance' 
  | 'other';

export type Invoice = {
  id: string;
  userId: string;
  category: InvoiceCategory;
  supplier: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: InvoiceStatus;
  barcode?: string;
  billNumber?: string;
  isPaid: boolean;
  isRecurring: boolean;
  attachmentUrl?: string;
  notes?: string;
  sharedWith?: string[];
};

export type ChartData = {
  labels: string[];
  values: number[];
};

export type MonthlyTotal = {
  month: string;
  total: number;
};

export type CategoryTotal = {
  category: InvoiceCategory;
  total: number;
};

export type BillsStatus = {
  paid: number;
  dueSoon: number;
  overdue: number;
  total: number;
};

export type MockData = {
  user: User;
  invoices: Invoice[];
};