const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_siswa",
  dateStrings: true,
});

app.get("/", (req, res) => {
  res.send("Backend Data Siswa berjalan. Gunakan endpoint /api/siswa");
});

app.get("/api/siswa", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post("/api/siswa", async (req, res) => {
  const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;
  try {
    await db.query("INSERT INTO siswa VALUES (?,?,?,?,?)",
      [kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa]);
    res.status(201).json({ message: "Data berhasil ditambah" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.put("/api/siswa/:kode", async (req, res) => {
  const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;
  try {
    await db.query(
      "UPDATE siswa SET nama_siswa=?, alamat_siswa=?, tgl_siswa=?, jurusan_siswa=? WHERE kode_siswa=?",
      [nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, req.params.kode]);
    res.json({ message: "Data berhasil diubah" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/api/siswa/:kode", async (req, res) => {
  try {
    await db.query("DELETE FROM siswa WHERE kode_siswa=?", [req.params.kode]);
    res.json({ message: "Data berhasil dihapus" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.listen(3000, () => console.log("Backend jalan di http://localhost:3000"));