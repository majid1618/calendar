import { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, Maximize2, RotateCcw, Sun, Moon, Settings } from 'lucide-react';
import useCalendar from './hooks/useCalendar';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import EdergawiMonthView from './components/EdergawiMonthView';
import EdergawiYearView from './components/EdergawiYearView';
import SettingsPage from './components/SettingsPage';
import { SettingsProvider, useSettings } from './SettingsContext';
import { t, monthName, eraLabel } from './i18n';
import { setCorrectionOffset as engineSetCorrectionOffset } from './utils/edergawiEngine';

const VIEW_ICONS = { eyear: Maximize2, emonth: CalendarDays };

function AppContent() {
  const cal = useCalendar();
  const { isArabic, isDark, correctionOffset } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    engineSetCorrectionOffset(correctionOffset);
  }, [correctionOffset]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const T = (key) => t(key, isArabic);
  const todayStr = `${cal.today.gregorian.monthName} ${cal.today.gregorian.day}, ${cal.today.gregorian.year}`;

  if (showSettings) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-300">
        <div className="flex h-screen">
          <Sidebar viewDate={cal.viewDate} yearInfo={cal.yearInfo} edergawiForToday={cal.edergawiForToday} />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-800/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between px-6 py-3">
                <h1 className="text-sm font-bold">{T('settings')}</h1>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
                >
                  {T('save')}
                </button>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-6">
              <SettingsPage onClose={() => setShowSettings(false)} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <div className="flex h-screen">
        <Sidebar viewDate={cal.viewDate} yearInfo={cal.yearInfo} edergawiForToday={cal.edergawiForToday} />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-800/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <CalendarDays size={16} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold leading-tight">{T('appTitle')}</h1>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight arabic-text">{t('appTitle', true)}</p>
                  </div>
                </div>
                <span className="hidden sm:inline text-[10px] text-stone-400 dark:text-stone-500 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700">
                  {cal.eraLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-stone-100 dark:bg-stone-700 rounded-lg p-0.5">
                  {['eyear', 'emonth'].map(mode => {
                    const Icon = VIEW_ICONS[mode];
                    return (
                      <button
                        key={mode}
                        onClick={() => cal.setViewMode(mode)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                          cal.viewMode === mode
                            ? 'bg-white dark:bg-stone-600 text-amber-700 dark:text-amber-400 shadow-sm'
                            : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                        }`}
                      >
                        <Icon size={14} />
                        <span className="hidden md:inline capitalize">{mode === 'eyear' ? T('year') : T('month')}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-px h-6 bg-stone-200 dark:bg-stone-600 mx-1 hidden sm:block" />

                <button
                  onClick={cal.goToToday}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  {T('today')}
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 transition-colors"
                  title={T('settings')}
                >
                  <Settings size={16} />
                </button>

                <ThemeToggle isDark={isDark} onToggle={() => cal.toggleTheme()} />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => cal.navigate(-1)}
                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <p className="text-xs text-stone-400 dark:text-stone-500">
                {cal.yearInfo.hasAshar && cal.edergawiYear >= 1 ? T('alshahrAlharamYear') : ''}
              </p>

              <button
                onClick={() => cal.navigate(1)}
                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {cal.viewMode === 'eyear' && (
              <EdergawiYearView
                edergawiYear={cal.edergawiYear}
                eraLabel={cal.eraLabel}
                totalMonths={cal.totalMonths}
                setEdergawiMonthIdx={cal.setEdergawiMonthIdx}
                setViewMode={cal.setViewMode}
                navigate={cal.navigate}
              />
            )}
            {cal.viewMode === 'emonth' && (
              <EdergawiMonthView
                eMonthData={cal.eMonthData}
                eMonthGrid={cal.eMonthGrid}
                selectedDate={cal.selectedDate}
                selectDate={cal.selectDate}
                today={cal.today}
                edergawiYear={cal.edergawiYear}
                eraLabel={cal.eraLabel}
                navigate={cal.navigate}
              />
            )}

            <div className="text-center py-2">
              <p className="text-[10px] text-stone-400 dark:text-stone-500">
                {T('today')}: {todayStr} · {T('edergawi')}: {cal.edergawiForToday?.english || '—'} · {cal.today.era}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
