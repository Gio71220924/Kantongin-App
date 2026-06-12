# Kantongin

> Semua kantong uangmu, satu aplikasi.

Kantongin adalah aplikasi pelacak keuangan personal untuk pengguna Indonesia. Dirancang untuk orang yang menyimpan uang di banyak tempat — rekening bank, e-wallet, dompet tunai — dan ingin melihat posisi keuangan mereka secara menyeluruh tanpa kerumitan.

**Prinsip utama:** transfer antar kantong sendiri bukan pengeluaran. Kantongin membedakan ini secara konsisten di setiap layar.

---

## Fitur

### Dasbor

Layar utama yang menampilkan gambaran keuangan hari ini secara sekilas:

- **Total saldo** dari seluruh kantong, dengan tombol sembunyikan angka
- **Ringkasan bulan ini** — pemasukan, pengeluaran, dan transfer dalam tiga tile terpisah
- **Grafik donut** pengeluaran per kategori bulan berjalan
- **Kartu kantong** horizontal scrollable dengan saldo masing-masing rekening
- **5 transaksi terbaru** langsung di bawah tanpa harus buka tab lain

### Tambah Transaksi

Form pencatatan dengan tiga jenis transaksi:

- **Pemasukan** — pilih kantong tujuan dan kategori (Gaji, Freelance, Hadiah, dll.)
- **Pengeluaran** — pilih kantong sumber dan kategori (Makan, Transport, Belanja, dll.)
- **Transfer** — pilih kantong asal dan tujuan; otomatis tidak dihitung sebagai pengeluaran
- Pilihan tanggal dengan navigasi hari (bukan hanya "hari ini")
- Kolom catatan opsional
- Tambah kantong baru langsung dari form tanpa keluar halaman

### Riwayat

Seluruh catatan transaksi dalam satu daftar:

- Transfer ditampilkan dengan warna dan ikon tersendiri (ungu, ikon ⇄) — tidak tercampur dengan pengeluaran
- Tap transaksi untuk melihat detail lengkap

### Detail Transaksi

Halaman penuh per transaksi:

- Tampilkan semua informasi: nominal, jenis, kantong, kategori, tanggal, catatan
- **Edit** — ubah nominal, kategori, tanggal, catatan
- **Hapus** transaksi dengan konfirmasi

### Analitik

Laporan visual keuangan per bulan:

- Pilih bulan dari chip horizontal di bagian atas
- **Pengeluaran per kategori** dengan donut chart dan daftar bar
- **Pengeluaran per kantong** — lihat rekening mana yang paling banyak dipakai
- **Tren bulanan** — grafik garis pengeluaran vs transfer beberapa bulan terakhir
- **Kotak transfer** tersendiri yang menjelaskan total dana yang dipindahkan — tidak masuk total pengeluaran

### Anggaran

Kelola batas pengeluaran per kategori:

- Set anggaran bulanan per kategori
- Lihat persentase pemakaian secara visual

### Pengaturan

- **Tampilan** — pilih tema Terang, Gelap, atau ikuti sistem
- **Daftar kantong** — lihat semua rekening yang aktif
- **Ekspor data** — CSV / PDF
- **Mode tamu** — gunakan app tanpa akun, data tetap tersimpan di perangkat

### Onboarding

Alur pertama kali buka app:

- Tiga slide perkenalan fitur utama
- Daftar akun atau lanjut sebagai tamu
- **Buat kantong sendiri** — ketik nama rekening dan masukkan saldo awal; tidak ada daftar pilihan yang dipaksakan
- Total saldo awal langsung terhitung saat menambah kantong

### Keamanan

- **Face ID / biometrik** — app terkunci otomatis saat masuk background, buka kunci saat kembali aktif
- **Encrypted storage** — semua data disimpan di iOS Keychain via SecureStore, bukan penyimpanan biasa
- Data tetap ada meski app ditutup; hilang hanya jika Expo Go di-uninstall

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org) v18 atau lebih baru
- [Expo Go](https://expo.dev/go) terinstal di iPhone atau Android

### Langkah

```bash
# 1. Clone repo
git clone https://github.com/Gio71220924/Kantongin-App.git
cd Kantongin-App

# 2. Install dependensi
npm install

# 3. Jalankan dev server
npx expo start
```

Setelah server jalan, **scan QR code** yang muncul di terminal menggunakan:

- **iPhone** — kamera bawaan atau app Expo Go
- **Android** — app Expo Go langsung

App akan terbuka di perangkat. Setiap perubahan kode langsung ter-refresh otomatis.

### Preview di browser (opsional)

```bash
npm run web
```

Buka `http://localhost:8081` untuk cek tampilan cepat tanpa perangkat fisik.

---

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Framework | Expo SDK 56, React Native 0.85 |
| Routing | expo-router (file-based) |
| Bahasa | TypeScript |
| Font | Plus Jakarta Sans (400–800) |
| Grafik & ikon | react-native-svg |
| Keamanan | expo-local-authentication, expo-secure-store |
| Gradien | expo-linear-gradient |
| Desain | Modern Fintech Design Guidelines v1.0 |

---

## Lisensi

Proyek ini dibuat untuk keperluan pribadi dan akademis.
