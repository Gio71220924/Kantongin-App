# Kantongin

<p align="center">
  <img src="assets/images/icon.png" width="120" alt="Kantongin logo" />
</p>

<p align="center"><strong>Semua kantong uangmu, satu aplikasi 📲</strong></p>

> Kantongin membantu pengguna Indonesia melacak saldo dan arus kas di **semua** kantong—rekening bank, e‑wallet, hingga dompet tunai—dalam satu tampilan terpadu. Transfer antar kantong sendiri **tidak** dihitung pengeluaran; prinsip ini terjaga konsisten di setiap layar.

---

## 🗂️ Table of Contents

1. [Fitur](#-fitur)
2. [Tangkapan Layar](#-tangkapan-layar)
3. [Cara Instalasi & Menjalankan](#-cara-instalasi--menjalankan)
4. [Teknologi](#-teknologi)
5. [Keamanan & Privasi](#-keamanan--privasi)
6. [Lisensi](#-lisensi)

---

## ✨ Fitur

<details open>
<summary><strong>Dasbor</strong></summary>

* **Total Saldo** seluruh kantong, dengan tombol *hide* angka.
* **Ringkasan Bulanan** — pemasukan, pengeluaran, transfer.
* **Donut Chart** pengeluaran per kategori (bulan berjalan).
* **Kartu Kantong** bergulir horizontal dengan saldo tiap rekening.
* **5 Transaksi Terbaru** di bagian bawah.

</details>

<details>
<summary><strong>Tambah Transaksi</strong></summary>

* Tipe *Income*, *Expense*, dan *Transfer* (tidak dihitung pengeluaran).
* Pilih kantong & kategori; tanggal bisa diatur mundur/maju.
* Kolom catatan opsional & tambah kantong baru tanpa keluar form.

</details>

<details>
<summary><strong>Riwayat & Detail Transaksi</strong></summary>

* Daftar transaksi lengkap dengan warna/ikon khusus untuk transfer (⇄ ungu).
* Ketuk transaksi untuk melihat, mengedit, atau menghapus.

</details>

<details>
<summary><strong>Analitik</strong></summary>

* Filter bulan via chip.
* Donut pengeluaran per kategori & per kantong.
* Grafik tren pengeluaran vs transfer.
* Kotak ringkasan transfer terpisah dari total pengeluaran.

</details>

<details>
<summary><strong>Anggaran</strong></summary>

* Tetapkan limit per kategori dan pantau % penggunaan.

</details>

<details>
<summary><strong>Pengaturan</strong></summary>

* Tema Terang / Gelap / Ikuti Sistem.
* Daftar kantong aktif.
* Ekspor data ke CSV/PDF.
* *Guest Mode* — pakai tanpa akun, data lokal.

</details>

<details>
<summary><strong>Onboarding</strong></summary>

* 3 slide pengantar, daftar / tamu.
* Buat kantong awal dengan saldo awal otomatis tersimpan.

</details>

---

## 📸 Tangkapan Layar

> *(Akan ditambahkan)* — tampilkan mock‑up dasbor, form transaksi, dan analitik.

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat

* [Node.js](https://nodejs.org) ≥ v18
* [Expo Go](https://expo.dev/go) di iOS/Android

### Langkah Cepat

```bash
# 1. Klon repositori
$ git clone https://github.com/Gio71220924/Kantongin-App.git
$ cd Kantongin-App

# 2. Instal dependensi
$ npm install

# 3. Jalankan dev‑server
$ npx expo start
```

> Pindai **QR Code** di terminal memakai kamera (iOS) atau aplikasi Expo Go (Android).

#### Jalankan di Browser (Opsional)

```bash
$ npm run web
```

Buka `http://localhost:8081` untuk pratinjau cepat.

---

## 🛠️ Teknologi

| Lapisan   | Teknologi                                        |
| --------- | ------------------------------------------------ |
| Framework | Expo SDK 56 · React Native 0.85                  |
| Routing   | `expo-router` (file‑based)                       |
| Bahasa    | TypeScript                                       |
| Font      | Plus Jakarta Sans 400‑800                        |
| Grafik    | `react-native-svg`                               |
| Gradien   | `expo-linear-gradient`                           |
| Keamanan  | `expo-local-authentication`, `expo-secure-store` |

---

## 🔒 Keamanan & Privasi

* **Biometrik**: aplikasi terkunci otomatis saat masuk background dan dibuka dengan Face ID / sidik jari.
* **Penyimpanan terenkripsi**: semua data lokal disimpan lewat SecureStore (Keychain/Keystore).
* Data tetap ada jika aplikasi ditutup; hilang hanya ketika pengguna menghapus aplikasi.

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran & penggunaan pribadi. Silakan pakai atau fork dengan mencantumkan atribusi.
