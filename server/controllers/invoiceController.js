const pool = require('../db');

const createInvoice = async (req, res) => {
  try {
    const {
      userId,
      category,
      supplier,
      amount,
      dueDate,
      issueDate,
      status,
      billNumber,
      barcode,
      isPaid,
      isRecurring,
      notes,
      attachmentUrl
    } = req.body;

    const result = await pool.query(
      `INSERT INTO invoice (
        account_id,
        category,
        supplier_id,
        amount,
        date,
        contract_account,
        voucher_number,
        due_date,
        barcode,
        is_paid,
        is_recurring,
        notes,
        attachment_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        userId,
        category,
        1, // supplier_id — אתה יכול לשנות את זה למזהה אמיתי
        amount,
        issueDate,
        'acc1', // contract_account — ערך דמה זמני
        billNumber,
        dueDate,
        barcode,
        isPaid,
        isRecurring,
        notes,
        attachmentUrl
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error saving invoice:', error);
    res.status(500).send('Server error');
  }
};

const getInvoices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoice ORDER BY invoice_id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching invoices:', error);
    res.status(500).send('Server error');
  }
};

module.exports = { createInvoice, getInvoices };
