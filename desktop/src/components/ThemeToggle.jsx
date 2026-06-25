import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
      style={{ backgroundColor: isDark ? '#292524' : '#fef3c7' }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${isDark ? 'translate-x-7 bg-stone-700' : 'bg-amber-400'}`}
      >
        {isDark ? <Moon size={14} className="text-amber-400" /> : <Sun size={14} className="text-white" />}
      </span>
    </button>
  );
}
