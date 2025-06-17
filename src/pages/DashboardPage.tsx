import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/mockData';
import { Invoice, CategoryTotal, BillsStatus, MonthlyTotal } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const { invoices } = useApp();
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [billsStatus, setBillsStatus] = useState<BillsStatus>({
    paid: 0,
    dueSoon: 0,
    overdue: 0,
    total: 0,
  });

  useEffect(() => {
    calculateMonthlyTotals(invoices);
    calculateCategoryTotals(invoices);
    calculateBillsStatus(invoices);
  }, [invoices]);

  const calculateMonthlyTotals = (invoices: Invoice[]) => {
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    
    // Initialize with last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthYear] = 0;
    }
    
    // Fill with invoice data
    invoices.forEach(invoice => {
      const date = new Date(invoice.issueDate);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (monthlyData[monthYear] !== undefined) {
        monthlyData[monthYear] += invoice.amount;
      }
    });
    
    const result: MonthlyTotal[] = Object.entries(monthlyData).map(([month, total]) => ({
      month,
      total,
    }));
    
    setMonthlyTotals(result);
  };

  const calculateCategoryTotals = (invoices: Invoice[]) => {
    const categoryData: Record<string, number> = {
      electricity: 0,
      water: 0,
      property_tax: 0,
      internet: 0,
      phone: 0,
      gas: 0,
      insurance: 0,
      other: 0,
    };
    
    invoices.forEach(invoice => {
      categoryData[invoice.category] = (categoryData[invoice.category] || 0) + invoice.amount;
    });
    
    const result: CategoryTotal[] = Object.entries(categoryData)
      .map(([category, total]) => ({
        category: category as any,
        total,
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
    
    setCategoryTotals(result);
  };

  const calculateBillsStatus = (invoices: Invoice[]) => {
    const status = {
      paid: 0,
      dueSoon: 0,
      overdue: 0,
      total: invoices.length,
    };
    
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        status.paid++;
      } else if (invoice.status === 'due_soon') {
        status.dueSoon++;
      } else if (invoice.status === 'overdue') {
        status.overdue++;
      }
    });
    
    setBillsStatus(status);
  };

  const getTotalExpenses = () => {
    return invoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getCategoryColor = (category: string): string => {
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

  const monthlyChartData = {
    labels: monthlyTotals.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTotals.map(item => item.total),
        fill: true,
        backgroundColor: 'rgba(126, 211, 233, 0.2)',
        borderColor: '#70CAD1',
        tension: 0.4,
        pointBackgroundColor: '#3E8E9E',
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      },
    },
  };

  const categoryChartData = {
    labels: categoryTotals.map(item => item.category.replace('_', ' ')),
    datasets: [
      {
        data: categoryTotals.map(item => item.total),
        backgroundColor: categoryTotals.map(item => getCategoryColor(item.category)),
        borderWidth: 0,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = formatCurrency(context.raw);
            const percentage = Math.round(context.raw / getTotalExpenses() * 100) + '%';
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neutral-700 font-medium">Total Expenses</h3>
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <p className="text-2xl font-bold text-primary-500">{formatCurrency(getTotalExpenses())}</p>
            <p className="text-sm text-neutral-500 mt-1">Last 6 months</p>
          </div>
          
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neutral-700 font-medium">Average Monthly</h3>
              <TrendingDown className="w-5 h-5 text-primary-400" />
            </div>
            <p className="text-2xl font-bold text-primary-500">
              {formatCurrency(getTotalExpenses() / 6)}
            </p>
            <p className="text-sm text-neutral-500 mt-1">Per month</p>
          </div>
          
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neutral-700 font-medium">Bills Status</h3>
              <AlertCircle className="w-5 h-5 text-primary-400" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span className="font-semibold">{billsStatus.paid}</span>
                </div>
                <p className="text-xs text-neutral-500">Paid</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4 text-warning-500" />
                  <span className="font-semibold">{billsStatus.dueSoon}</span>
                </div>
                <p className="text-xs text-neutral-500">Due Soon</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-danger-500" />
                  <span className="font-semibold">{billsStatus.overdue}</span>
                </div>
                <p className="text-xs text-neutral-500">Overdue</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-5">
            <h3 className="text-xl font-semibold text-primary-500 mb-4">Monthly Expenses</h3>
            <div className="h-64">
              <Line data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-5">
            <h3 className="text-xl font-semibold text-primary-500 mb-4">Expenses by Category</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>
          </motion.div>
        </div>
        
        {/* Recent Bills */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary-500">Recent Bills</h3>
            <button 
              onClick={() => window.location.href = '/invoices'} 
              className="text-sm text-primary-400 hover:text-primary-500 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {invoices.slice(0, 3).map(invoice => (
              <div 
                key={invoice.id} 
                className="flex items-center justify-between p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/invoices/${invoice.id}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(invoice.category) }}
                  >
                    <span className="text-white text-xs uppercase font-bold">
                      {invoice.category.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{invoice.supplier}</h4>
                    <p className="text-sm text-neutral-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                  <span 
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      invoice.status === 'paid' 
                        ? 'bg-success-100 text-success-700' 
                        : invoice.status === 'due_soon' 
                        ? 'bg-warning-100 text-warning-700' 
                        : 'bg-danger-100 text-danger-700'
                    }`}
                  >
                    {invoice.status === 'paid' ? 'Paid' : invoice.status === 'due_soon' ? 'Due Soon' : 'Overdue'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default DashboardPage;