// Karya pilihan yang tampil di section "Featured work".
// Untuk menambah karya baru, cukup tambahkan satu objek ke array di bawah.
// Field `learned` boleh dikosongkan; kalau kosong, kolomnya tidak ditampilkan.

export type FeaturedIcon = 'search' | 'database' | 'layout';

export interface LocalizedText {
  en: string;
  id: string;
}

export interface FeaturedWorkItem {
  id: string;
  title: string;
  icon: FeaturedIcon;
  tagline: LocalizedText;
  status: LocalizedText;
  question: LocalizedText;
  built: LocalizedText;
  learned?: LocalizedText;
  tags: string[];
  repoUrl: string;
}

export const featuredWork: FeaturedWorkItem[] = [
  {
    id: 'jatikarya',
    title: 'JATIKARYA',
    icon: 'search',
    tagline: {
      id: 'Melacak asal gambar setelah diedit AI',
      en: "Tracing an image's origin after AI editing",
    },
    status: {
      id: 'Eksperimen pribadi',
      en: 'Personal experiment',
    },
    question: {
      id: 'Kalau foto sudah diedit ChatGPT atau Gemini, masih bisa dilacak dari foto mana asalnya nggak?',
      en: 'Once a photo has been edited by ChatGPT or Gemini, can you still tell which photo it came from?',
    },
    built: {
      id: 'Aku edit 40 foto pribadiku pakai ChatGPT dan Gemini, lalu menguji empat cara melacaknya: watermark TrustMark saja, kemiripan visual DINOv2 saja, gabungan biasa, dan gabungan yang dikalibrasi.',
      en: 'I edited 40 of my own photos with ChatGPT and Gemini, then tested four ways to trace them: TrustMark watermarks alone, DINOv2 visual similarity alone, a naive fusion, and a calibrated fusion.',
    },
    // TODO: isi satu kalimat temuan utama, lalu hapus komentar ini.
    // learned: { id: '...', en: '...' },
    tags: ['Python', 'TrustMark', 'DINOv2', 'Google Colab'],
    repoUrl: 'https://github.com/rahmathidyatt/journal-jatikarya',
  },
  {
    id: 'sipudes',
    title: 'SIPUDES',
    icon: 'database',
    tagline: {
      id: 'Menghidupkan lagi aplikasi data desa lama',
      en: 'Bringing an old village data app back to life',
    },
    status: {
      id: 'Tahap 1 berjalan',
      en: 'Stage 1 in progress',
    },
    question: {
      id: 'Aplikasi pusat data desa berbasis CodeIgniter 3 ini sudah nggak mau jalan di PHP modern. Bisa dihidupkan lagi tanpa ditulis ulang dari nol?',
      en: "This CodeIgniter 3 village data app wouldn't run on modern PHP anymore. Could it be revived without a full rewrite?",
    },
    built: {
      id: 'Aku pindahkan ke Docker dengan PHP 8.4 dan MySQL 8.4, menambal kompatibilitas CodeIgniter 3 satu per satu, dan mulai dari modul Laporan. Data contohnya fiktif, password dibuat acak di komputer masing-masing.',
      en: 'I moved it onto Docker with PHP 8.4 and MySQL 8.4, patched CodeIgniter 3 compatibility issues one by one, and started with the reports module. Sample data is fictional and passwords are generated locally.',
    },
    learned: {
      id: 'Modernisasi itu soal sabar: ubah sedikit, tes, catat, baru lanjut. Fitur lama tetap jalan dan risikonya kecil.',
      en: 'Modernizing is mostly patience: change a little, test, write it down, then move on. Old features keep working and the risk stays small.',
    },
    tags: ['PHP 8.4', 'CodeIgniter 3', 'MySQL 8.4', 'Docker'],
    repoUrl: 'https://github.com/rahmathidyatt/sipudes',
  },
  {
    id: 'brighton-hub',
    title: 'Brighton HUB',
    icon: 'layout',
    tagline: {
      id: 'Satu aplikasi untuk operasional harian',
      en: 'One app for day-to-day operations',
    },
    status: {
      id: 'Versi 4',
      en: 'Version 4',
    },
    question: {
      id: 'Tools operasional HUB dulu jalan terpisah-pisah di Streamlit dan file lokal. Bisa nggak dijadikan satu aplikasi web yang bisa dibuka tim dari mana saja?',
      en: 'The HUB\'s ops tools used to run separately on Streamlit and local files. Could they become one web app the team can open from anywhere?',
    },
    built: {
      id: 'Versi keempatnya pakai React dan Supabase di Netlify: data agen, project dan MoU, broadcast, tugas berulang, jadwal Floor Time, sampai Smart Messenger. Mesin Python lamanya tetap dipakai, sekarang jalan langsung di browser lewat WebAssembly.',
      en: 'Version four runs on React and Supabase on Netlify: agent data, projects and MoUs, broadcasts, recurring tasks, Floor Time scheduling, and Smart Messenger. The original Python engine still does the work, now running in the browser through WebAssembly.',
    },
    tags: ['React', 'Supabase', 'Pyodide', 'Netlify'],
    repoUrl: 'https://github.com/rahmathidyatt/brighton-hub-cibubur',
  },
];
