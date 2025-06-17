import { User, Invoice, InvoiceCategory, InvoiceStatus, MockData } from '../types';

const categories: InvoiceCategory[] = [
  'electricity', 'water', 'property_tax', 'internet', 'phone', 'gas', 'insurance', 'other'
];

const suppliers = {
  electricity: ['National Electric', 'Power Co.', 'EnergyPlus'],
  water: ['City Water', 'AquaFlow', 'H2O Services'],
  property_tax: ['City Council', 'Regional Authority', 'Tax Department'],
  internet: ['SpeedNet', 'Fiber Connect', 'WebWave'],
  phone: ['MobileTalk', 'Cell Pro', 'PhonePlus'],
  gas: ['GasWorks', 'FuelSupply', 'EnergyGas'],
  insurance: ['SafeGuard', 'ProtectAll', 'InsurePlus'],
  other: ['General Services', 'Municipal Dept.', 'Service Provider']
};

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function determineStatus(dueDate: Date): InvoiceStatus {
  const now = new Date();
  const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) {
    return 'overdue';
  } else if (daysUntilDue <= 7) {
    return 'due_soon';
  } else {
    return 'paid';
  }
}

export function generateMockData(): MockData {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  const mockInvoices: Invoice[] = [];
  
  // Generate invoices for the last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  // Generate about 30 invoices
  for (let i = 0; i < 30; i++) {
    const category = getRandomItem(categories);
    const issueDate = randomDate(sixMonthsAgo, now);
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + Math.floor(Math.random() * 30) + 15);
    
    const status = determineStatus(dueDate);
    const isPaid = status === 'paid';
    
    mockInvoices.push({
      id: `inv-${i+1}`,
      userId: mockUser.id,
      category,
      supplier: getRandomItem(suppliers[category]),
      amount: Math.floor(Math.random() * 500) + 50, // $50 to $550
      dueDate: dueDate.toISOString(),
      issueDate: issueDate.toISOString(),
      status,
      billNumber: `BIL-${Math.floor(Math.random() * 10000)}`,
      barcode: Math.random().toString(36).substring(2, 15),
      isPaid,
      isRecurring: Math.random() > 0.5,
      notes: Math.random() > 0.7 ? 'Important bill' : undefined,
      sharedWith: Math.random() > 0.7 ? ['2', '3'] : undefined
    });
  }

  // Sort by due date (newest first)
  mockInvoices.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return {
    user: mockUser,
    invoices: mockInvoices
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}