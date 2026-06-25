import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DAY_NAMES, ARABIC_DAY_NAMES, getEDaysInMonth, hasAsharAlharam, GREGORIAN_MONTHS, getMonthForGregorianDate } from '../utils/edergawiEngine';

export default function MonthView({ viewDate, setViewDate, calendarGrid, daysInMonth, selectedDate, selectDate, today, edergawiMonths, monthName, yearInfo }) {
  const navigate = (dir) => {
    setViewDate(prev => {
      let { year, month } = prev;
      month += dir;
      if (month > 12) { month = 1; year++; }
      if (month < 1) { month = 12; year--; }
      return { year, month };
    });
  };

  const isLastMonthOfYear = viewDate.month === 12;

  const eMonth = edergawiMonths.find(m => GREGORIAN_MONTHS[m.gregorian] === viewDate.month);

  return (
    <div className="card fade-in">
      <div className="card-header flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-12)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors" title="Previous year">
            <ChevronsLeft size={16} />
          </button>
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors" title="Previous month">
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            {monthName} <span className="text-amber-600 dark:text-amber-400">{viewDate.year}</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {yearInfo.eraFull}
            {yearInfo.hasAshar && <span className="ml-2 ashar-indicator">✦ Alshahr Alharam</span>}
          </p>
          {eMonth && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 arabic-text">
              {eMonth.arabic} — {eMonth.english} starts {eMonth.gregorian} {eMonth.startDay}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors" title="Next month">
            <ChevronRight size={16} />
          </button>
          <button onClick={() => navigate(12)} className="p-1.5 rounded-lg hover:bg-amber-200/50 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors" title="Next year">
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.short.map((d, i) => (
            <div key={d} className="week-header text-stone-400 dark:text-stone-500">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
            </div>
          ))}
        </div>

        {calendarGrid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, di) => {
              if (day === null) return <div key={`e-${wi}-${di}`} className="calendar-cell" />;
              const isToday = day === today.gregorian.day && viewDate.month === today.gregorian.month && viewDate.year === today.gregorian.year;
              const isSelected = day === selectedDate;
              const isWeekend = di === 5 || di === 6;
              const eDay = getMonthForGregorianDate(viewDate.year, viewDate.month, day);
              const isEdergawiStart = eMonth && day === eMonth.startDay;

              return (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  className={`calendar-cell relative ${isToday ? 'today' : isSelected ? 'bg-amber-200 dark:bg-amber-800 font-bold' : isWeekend ? 'text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-300'}`}
                >
                  <span className="relative z-10">{day}</span>
                  {isEdergawiStart && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                  )}
                  {isToday && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
