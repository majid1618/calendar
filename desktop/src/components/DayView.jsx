import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthForGregorianDate, getDaysInGregorianMonth, getTodayInfo } from '../utils/edergawiEngine';

export default function DayView({ viewDate, setViewDate, selectedDate, selectDate, today, monthName }) {
  const day = selectedDate || today.gregorian.day;
  const eInfo = getMonthForGregorianDate(viewDate.year, viewDate.month, day);
  const isToday = day === today.gregorian.day && viewDate.month === today.gregorian.month && viewDate.year === today.gregorian.year;

  const navigateDay = (dir) => {
    const dim = getDaysInGregorianMonth(viewDate.month, viewDate.year);
    let newDay = (selectedDate || today.gregorian.day) + dir;
    if (newDay < 1) {
      setViewDate(prev => {
        let m = prev.month - 1;
        let y = prev.year;
        if (m < 1) { m = 12; y--; }
        selectDate(getDaysInGregorianMonth(m, y));
        return { year: y, month: m };
      });
    } else if (newDay > dim) {
      setViewDate(prev => {
        let m = prev.month + 1;
        let y = prev.year;
        if (m > 12) { m = 1; y++; }
        selectDate(1);
        return { year: y, month: m };
      });
    } else {
      selectDate(newDay);
    }
  };

  const dow = new Date(viewDate.year, viewDate.month - 1, day).getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="card fade-in">
      <div className="card-header flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800">
        <button onClick={() => navigateDay(-1)} className="p-2 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">{dayNames[dow]}</p>
          <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
            {monthName} {day}, {viewDate.year}
          </h2>
          {isToday && <span className="ashar-indicator mt-1 inline-block">Today</span>}
        </div>
        <button onClick={() => navigateDay(1)} className="p-2 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="p-6">
        {eInfo ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-xs uppercase tracking-wider opacity-80">Edergawi Calendar</p>
              <h3 className="text-2xl font-bold mt-1">{eInfo.english}</h3>
              <p className="text-lg arabic-text mt-0.5">{eInfo.arabic}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-3xl font-bold">{eInfo.dayInMonth}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Day of Month</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-3xl font-bold">{eInfo.monthNumber}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Month #{eInfo.monthNumber}</p>
                </div>
              </div>
              <p className="text-xs mt-4 opacity-80">Starts: {eInfo.gregorian} {eInfo.startDay}, {viewDate.year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Era</p>
                <p className="text-lg font-bold text-stone-800 dark:text-stone-200 mt-1">{eInfo.eraLabel || '—'}</p>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Gregorian</p>
                <p className="text-lg font-bold text-stone-800 dark:text-stone-200 mt-1">
                  {monthName} {day}, {viewDate.year}
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-stone-700/50 rounded-xl border border-amber-200 dark:border-stone-600">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Alshahr Alharam Status</p>
              <p className="text-sm text-stone-700 dark:text-stone-300">
                {viewDate.year >= 2022
                  ? `Year ${viewDate.year - 2022 + 1} AE ${eInfo.monthNumber > 8 ? '- includes Edergawi months 9-13 (Alshar region)' : '- standard months 1-8'}`
                  : `${2022 - viewDate.year} BE - Before the Edergawi era`}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400 dark:text-stone-500">
            <p className="text-lg">No Edergawi month data for this date</p>
            <p className="text-sm mt-2">This Gregorian date falls outside the defined Edergawi calendar range</p>
          </div>
        )}
      </div>
    </div>
  );
}
