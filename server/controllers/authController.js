const pool = require('../db');
console.log('🔌 DB Pool Type:', typeof pool.query); // צריך להחזיר: function

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔐 Register
const registerUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number, user_type } = req.body;
    console.log("📥 Incoming data:", req.body);
    console.log("🔐 Password typeof:", typeof password);

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "User" (email, password, first_name, last_name, phone_number, user_type, creation_date)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
       RETURNING user_id`,
      [email, hashedPassword, first_name, last_name, phone_number || null, user_type || 'standard']
    );

    res.status(201).json({
      token: 'placeholder-token',
      user: {
        id: result.rows[0].user_id,
        name: `${first_name} ${last_name}`,
        email,
        phoneNumber: phone_number,
        userType: user_type || 'standard'
      }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔐 Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phoneNumber: user.phone_number,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).send('Server error');
  }
};

module.exports = { registerUser, loginUser };
