import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DEFAULT_SACRED = ['Muharram', 'Saffar', "Rabe' Awal", "Rabe' Thani"];

const ALL_MONTHS = [
  'Muharram', 'Saffar', "Rabe' Awal", "Rabe' Thani",
  'Jumada Awal', 'Jumada Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawal', "Zul Qe'da", 'Zul Hijja',
];

const SettingsContext = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem('edergawi-' + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem('edergawi-' + key, JSON.stringify(value));
}

export function SettingsProvider({ children }) {
  const [isArabic, setIsArabic] = useState(() => load('isArabic', false));
  const [isGregArabic, setIsGregArabic] = useState(() => load('isGregArabic', false));
  const [sacredMonths, setSacredMonthsState] = useState(() => load('sacredMonths', DEFAULT_SACRED));
  const [correctionOffset, setCorrectionOffsetState] = useState(() => load('correctionOffset', 0));
  const [theme, setThemeState] = useState(() => load('theme', 'system'));
  const [isDark, setIsDark] = useState(() => {
    const t = load('theme', 'system');
    if (t === 'light') return false;
    if (t === 'dark') return true;
    if (typeof window !== 'undefined') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (load('theme', 'system') === 'system') {
        setIsDark(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const applyTheme = useCallback((t) => {
    if (t === 'system') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDark(t === 'dark');
    }
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    save('theme', t);
    applyTheme(t);
  }, [applyTheme]);

  const toggleArabic = useCallback(() => {
    setIsArabic(prev => {
      const next = !prev;
      save('isArabic', next);
      return next;
    });
  }, []);

  const toggleGregArabic = useCallback(() => {
    setIsGregArabic(prev => {
      const next = !prev;
      save('isGregArabic', next);
      return next;
    });
  }, []);

  const setSacredMonths = useCallback((months) => {
    const valid = months.filter(m => ALL_MONTHS.includes(m) && m !== 'Alshahr Alharam').slice(0, 4);
    setSacredMonthsState(valid);
    save('sacredMonths', valid);
  }, []);

  const toggleSacredMonth = useCallback((month) => {
    setSacredMonthsState(prev => {
      if (prev.includes(month)) {
        return prev.filter(m => m !== month);
      }
      if (prev.length >= 4) return prev;
      return [...prev, month];
    });
  }, []);

  const setCorrectionOffset = useCallback((val) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setCorrectionOffsetState(n);
      save('correctionOffset', n);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{
      isArabic, toggleArabic,
      isGregArabic, toggleGregArabic,
      sacredMonths, setSacredMonths, toggleSacredMonth,
      correctionOffset, setCorrectionOffset,
      theme, setTheme,
      isDark,
      allMonths: ALL_MONTHS.filter(m => m !== 'Ramadan' && m !== 'Alshahr Alharam'),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
