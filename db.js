const mysql = require("mysql2/promise");

// Sesuaikan jika MySQL Anda memakai password
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
};
const DB_NAME = "db_siswa";

// Pool koneksi yang dipakai oleh server.js
const pool = mysql.createPool({
  ...DB_CONFIG,
  database: DB_NAME,
  dateStrings: true, // tanggal tetap berformat YYYY-MM-DD
  waitForConnections: true,
  connectionLimit: 10,
});

// Membuat database dan tabel otomatis jika belum ada
async function initDb() {
  const conn = await mysql.createConnection(DB_CONFIG);
  await conn.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  await conn.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS siswa (
      kode_siswa    VARCHAR(20)  PRIMARY KEY,
      nama_siswa    VARCHAR(100) NOT NULL,
      alamat_siswa  VARCHAR(255),
      tgl_siswa     DATE,
      jurusan_siswa VARCHAR(100)
    )
  `);
  console.log("Database dan tabel siswa siap dipakai");
}

module.exports = { pool, initDb };
