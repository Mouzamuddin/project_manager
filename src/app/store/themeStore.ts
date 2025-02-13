import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

//Zustand store with persistence in localStorage
export const useThemeStore = create<ThemeState>((set) => {
  // Check localStorage for saved theme on load
  const savedMode = typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false;

  return {
    isDarkMode: savedMode,
    toggleDarkMode: () =>
      set((state) => {
        const newMode = !state.isDarkMode;
        localStorage.setItem('darkMode', newMode.toString()); // Save to localStorage
        return { isDarkMode: newMode };
      }),
  };
});
