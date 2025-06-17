const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');


app.use(cors());
app.use(express.json());

console.log('✅ EasyBill backend is starting...');

// רק את הנתיב הרלוונטי:
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
//fghfghfhgfhfhgh