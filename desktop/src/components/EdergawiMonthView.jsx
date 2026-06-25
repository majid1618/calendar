import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAY_NAMES } from '../utils/edergawiEngine';
import { useSettings } from '../SettingsContext';
import { t, monthName } from '../i18n';

export default function EdergawiMonthView({ eMonthData, eMonthGrid, selectedDate, selectDate, today, edergawiYear, eraLabel, navigate }) {
  const { isArabic, isGregArabic, sacredMonths } = useSettings();

  if (!eMonthData || !eMonthGrid) {
    return (
      <div className="card fade-in p-12 text-center text-stone-400">
        {t('noData', isArabic)}
      </div>
    );
  }

  const isAshar = eMonthData.isAshar;
  const isRamadan = eMonthData.isRamadan;
  const isSacred = sacredMonths.includes(eMonthData.english);

  function edergawiForToday() {
    const te = today.edergawi;
    if (!te) return null;
    if (te.english === eMonthData.english &&
        te.dayInMonth >= 1 &&
        te.dayInMonth <= eMonthData.length) {
      return te.dayInMonth;
    }
    return null;
  }

  const hasToday = edergawiForToday();
  const showRed = isAshar || isSacred;

  const gregStart = `${eMonthData.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  const gregEnd = `${eMonthData.endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className={`card fade-in overflow-hidden ${isRamadan ? 'ring-2 ring-emerald-400 dark:ring-emerald-600' : showRed ? 'ring-2 ring-red-400 dark:ring-red-600' : ''}`}>
      <div className={`card-header flex items-center justify-between ${
        showRed
          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
          : isRamadan
            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800'
      }`}>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-12)} className={`p-1.5 rounded-lg transition-colors ${
            showRed || isRamadan
              ? 'hover:bg-white/20 text-white/70'
              : 'hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400'
          }`} title={t('prevYear', isArabic)}>
            <ChevronLeft size={16} />
            <span className="sr-only">{t('prevYear', isArabic)}</span>
          </button>
        </div>

        <div className="text-center">
          <h2 className={`text-2xl font-bold ${showRed ? 'text-white' : isRamadan ? 'text-white' : 'text-stone-800 dark:text-stone-100'}`}>
            {(isAshar || isSacred) && <span className="mr-2">✦</span>}
            {isRamadan && <span className="mr-2">🌙</span>}
            {monthName(eMonthData.english, eMonthData.arabic, isArabic)}
          </h2>
          <p className={`text-lg arabic-text ${showRed || isRamadan ? 'text-white/80' : 'text-amber-600 dark:text-amber-400'}`}>
            {isArabic ? '' : eMonthData.arabic}
          </p>
          <p className={`text-xs mt-0.5 ${showRed || isRamadan ? 'text-white/70' : 'text-stone-500 dark:text-stone-400'}`}>
            {eraLabel} · {eMonthData.length} {t('daysLabel', isArabic)} · {gregStart} → {gregEnd}
          </p>
          {showRed && (
            <p className="text-xs text-red-200 font-semibold mt-0.5">✦ {t('sacredMonth', isArabic)}</p>
          )}
          {isRamadan && (
            <p className="text-xs text-emerald-200 font-semibold mt-0.5">🌙 {t('monthOfFasting', isArabic)}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate(1)} className={`p-1.5 rounded-lg transition-colors ${
            showRed || isRamadan
              ? 'hover:bg-white/20 text-white/70'
              : 'hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400'
          }`} title={t('nextMonth', isArabic)}>
            <ChevronRight size={16} />
            <span className="sr-only">{t('nextMonth', isArabic)}</span>
          </button>
        </div>
      </div>

      <div className={`p-6 ${isRamadan ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : showRed ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.short.map((d, i) => (
            <div key={d} className="week-header text-stone-400 dark:text-stone-500">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{['S','M','T','W','T','F','S'][i]}</span>
            </div>
          ))}
        </div>

        {eMonthGrid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((cell, di) => {
              if (!cell) return <div key={`e-${wi}-${di}`} className="calendar-cell" />;
              const isCellToday = cell.eday === hasToday;
              const isSelected = cell.eday === selectedDate;
              const isWeekend = cell.dow === 5 || cell.dow === 6;
              return (
                <button
                  key={`${cell.gyear}-${cell.gmonth}-${cell.gday}`}
                  onClick={() => selectDate(cell.eday)}
                  className={`calendar-cell relative flex flex-col items-center justify-center py-1 ${
                    isCellToday ? 'today' :
                    isSelected ? 'bg-amber-200 dark:bg-amber-800' :
                    showRed ? 'bg-red-50 dark:bg-red-900/20' :
                    isRamadan ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                    isWeekend ? 'text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-300'
                  } ${
                    showRed ? 'hover:bg-red-100 dark:hover:bg-red-900/40' :
                    isRamadan ? 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40' :
                    'hover:bg-amber-100 dark:hover:bg-amber-900/30'
                  }`}
                >
                  <span className={`text-lg font-bold leading-tight ${
                    showRed ? 'text-red-700 dark:text-red-400' :
                    isRamadan ? 'text-emerald-700 dark:text-emerald-400' : ''
                  }`}>
                    {cell.eday}
                  </span>
                  <span className={`text-[9px] leading-tight ${
                    showRed ? 'text-red-500 dark:text-red-400' :
                    isRamadan ? 'text-emerald-500 dark:text-emerald-400' :
                    'text-stone-400 dark:text-stone-500'
                  }`}>
                    {cell.gname.slice(0, 3)} {cell.gday}
                  </span>
                  {isCellToday && <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse ${
                    isRamadan ? 'bg-emerald-500' : showRed ? 'bg-red-500' : 'bg-amber-500'
                  }`} />}
                </button>
              );
            })}
          </div>
        ))}

        <div className={`mt-4 pt-3 border-t ${isRamadan ? 'border-emerald-200 dark:border-emerald-800' : 'border-stone-200 dark:border-stone-600'}`}>
          <p className={`text-xs text-center ${isRamadan ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`}>
            {t('edergawiNames', isArabic)} <strong>{monthName(eMonthData.english, eMonthData.arabic, isArabic)}</strong> · {t('gregNames', isArabic)} {gregStart} – {gregEnd}
          </p>
        </div>
      </div>
    </div>
  );
}
