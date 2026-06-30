import { guideOverview } from './guideOverview';

export const studentGuide = {
  title: "Panduan Lengkap Mahasiswa",
  subtitle: "PragmaticsAI — Platform Etika Komunikasi Digital",
  overview: guideOverview,
  sections: [
    {
      id: "akses",
      title: "Cara Mengakses Platform",
      icon: "Globe",
      color: "from-indigo-500 to-violet-600",
      description: "Langkah awal untuk mengakses PragmaticsAI sebagai mahasiswa.",
      steps: [
        { title: "Buka Halaman Utama", detail: "Akses website PragmaticsAI melalui browser. Anda akan melihat halaman landing dengan informasi fitur platform." },
        { title: "Klik Tombol 'Masuk'", detail: "Tekan tombol 'Masuk' di pojok kanan atas navbar. Anda akan diarahkan ke halaman login." },
        { title: "Login dengan Akun", detail: "Masukkan email dan kata sandi yang telah didaftarkan, atau gunakan login Google jika tersedia." },
        { title: "Pilih Peran: Mahasiswa", detail: "Pada halaman Profile Setup, pilih kartu 'Mahasiswa'. Sistem akan membuat profil mahasiswa Anda dan mengarahkan ke Dashboard." },
      ],
      tips: ["Pastikan menggunakan email yang terdaftar.", "Jika lupa kata sandi, gunakan fitur reset password di halaman login."]
    },
    {
      id: "dashboard",
      title: "Dashboard Mahasiswa",
      icon: "LayoutDashboard",
      color: "from-indigo-500 to-blue-600",
      description: "Pusat kendali utama untuk memantau progres belajar, XP, dan pencapaian.",
      steps: [
        { title: "Lihat Ringkasan Progres", detail: "Dashboard menampilkan greeting personal, skor kompetensi pragmatik terkini, dan ringkasan aktivitas belajar." },
        { title: "Pantau 7 Fase Etnografi", detail: "Tahapan pembelajaran: (1) Orientasi Etnografi, (2) Identifikasi Masalah, (3) Pengumpulan Data, (4) Analisis Pragmatik, (5) Refleksi Kritis, (6) Sintesis Kultural, (7) Transformasi Etis." },
        { title: "Cek XP & Level", detail: "Panel gamifikasi menampilkan total XP, level (Pemula → Master), streak harian, dan lencana yang diraih." },
        { title: "Lihat Leaderboard Kelas", detail: "Papan peringkat menampilkan posisi Anda dibandingkan teman sekelas berdasarkan XP dan skor kompetensi." },
        { title: "Cek Jadwal Kelas", detail: "Kalender kelas menampilkan jadwal sesi, tugas, ujian, dan pengumuman dari dosen." },
      ],
      tips: ["Buka dashboard setiap hari untuk menjaga streak harian.", "Klik kartu fase etnografi untuk melihat detail setiap tahapan."]
    },
    {
      id: "join-class",
      title: "Bergabung ke Kelas",
      icon: "Key",
      color: "from-emerald-500 to-teal-600",
      description: "Cara mendaftar ke kelas menggunakan kode akses dari dosen.",
      steps: [
        { title: "Buka Menu 'Bergabung Kelas'", detail: "Di sidebar, klik menu 'Bergabung Kelas' di grup Administrasi." },
        { title: "Masukkan Kode Kelas", detail: "Ketik kode 6 karakter yang diberikan dosen Anda (contoh: ABC123) di kolom input." },
        { title: "Klik 'Bergabung ke Kelas'", detail: "Sistem akan mencari kelas dan mendaftarkan Anda secara otomatis." },
        { title: "Lihat Kelas Saya", detail: "Panel 'Kelas Saya' menampilkan semua kelas yang telah Anda ikuti beserta statusnya." },
      ],
      tips: ["Kode kelas bersifat case-sensitive — gunakan huruf besar.", "Jika kode tidak ditemukan, hubungi dosen untuk memastikan kode benar."]
    },
    {
      id: "modul",
      title: "Modul Pembelajaran & Belajar Adaptif",
      icon: "BookOpen",
      color: "from-blue-500 to-cyan-600",
      description: "Materi terstruktur dan rekomendasi pembelajaran yang dipersonalisasi AI.",
      steps: [
        { title: "Buka 'Modul Saya'", detail: "Akses daftar modul pembelajaran yang dikategorikan: Pragmatik Dasar, Kesantunan, Speech Acts, Implikatur, Etika Digital, Komunikasi Toksis, dan Etnografi Digital." },
        { title: "Pelajari Konten Modul", detail: "Setiap modul berisi materi dalam format teks/HTML, estimasi durasi, dan tingkat kesulitan (Pemula/Menengah/Lanjutan)." },
        { title: "Gunakan 'Belajar Adaptif'", detail: "Sistem AI memberikan rekomendasi modul, kasus, dan latihan berdasarkan skor kompetensi Anda yang masih lemah." },
        { title: "Selesaikan Modul Berurutan", detail: "Modul dirancang berurutan — selesaikan modul dasar sebelum melanjutkan ke modul lanjutan." },
      ],
      tips: ["Rekomendasi adaptif diperbarui otomatis setelah setiap interaksi AI.", "Modul yang selesai memberikan XP tambahan."]
    },
    {
      id: "ai-analyzer",
      title: "Asisten AI Pragmatik (AI Analyzer)",
      icon: "Bot",
      color: "from-violet-500 to-purple-600",
      description: "Analisis teks komunikasi digital dengan AI untuk mendeteksi tingkat kesantunan dan etika.",
      steps: [
        { title: "Buka 'Asisten AI'", detail: "Klik menu 'Asisten AI' di sidebar grup Belajar." },
        { title: "Masukkan Teks Komunikasi", detail: "Tempel atau ketik teks pesan/komentar media sosial yang ingin Anda analisis." },
        { title: "Jalankan Analisis AI", detail: "AI akan menganalisis: skor kesantunan (0-100), tingkat toksisitas, jenis speech act, implikatur, dan sensitivitas budaya." },
        { title: "Baca Hasil & Saran", detail: "AI memberikan skor multi-dimensi, label kesantunan (Sangat Santun → Tidak Santun), dan saran perbaikan jika kurang santun." },
        { title: "Simpan Riwayat", detail: "Setiap analisis tersimpan dan berkontribusi pada skor kompetensi pragmatik Anda." },
      ],
      tips: ["Gunakan teks asli dari media sosial untuk analisis yang lebih realistis.", "Skor kesantunan mempengaruhi leaderboard kelas."]
    },
    {
      id: "social-lab",
      title: "Lab Media Sosial",
      icon: "FlaskConical",
      color: "from-cyan-500 to-blue-600",
      description: "Eksperimen analisis kasus komunikasi di berbagai platform media sosial.",
      steps: [
        { title: "Buka 'Lab Media Sosial'", detail: "Akses lab eksperimen di sidebar grup Belajar." },
        { title: "Pilih Platform", detail: "Pilih platform media sosial (Instagram, Twitter, TikTok, WhatsApp, Facebook, Forum Online) untuk analisis kasus." },
        { title: "Analisis Kasus Komunikasi", detail: "Pelajari pola komunikasi, deteksi speech act, dan identifikasi tingkat kesantunan/toksisitas pada kasus yang disediakan." },
        { title: "Bandingkan Hasil", detail: "Bandingkan analisis AI dengan pemahaman Anda untuk membangun intuisi pragmatik." },
      ],
      tips: ["Setiap kasus yang dianalisis menambah XP dan memperkaya profil kompetensi."]
    },
    {
      id: "tutor-roleplay",
      title: "AI Pragmatics Tutor & Virtual Roleplay Lab",
      icon: "Mic",
      color: "from-amber-500 to-orange-600",
      description: "Latihan percakapan interaktif dengan AI dan simulasi skenario komunikasi.",
      steps: [
        { title: "AI Pragmatics Tutor", detail: "Mulai sesi tanya-jawab dengan AI Tutor yang membimbing Anda memahami konsep pragmatik secara interaktif." },
        { title: "Virtual Roleplay Lab", detail: "Pilih skenario roleplay (santun, kurang santun, toksis, ambigu) dan berlatih merespons dalam berbagai konteks budaya." },
        { title: "Terima Feedback Real-Time", detail: "AI mengevaluasi respons Anda dan memberikan skor serta saran perbaikan secara langsung." },
        { title: "Ulangi Skenario", detail: "Coba berbagai pendekatan komunikasi untuk skenario yang sama dan bandingkan hasilnya." },
      ],
      tips: ["Roleplay lab mendukung konteks budaya Tolaki, Buton, Muna, dan Mekongga."]
    },
    {
      id: "journal",
      title: "Jurnal Reflektif",
      icon: "PenLine",
      color: "from-rose-500 to-pink-600",
      description: "Tuliskan refleksi mendalam tentang pembelajaran pragmatik dan pengalaman komunikasi digital.",
      steps: [
        { title: "Buka 'Jurnal Reflektif'", detail: "Akses jurnal di sidebar grup Belajar." },
        { title: "Tulis Entri Baru", detail: "Buat entri jurnal tentang pengalaman, observasi, atau refleksi terkait etika komunikasi digital." },
        { title: "Hubungkan dengan Teori", detail: "Kaitkan pengalaman Anda dengan konsep pragmatik, speech acts, atau kearifan budaya yang dipelajari." },
        { title: "Simpan & Tinjau", detail: "Entri tersimpan dengan tanggal dan dapat ditinjau kembali kapan saja untuk melacak perkembangan pemikiran." },
      ],
      tips: ["Jurnal reflektif yang bermutu meningkatkan skor 'Refleksi Kritis' pada fase etnografi ke-5."]
    },
    {
      id: "etnografi",
      title: "Perpustakaan Etnografi & Kasus",
      icon: "Database",
      color: "from-teal-500 to-emerald-600",
      description: "Kumpulan kasus etnografi digital dan studi komunikasi lintas budaya.",
      steps: [
        { title: "Buka 'Perpustakaan Etnografi'", detail: "Akses koleksi kasus etnografi di sidebar grup Belajar." },
        { title: "Jelajahi Kasus", detail: "Pelajari kasus berdasarkan platform, jenis komunikasi (santun/toksis/ambigu), jenis speech act, dan konteks budaya." },
        { title: "Baca Analisis Pragmatik", detail: "Setiap kasus dilengkapi analisis pragmatik yang menjelaskan dinamika komunikasi secara mendalam." },
        { title: "Gunakan sebagai Referensi", detail: "Kasus dapat menjadi referensi untuk tugas, forum diskusi, dan jurnal reflektif Anda." },
      ],
      tips: ["Filter kasus berdasarkan kategori untuk menemukan materi yang relevan."]
    },
    {
      id: "cultural-case",
      title: "Latihan Kasus Budaya",
      icon: "Swords",
      color: "from-orange-500 to-red-600",
      description: "Latihan dilema etika komunikasi dalam konteks budaya lokal.",
      steps: [
        { title: "Buka 'Latihan Kasus Budaya'", detail: "Akses latihan dilema etika di sidebar grup Belajar." },
        { title: "Pilih Latihan", detail: "Pilih berdasarkan budaya (Tolaki, Buton, Muna, Mekongga, Umum) dan tingkat kesulitan (Mudah/Sedang/Sulit)." },
        { title: "Baca Skenario Dilema", detail: "Pelajari narasi skenario dilema etika komunikasi beserta konteks budaya dan sosialnya." },
        { title: "Pilih Respons Terbaik", detail: "Dari pilihan A/B/C/D, pilih respons yang paling sesuai dengan nilai kearifan lokal." },
        { title: "Baca Penjelasan & Wisdom", detail: "Sistem menampilkan jawaban benar, penjelasan, dan nilai kearifan budaya yang relevan." },
      ],
      tips: ["Jawaban benar memberikan XP reward (default 50 XP).", "AI juga memberikan feedback dan skor untuk kualitas pilihan Anda."]
    },
    {
      id: "cultural-tour",
      title: "Wisata Budaya Pragmatik",
      icon: "Globe",
      color: "from-purple-500 to-indigo-600",
      description: "Eksplorasi interaktif kearifan budaya dan norma komunikasi lintas daerah.",
      steps: [
        { title: "Buka 'Wisata Budaya Pragmatik'", detail: "Akses modul wisata budaya di sidebar grup Belajar." },
        { title: "Pilih Daerah Budaya", detail: "Jelajahi kearifan komunikasi dari berbagai budaya lokal (Tolaki, Buton, Muna, Mekongga)." },
        { title: "Pelajari Norma Komunikasi", detail: "Pahami norma kesantunan, tabu, dan strategi komunikasi yang berlaku di setiap budaya." },
      ],
      tips: ["Pemahaman budaya meningkatkan skor 'Sensitivitas Budaya' pada kompetensi pragmatik."]
    },
    {
      id: "chat",
      title: "Chat Kelas (Real-Time)",
      icon: "Hash",
      color: "from-cyan-500 to-teal-600",
      description: "Berkomunikasi real-time dengan dosen dan teman sekelas dengan analisis kesantunan otomatis.",
      steps: [
        { title: "Buka 'Chat Kelas'", detail: "Klik menu 'Chat Kelas' di sidebar grup Kolaborasi." },
        { title: "Pilih Kelas", detail: "Pilih kelas yang ingin Anda buka dari daftar kelas yang tersedia." },
        { title: "Ketik Pesan", detail: "Sambil mengetik, AI menganalisis tingkat kesantunan pesan Anda secara real-time (debounce 800ms)." },
        { title: "Perhatikan Indikator Warna", detail: "Hijau = Sangat Santun/Santun, Kuning = Netral, Oranye = Kurang Santun, Merah = Tidak Santun." },
        { title: "Baca Saran AI", detail: "Jika pesan kurang santun, AI menampilkan saran perbaikan sebelum Anda mengirim." },
        { title: "Kirim Pesan", detail: "Setelah yakin dengan tingkat kesantunan, kirim pesan ke ruang chat kelas." },
      ],
      tips: ["Pesan dengan skor kesantunan tinggi berkontribusi positif pada skor kompetensi.", "Pesan toksis akan ditandai dan dapat ditinjau oleh dosen/admin."]
    },
    {
      id: "etnography-forum",
      title: "Forum Etnografi",
      icon: "BookOpen",
      color: "from-indigo-500 to-purple-600",
      description: "Bagikan temuan etnografi digital dan berdiskusi dengan teman sekelas.",
      steps: [
        { title: "Buka 'Forum Etnografi'", detail: "Klik menu 'Forum Etnografi' di sidebar grup Kolaborasi." },
        { title: "Buat Postingan Baru", detail: "Bagikan temuan etnografi: judul, konten analisis, platform sumber, dan tags relevan." },
        { title: "Filter & Jelajahi", detail: "Filter postingan berdasarkan kelas atau platform media sosial." },
        { title: "Upvote Postingan", detail: "Berikan upvote pada postingan yang menarik atau bermanfaat." },
        { title: "Balas Diskusi", detail: "Tanggapi postingan teman dengan balasan. Balasan dosen memiliki badge khusus." },
      ],
      tips: ["Postingan dengan upvote tinggi dapat di-pin oleh dosen.", "Gunakan tags yang relevan untuk membantu pencarian."]
    },
    {
      id: "kolaborasi",
      title: "Kolaborasi: Kelompok, Komunitas & Tantangan",
      icon: "Users",
      color: "from-blue-500 to-indigo-600",
      description: "Belajar bersama melalui kelompok studi, forum komunitas, dan tantangan kelompok.",
      steps: [
        { title: "Kolaborasi Kelompok", detail: "Bergabung dengan kelompok studi untuk mengerjakan tugas dan proyek bersama." },
        { title: "Forum Komunitas", detail: "Diskusi umum lintas kelas: analisis kasus, dilema pragmatik, refleksi, dan tanya-jawab." },
        { title: "Tantangan Kelompok", detail: "Ikuti tantangan kelompok untuk mendapatkan XP bonus dan membangun kerja sama tim." },
        { title: "Perpustakaan Kasus", detail: "Akses koleksi kasus pragmatik yang bisa dijadikan bahan diskusi kelompok." },
      ],
      tips: ["Kontribusi di forum komunitas dengan postingan berkualitas meningkatkan skor kompetensi."]
    },
    {
      id: "analytics",
      title: "Analitik & Laporan Mingguan",
      icon: "TrendingUp",
      color: "from-emerald-500 to-green-600",
      description: "Pantau perkembangan kompetensi pragmatik dari waktu ke waktu.",
      steps: [
        { title: "Buka 'Analitik'", detail: "Lihat grafik tren skor kompetensi: kompetensi pragmatik, kesantunan, toksisitas, sensitivitas budaya, dan lainnya." },
        { title: "Cek 'Laporan Mingguan'", detail: "Sistem membuat laporan otomatis setiap minggu: skor, perubahan dari minggu sebelumnya, pencapaian, area lemah, dan rekomendasi." },
        { title: "Baca Ringkasan AI", detail: "AI memberikan ringkasan naratif perkembangan Anda setiap minggu." },
        { title: "Identifikasi Area Perbaikan", detail: "Gunakan laporan untuk fokus pada kompetensi yang masih lemah." },
      ],
      tips: ["Laporan mingguan juga dikirim via email jika diaktifkan."]
    },
    {
      id: "achievements",
      title: "Pencapaian & Gamifikasi",
      icon: "Award",
      color: "from-amber-500 to-yellow-600",
      description: "Sistem level, XP, lencana, dan streak untuk memotivasi pembelajaran.",
      steps: [
        { title: "Buka 'Pencapaian'", detail: "Lihat total XP, level saat ini (Pemula → Perunggu → Perak → Emas → Platinum → Master), dan progress ke level berikutnya." },
        { title: "Kumpulkan Lencana", detail: "Raih lencana dengan menyelesaikan modul, interaksi AI, refleksi, dan tantangan budaya." },
        { title: "Jaga Streak Harian", detail: "Login dan beraktivitas setiap hari untuk menjaga streak — semakin panjang streak, semakin banyak bonus XP." },
        { title: "Naik Peringkat", detail: "Akumulasi XP untuk naik level dan naik peringkat di leaderboard kelas." },
      ],
      tips: ["XP didapat dari: analisis AI, latihan kasus budaya, modul selesai, jurnal reflektif, dan tantangan kelompok."]
    },
    {
      id: "settings",
      title: "Notifikasi & Pengaturan",
      icon: "Bell",
      color: "from-slate-500 to-gray-600",
      description: "Kelola notifikasi dan pengaturan akun.",
      steps: [
        { title: "Cek Notifikasi", detail: "Buka menu 'Notifikasi' untuk melihat pengumuman kelas, feedback dosen, dan update sistem." },
        { title: "Buka Pengaturan", detail: "Kelola profil, preferensi tampilan, dan opsi notifikasi email." },
      ],
      tips: ["Periksa notifikasi secara berkala agar tidak ketinggalan informasi penting dari dosen."]
    },
  ]
};