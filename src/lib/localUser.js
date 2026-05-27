// Local user session management (no Google OAuth required)
const STORAGE_KEY = 'pragmatics_local_user';

export const localUser = {
  get() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },
  set(userData) {
    // userData: { email, full_name, institution, role }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...userData, id: userData.email }));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
  isLoggedIn() {
    return !!this.get();
  }
};