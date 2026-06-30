export const lecturerGuide = {
  title: "Panduan Lengkap Dosen / Pengajar",
  subtitle: "PragmaticsAI — Platform Etika Komunikasi Digital",
  sections: [
    {
      id: "akses",
      title: "Cara Mengakses Platform",
      icon: "Globe",
      color: "from-cyan-500 to-teal-600",
      description: "Langkah awal untuk mengakses PragmaticsAI sebagai dosen/pengajar.",
      steps: [
        { title: "Buka Halaman Utama", detail: "Akses website PragmaticsAI melalui browser." },
        { title: "Klik Tombol 'Masuk'", detail: "Tekan tombol 'Masuk' di pojok kanan atas navbar." },
        { title: "Login dengan Akun", detail: "Masukkan email dan kata sandi yang telah didaftarkan." },
        { title: "Pilih Peran: Dosen / Pengajar", detail: "Pada halaman Profile Setup, pilih kartu 'Dosen / Pengajar'. Sistem akan membuat profil dosen dan mengarahkan ke Dasbor Dosen." },
      ],
      tips: ["Pastikan email yang digunakan terdaftar sebagai dosen.", "Hubungi admin sistem jika perlu diundang sebagai dosen."]
    },
    {
      id: "dosen-dashboard",
      title: "Dasbor Dosen",
      icon: "LayoutDashboard",
      color: "from-cyan-500 to-blue-600",
      description: "Pusat monitoring perkembangan mahasiswa dan performa kelas.",
      steps: [
        { title: "Lihat Overview Kelas", detail: "Dasbor menampilkan ringkasan kelas yang Anda ampu, termasuk jumlah mahasiswa dan metrik agregat." },
        { title: "Pilih Kelas", detail: "Gunakan class selector untuk memilih kelas yang ingin dipantau." },
        { title: "Pantau Performa Agregat", detail: "Lihat skor rata-rata kelas: kompetensi pragmatik, kesantunan, dan toksisitas." },
        { title: "Cek Kalender Kelas", detail: "Kalender menampilkan jadwal sesi, tugas, ujian, dan pengumuman kelas Anda." },
        { title: "Daftar Mahasiswa", detail: "Lihat daftar mahasiswa dengan status kompetensi, XP, level, dan badge. Filter dan cari mahasiswa tertentu." },
        { title: "Deep-Dive per Mahasiswa", detail: "Klik nama mahasiswa untuk melihat radar chart kompetensi dan catatan feedback." },
        { title: "Tulis Catatan Feedback", detail: "Berikan catatan personal untuk setiap mahasiswa yang tersimpan dan dapat dilihat kembali." },
      ],
      tips: ["Gunakan radar chart mahasiswa untuk identify area yang perlu intervensi.", "Catatan feedback membantu tracking perkembangan individu."]
    },
    {
      id: "class-management",
      title: "Manajemen Kelas",
      icon: "BookMarked",
      color: "from-emerald-500 to-teal-600",
      description: "Membuat, mengedit, dan mengelola kelas beserta kode akses.",
      steps: [
        { title: "Buka 'Manajemen Kelas'", detail: "Klik menu 'Manajemen Kelas' di sidebar grup Administrasi." },
        { title: "Buat Kelas Baru", detail: "Klik tombol 'Buat Kelas' untuk membuka form pendaftaran kelas baru." },
        { title: "Isi Detail Kelas", detail: "Lengkapi: nama kelas (Kelas A/B), mata kuliah, semester (Ganjil/Genap), tahun ajaran, jadwal, ruangan, dan deskripsi." },
        { title: "Generate Kode Akses", detail: "Sistem otomatis generate kode unik 6 karakter untuk kelas Anda. Bagikan kode ini kepada mahasiswa." },
        { title: "Salin Kode", detail: "Gunakan tombol copy untuk menyalin kode kelas dan membagikannya kepada mahasiswa." },
        { title: "Edit / Hapus Kelas", detail: "Klik kelas untuk mengedit detail atau menghapus kelas yang tidak lagi aktif." },
      ],
      tips: ["Kode kelas bersifat unik — mahasiswa menggunakan kode ini untuk bergabung.", "Atur max_students untuk membatasi jumlah pendaftar."]
    },
    {
      id: "class-detail",
      title: "Detail Kelas & Enroll Mahasiswa",
      icon: "Users",
      color: "from-blue-500 to-cyan-600",
      description: "Mengelola pendaftaran mahasiswa dan melihat detail kelas.",
      steps: [
        { title: "Buka Detail Kelas", detail: "Klik kelas di Manajemen Kelas untuk membuka panel detail." },
        { title: "Lihat Statistik Kelas", detail: "Panel menampilkan jumlah mahasiswa terdaftar, kapasitas, dan statistik kelas." },
        { title: "Enroll Mahasiswa Manual", detail: "Tambahkan mahasiswa secara manual dengan memasukkan email mereka di form enrollment." },
        { title: "Hapus Mahasiswa", detail: "Hapus mahasiswa dari kelas jika diperlukan (misal: drop kelas)." },
        { title: "Bagikan Kode Kelas", detail: "Tampilkan dan bagikan kode akses kelas kepada mahasiswa." },
      ],
      tips: ["Mahasiswa juga bisa self-enroll menggunakan kode kelas di menu 'Bergabung Kelas'."]
    },
    {
      id: "analytics",
      title: "Analitik Kelas",
      icon: "BarChart3",
      color: "from-indigo-500 to-violet-600",
      description: "Dashboard analitik mendalam untuk performa kelas dan mahasiswa.",
      steps: [
        { title: "Buka 'Analitik Kelas'", detail: "Klik menu 'Analitik Kelas' di sidebar grup Administrasi." },
        { title: "Pilih Kelas", detail: "Pilih kelas yang ingin dianalisis dari dropdown." },
        { title: "Lihat Tabel Mahasiswa", detail: "Tabel analitik menampilkan data per mahasiswa: skor kompetensi, XP, level, jumlah interaksi AI, dan refleksi." },
        { title: "Analisis Tren", detail: "Grafik menampilkan tren perkembangan kelas dari waktu ke waktu." },
        { title: "Identifikasi Mahasiswa yang Perlu Intervensi", detail: "Gunakan data untuk identify mahasiswa dengan skor rendah yang membutuhkan bimbingan." },
      ],
      tips: ["Data analitik terhubung dengan sistem scoring AI — setiap interaksi mahasiswa tercatat."]
    },
    {
      id: "pdf-report",
      title: "Laporan PDF",
      icon: "FileText",
      color: "from-rose-500 to-red-600",
      description: "Generate laporan PDF profesional untuk institusi dan dokumentasi.",
      steps: [
        { title: "Buka 'Laporan PDF'", detail: "Klik menu 'Laporan PDF' di sidebar grup Administrasi." },
        { title: "Pilih Kelas", detail: "Pilih kelas yang ingin dibuatkan laporannya." },
        { title: "Pilih Mahasiswa", detail: "Centang mahasiswa yang ingin dimasukkan dalam laporan, atau pilih semua." },
        { title: "Generate PDF", detail: "Klik tombol download untuk generate PDF profesional." },
        { title: "Isi Laporan PDF", detail: "PDF berisi: cover berwarna, ringkasan kelas, grafik radar kompetensi, grafik bar, dan data skor lengkap per mahasiswa dengan mini progress bar." },
        { title: "Download & Distribusi", detail: "File PDF siap diunduh dan didistribusikan ke institusi atau untuk arsip." },
      ],
      tips: ["Laporan cocok untuk pelaporan institusional dan evaluasi semester.", "Pilih hanya mahasiswa yang relevan untuk laporan yang lebih fokus."]
    },
    {
      id: "chat",
      title: "Chat Kelas",
      icon: "Hash",
      color: "from-cyan-500 to-teal-600",
      description: "Berinteraksi real-time dengan mahasiswa dalam ruang chat kelas.",
      steps: [
        { title: "Buka 'Chat Kelas'", detail: "Klik menu 'Chat Kelas' di sidebar grup Kolaborasi." },
        { title: "Pilih Kelas", detail: "Pilih kelas yang ingin Anda buka ruang chat-nya." },
        { title: "Kirim Pesan", detail: "Ketik dan kirim pesan ke kelas. Pesan Anda memiliki badge 'Dosen'." },
        { title: "Sistem Kesantunan Aktif", detail: "Sama seperti mahasiswa, AI menganalisis tingkat kesantunan pesan Anda secara real-time." },
        { title: "Moderasi Pesan", detail: "Pesan toksis dari mahasiswa akan ditandai dan dapat ditinjau untuk tindak lanjut." },
      ],
      tips: ["Gunakan chat untuk pengumuman cepat dan Q&A informal.", "Pesan dosen menjadi role model kesantunan bagi mahasiswa."]
    },
    {
      id: "etnography-forum",
      title: "Forum Etnografi",
      icon: "BookOpen",
      color: "from-indigo-500 to-purple-600",
      description: "Memoderasi dan berpartisipasi dalam forum etnografi kelas.",
      steps: [
        { title: "Buka 'Forum Etnografi'", detail: "Klik menu 'Forum Etnografi' di sidebar grup Kolaborasi." },
        { title: "Buat Postingan", detail: "Bagikan temuan, pandangan akademik, atau instruksi untuk mahasiswa." },
        { title: "Balas Diskusi Mahasiswa", detail: "Tanggapi postingan mahasiswa — balasan dosen memiliki badge khusus yang menonjol." },
        { title: "Pin Postingan Penting", detail: "Pin postingan yang penting agar muncul di urutan teratas untuk seluruh kelas." },
        { title: "Moderasi Konten", detail: "Pantau konten yang ditandai dan lakukan moderasi jika diperlukan." },
      ],
      tips: ["Balasan dosen di forum sangat memotivasi mahasiswa untuk berdiskusi lebih aktif."]
    },
    {
      id: "institution",
      title: "Manajemen Institusi (Admin)",
      icon: "Building2",
      color: "from-slate-500 to-slate-700",
      description: "Mengelola data institusi, fakultas, dan program studi (khusus admin).",
      steps: [
        { title: "Buka 'Manajemen Institusi'", detail: "Klik menu 'Manajemen Institusi' di sidebar grup Administrasi (hanya untuk admin)." },
        { title: "Kelola Institusi", detail: "Tambah/edit data universitas: nama, kode, logo, alamat, dan domain email." },
        { title: "Kelola Fakultas", detail: "Tambah/edit fakultas beserta nama dekan dan kode fakultas." },
        { title: "Kelola Program Studi", detail: "Tambah/edit program studi dengan jenjang (D3/S1/S2/S3)." },
      ],
      tips: ["Data institusi menjadi fondasi untuk manajemen kelas dan enrollmen.", "Hanya admin yang dapat mengelola data institusi."]
    },
    {
      id: "admin-panel",
      title: "Admin Panel (Super Admin)",
      icon: "Shield",
      color: "from-rose-500 to-red-600",
      description: "Kontrol penuh platform untuk super admin.",
      steps: [
        { title: "Buka 'Admin Panel'", detail: "Klik menu 'Admin Panel' di sidebar (hanya untuk super admin: gedepurwana@gmail.com)." },
        { title: "Intelligence Overview", detail: "Lihat KPI real-time: total pengguna, institusi, kelas, dan analitik platform." },
        { title: "Kelola Kelas", detail: "Kelola semua kelas, dosen, dan enrollmen mahasiswa di seluruh platform." },
        { title: "User Management", detail: "Kelola pengguna, enrollmen, dan profil dosen." },
        { title: "AI Governance", detail: "Kontrol sistem AI: personality traits, communication constraints, sensitivity thresholds, dan system prompts." },
        { title: "Content Moderation", detail: "Review konten terflag: AI chat logs, forum posts, dan replies. Tandai aman atau hapus." },
        { title: "Research Center", detail: "Export data dan analitik penelitian longitudinal." },
        { title: "System Logs", detail: "Monitor aktivitas sistem dan log operasional." },
        { title: "Preview Mode", detail: "Gunakan tombol preview untuk melihat platform dari perspektif mahasiswa atau dosen." },
      ],
      tips: ["AI Governance memungkinkan fine-tuning behavior AI di seluruh platform.", "Gunakan Preview Mode untuk memvalidasi perubahan dari sudut pandang pengguna."]
    },
    {
      id: "settings",
      title: "Notifikasi & Pengaturan",
      icon: "Bell",
      color: "from-slate-500 to-gray-600",
      description: "Kelola notifikasi dan pengaturan akun dosen.",
      steps: [
        { title: "Cek Notifikasi", detail: "Buka menu 'Notifikasi' untuk melihat pengumuman sistem dan aktivitas kelas." },
        { title: "Buka Pengaturan", detail: "Kelola profil dosen, preferensi tampilan, dan opsi notifikasi." },
      ],
      tips: ["Periksa notifikasi secara berkasa untuk update penting dari sistem."]
    },
  ]
};