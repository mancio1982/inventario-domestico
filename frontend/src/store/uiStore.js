// frontend/src/store/uiStore.js
import {create} from 'zustand'; // Corretto import da 'zustand'

const useUIStore = create((set) => ({
  // Stato Globale di Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Stato per un eventuale Drawer/Sidebar (esempio)
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),

  // Notifiche/Snackbar
  snackbar: {
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  },
  showSnackbar: (message, severity = 'info') => set({ snackbar: { open: true, message, severity } }),
  closeSnackbar: () => set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));

export default useUIStore;
