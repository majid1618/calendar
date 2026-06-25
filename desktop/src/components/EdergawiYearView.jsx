import { ChevronLeft, ChevronRight } from 'lucide-react';
import { hasAsharAlharam, getEdergawiMonthData, getEdergawiMonthGrid, DAY_NAMES, aeYearToGregorian } from '../utils/edergawiEngine';
import { useSettings } from '../SettingsContext';
import { t, monthName } from '../i18n';

const SHORT_DAY = ['S','M','T','W','T','F','S'];

export default function EdergawiYearView({ edergawiYear, eraLabel, totalMonths, setEdergawiMonthIdx, setViewMode, navigate }) {
  const { isArabic, sacredMonths } = useSettings();
  const gregYear = aeYearToGregorian(edergawiYear);
  const hasAshar = hasAsharAlharam(gregYear);
  const monthData = Array.from({ length: totalMonths }, (_, i) => getEdergawiMonthData(edergawiYear, i));

  const T = (key) => t(key, isArabic);

  function isSacredMonth(md) {
    return md && !md.isAshar && !md.isRamadan && sacredMonths.includes(md.english);
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-5)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="-5 years">
            <ChevronLeft size={18} />
            <span className="sr-only">-5 years</span>
          </button>
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title={T('prevYear')}>
            <ChevronLeft size={18} />
            <span className="sr-only">{T('prevYear')}</span>
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{eraLabel}</h2>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">
            {T('gregorian')} {gregYear} · {totalMonths} {T('months')}
            {hasAshar && <span className="ml-2 ashar-indicator">✦ {T('alshahrAlharam')}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title={T('nextYear')}>
            <ChevronRight size={18} />
            <span className="sr-only">{T('nextYear')}</span>
          </button>
          <button onClick={() => navigate(5)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 transition-colors" title="+5 years">
            <ChevronRight size={18} />
            <span className="sr-only">+5 years</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {monthData.map((md, idx) => {
          if (!md) return null;
          const isAshar = md.english === 'Alshahr Alharam';
          const isSacred = isSacredMonth(md);
          const showRed = isAshar || isSacred;
          const grid = getEdergawiMonthGrid(edergawiYear, idx);
          return (
            <div
              key={idx}
              className={`card hover:shadow-xl transition-shadow cursor-pointer ${
                showRed ? 'ring-2 ring-red-400' :
                md.isRamadan ? 'ring-2 ring-emerald-400' : ''
              }`}
              onClick={() => { setEdergawiMonthIdx(idx); setViewMode('emonth'); }}
            >
              <div className={`p-3 border-b ${
                showRed
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                  : md.isRamadan
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-700/50 dark:to-stone-700/50 border-stone-200 dark:border-stone-600'
              }`}>
                <p className={`font-bold text-sm ${showRed || md.isRamadan ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                  {(isAshar || isSacred) && <span>✦ </span>}
                  {md.isRamadan && <span>🌙 </span>}
                  {monthName(md.english, md.arabic, isArabic)}
                </p>
                <p className={`text-[10px] arabic-text ${
                  showRed ? 'text-red-100' :
                  md.isRamadan ? 'text-emerald-100' :
                  'text-amber-700 dark:text-amber-400'
                }`}>
                  {isArabic ? '' : md.arabic}
                </p>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-7 gap-0 mb-0.5">
                  {SHORT_DAY.map(d => (
                    <div key={d} className="text-[8px] font-semibold text-stone-400 text-center">{d}</div>
                  ))}
                </div>
                {grid && grid.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-0">
                    {week.map((cell, di) => {
                      if (!cell) return <div key={`e-${wi}-${di}`} className="text-center p-0.5" />;
                      return (
                        <div
                          key={`${cell.gyear}-${cell.gmonth}-${cell.gday}`}
                          className={`text-center text-[9px] p-0.5 rounded ${
                            showRed ? 'text-red-700 dark:text-red-300' :
                            md.isRamadan ? 'text-emerald-700 dark:text-emerald-300' :
                            'text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {cell.eday}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <p className="text-[8px] text-stone-400 dark:text-stone-500 text-center mt-1">
                  {md.gregorian} {md.startDay} → {md.length}{T('daysLabel')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
