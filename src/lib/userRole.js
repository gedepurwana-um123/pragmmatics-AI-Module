// Menyimpan dan membaca peran pengguna yang dipilih saat ProfileSetup
// Kunci: email user → peran ('mahasiswa' | 'dosen' | 'admin')

const STORAGE_KEY = 'pragmatics_user_roles';

function getRolesMap() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

export const userRole = {
  // Simpan peran untuk email tertentu
  set(email, role) {
    const map = getRolesMap();
    map[email] = role;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  },

  // Ambil peran untuk email tertentu
  get(email) {
    if (!email) return null;
    return getRolesMap()[email] || null;
  },

  // Hapus peran (saat logout)
  clear(email) {
    if (!email) return;
    const map = getRolesMap();
    delete map[email];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  },
};