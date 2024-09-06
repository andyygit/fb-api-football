import sqlite3 from 'sqlite3';

sqlite3.verbose();

const initDatabase = () => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};
