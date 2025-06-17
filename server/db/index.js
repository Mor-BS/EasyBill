const { Pool } = require('pg');
require('dotenv').config();

console.log("💡 DB FILE USED:", __filename);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'easybill',
  password: '123456789', // ודא שהסיסמה נכונה
  port: 5433,            // או 5432 אם אתה לא בטוח - תלוי איך PgAdmin מוגדר
});

module.exports = pool;
