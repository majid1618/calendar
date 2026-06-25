import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { GREGORIAN_MONTHS, getCalendarGrid, getMonthForGregorianDate, getDaysInGregorianMonth, hasAsharAlharam, DAY_NAMES, getYearInfo } from '../utils/edergawiEngine';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function YearView({ viewDate, setViewDate, today, selectDate, setViewMode }) {
  const navigate = (dir) => {
    setViewDate(prev => ({ ...prev, year: prev.year + dir }));
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-5)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="-5 years">
            <ChevronsLeft size={18} />
          </button>
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="Previous year">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{viewDate.year}</h2>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">
            {viewDate.year < 2022 ? `${2022 - viewDate.year} BE (Before Edergawi)` : `${viewDate.year - 2022 + 1} AE`}
            {hasAsharAlharam(viewDate.year) && viewDate.year >= 2022 && <span className="ml-2 ashar-indicator">✦ Alshar</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="Next year">
            <ChevronRight size={18} />
          </button>
          <button onClick={() => navigate(5)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="+5 years">
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {monthNames.map((name, idx) => {
          const m = idx + 1;
          const grid = getCalendarGrid(viewDate.year, m);
          const eMonth = getMonthForGregorianDate(viewDate.year, m, 1);

          return (
            <div key={name} className="card hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => { setViewDate(prev => ({ ...prev, month: m })); setViewMode('month'); }}>
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-700/50 dark:to-stone-700/50 border-b border-stone-200 dark:border-stone-600">
                <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{name}</p>
                {eMonth && <p className="text-[10px] text-amber-700 dark:text-amber-400 arabic-text">{eMonth.arabic}</p>}
              </div>
              <div className="p-3">
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[9px] font-semibold text-stone-400 text-center">{d}</div>
                  ))}
                </div>
                {grid.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-0">
                    {week.map((day, di) => {
                      if (day === null) return <div key={`e-${wi}-${di}`} className="text-center p-0.5" />;
                      const isToday = day === today.gregorian.day && m === today.gregorian.month && viewDate.year === today.gregorian.year;
                      return (
                        <div key={day} className={`text-center text-[10px] p-0.5 rounded ${isToday ? 'bg-amber-500 text-white font-bold' : 'text-stone-600 dark:text-stone-400'}`}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
