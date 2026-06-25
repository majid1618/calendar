import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAY_NAMES, getMonthForGregorianDate, getCalendarGrid, getDaysInGregorianMonth } from '../utils/edergawiEngine';

export default function WeekView({ viewDate, setViewDate, selectedDate, selectDate, today, monthName }) {
  const weeks = getCalendarGrid(viewDate.year, viewDate.month);
  const currentWeekIndex = weeks.findIndex(week => week.includes(selectedDate || 1));
  const currentWeek = currentWeekIndex >= 0 ? weeks[currentWeekIndex] : weeks[0];
  const visibleDays = currentWeek.filter(d => d !== null);

  const navigateWeek = (dir) => {
    const firstVisible = currentWeek.find(d => d !== null) || 1;
    const newDay = firstVisible + dir * 7;
    if (newDay < 1) {
      setViewDate(prev => {
        let m = prev.month - 1;
        let y = prev.year;
        if (m < 1) { m = 12; y--; }
        const dim = getDaysInGregorianMonth(m, y);
        return { year: y, month: m };
      });
    } else if (newDay > getDaysInGregorianMonth(viewDate.month, viewDate.year)) {
      setViewDate(prev => {
        let m = prev.month + 1;
        let y = prev.year;
        if (m > 12) { m = 1; y++; }
        return { year: y, month: m };
      });
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800">
        <button onClick={() => navigateWeek(-1)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            Week of {monthName} {viewDate.year}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {visibleDays[0] || '—'} – {visibleDays[visibleDays.length - 1] || '—'}
          </p>
        </div>
        <button onClick={() => navigateWeek(1)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-3">
          {DAY_NAMES.long.map((name, i) => {
            const day = currentWeek[i];
            const isToday = day === today.gregorian.day && viewDate.month === today.gregorian.month && viewDate.year === today.gregorian.year;
            const isSelected = day === selectedDate;
            const eDay = day ? getMonthForGregorianDate(viewDate.year, viewDate.month, day) : null;

            return (
              <div key={name} className="flex flex-col items-center">
                <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mb-1 uppercase tracking-wide">{name.slice(0, 3)}</p>
                {day ? (
                  <button
                    onClick={() => selectDate(day)}
                    className={`w-full p-3 rounded-xl text-center transition-all ${
                      isToday ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' :
                      isSelected ? 'bg-amber-100 dark:bg-amber-800/50 text-amber-900 dark:text-amber-200' :
                      'hover:bg-stone-100 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="text-2xl font-bold block">{day}</span>
                    {eDay && (
                      <span className="text-[10px] mt-1 block opacity-70 arabic-text">{eDay.arabic}</span>
                    )}
                  </button>
                ) : (
                  <div className="w-full p-3 rounded-xl" />
                )}
                {day && (
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                    {eDay?.english?.slice(0, 6) || '—'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-stone-700/50 rounded-lg border border-amber-200 dark:border-stone-600">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <span className="font-semibold">{monthName} {selectedDate}, {viewDate.year}</span>
              {(() => {
                const e = getMonthForGregorianDate(viewDate.year, viewDate.month, selectedDate);
                return e ? (
                  <span className="ml-2 text-amber-700 dark:text-amber-400">
                    → Edergawi: <span className="arabic-text">{e.arabic}</span> ({e.english}), Day {e.dayInMonth}
                  </span>
                ) : (
                  <span className="ml-2 text-stone-400">(Outside Edergawi month bounds)</span>
                );
              })()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
