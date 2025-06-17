import axios from 'axios';
import { Invoice } from '../types';

const API_URL = 'http://localhost:3001/api/invoices';

export const createInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  const response = await axios.post(API_URL, invoice);
  return response.data as Invoice;
};

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};
