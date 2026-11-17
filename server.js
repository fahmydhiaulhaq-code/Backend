const express = require("express");
const cors = require("cors");
const { pool, initDb } = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Halaman utama (supaya localhost:3000 tidak "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend Data Siswa berjalan. Gunakan endpoint /api/siswa");
});

// READ - semua data
app.get("/api/siswa", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM siswa ORDER BY kode_siswa");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// READ - satu data
app.get("/api/siswa/:kode", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM siswa WHERE kode_siswa=?", [req.params.kode]);
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// CREATE
app.post("/api/siswa", async (req, res) => {
  const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;
  if (!kode_siswa || !nama_siswa) {
    return res.status(400).json({ message: "Kode dan nama siswa wajib diisi" });
  }
  try {
    await pool.query(
      "INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) VALUES (?,?,?,?,?)",
      [kode_siswa, nama_siswa, alamat_siswa || null, tgl_siswa || null, jurusan_siswa || null]
    );
    res.status(201).json({ message: "Data berhasil ditambah" });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Kode siswa sudah dipakai" });
    }
    res.status(500).json({ message: e.message });
  }
});

// UPDATE
app.put("/api/siswa/:kode", async (req, res) => {
  const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE siswa SET nama_siswa=?, alamat_siswa=?, tgl_siswa=?, jurusan_siswa=? WHERE kode_siswa=?",
      [nama_siswa, alamat_siswa || null, tgl_siswa || null, jurusan_siswa || null, req.params.kode]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil diubah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE
app.delete("/api/siswa/:kode", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM siswa WHERE kode_siswa=?", [req.params.kode]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Siapkan database dulu, baru jalankan server
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend jalan di http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Gagal terhubung ke MySQL:", e.message);
    console.error("Pastikan MySQL sudah di-Start di XAMPP dan user/password di db.js benar.");
    process.exit(1);
  });
