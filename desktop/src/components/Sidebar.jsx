import { CalendarDays, Info, Moon, Star } from 'lucide-react';
import { hasAsharAlharam, getTodayInfo, DAY_NAMES, getEdergawiMonthData, getEdergawiMonthGrid, aeYearToGregorian, gregToAEYear } from '../utils/edergawiEngine';
import { useSettings } from '../SettingsContext';
import { t, monthName } from '../i18n';

export default function Sidebar({ yearInfo, edergawiForToday, viewDate }) {
  const { isArabic, sacredMonths } = useSettings();
  const today = getTodayInfo();
  const aeToday = gregToAEYear(today.gregorian.year);
  const todayEInfo = getEdergawiMonthData(aeToday, (edergawiForToday?.monthNumber || 1) - 1);
  const todayGrid = todayEInfo ? getEdergawiMonthGrid(aeToday, (edergawiForToday?.monthNumber || 1) - 1) : null;
  const isSacred = edergawiForToday && !edergawiForToday.isAshar && !edergawiForToday.isRamadan && sacredMonths.includes(edergawiForToday.english);

  const T = (key) => t(key, isArabic);

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-4 overflow-y-auto">
      <div className="card fade-in">
        <div className="card-header flex items-center gap-2">
          <CalendarDays size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-sm text-stone-700 dark:text-stone-300">{T('today')}&apos;s Edergawi Month</span>
        </div>
        <div className="p-4">
          <div className="text-center mb-3">
            <p className={`text-lg font-bold ${edergawiForToday?.isRamadan ? 'text-emerald-600 dark:text-emerald-400' : isSacred ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
              {edergawiForToday?.isRamadan && <span>🌙 </span>}
              {(edergawiForToday?.isAshar || isSacred) && <span>✦ </span>}
              {monthName(edergawiForToday?.english || '—', edergawiForToday?.arabic || '', isArabic)}
            </p>
            <p className="text-lg arabic-text text-amber-600 dark:text-amber-400">
              {isArabic ? '' : edergawiForToday?.arabic || ''}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {T('edergawi')} {t('daysLabel', isArabic)} {edergawiForToday?.dayInMonth || '—'} · {today.gregorian.monthName} {today.gregorian.day}, {today.gregorian.year}
            </p>
            {edergawiForToday?.isRamadan && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">🌙 {T('monthOfFasting')}</p>
            )}
            {(edergawiForToday?.isAshar || isSacred) && (
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">✦ {T('sacredMonth')}</p>
            )}
          </div>
          {todayGrid && (
            <div className="grid grid-cols-7 gap-0.5">
              {DAY_NAMES.short.map(d => (
                <div key={d} className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 text-center py-1">{d}</div>
              ))}
              {todayGrid.flat().map((cell, i) => (
                <div
                  key={i}
                  className={`text-center text-xs py-1 rounded ${
                    cell && cell.eday === edergawiForToday?.dayInMonth
                      ? 'bg-amber-500 text-white font-bold'
                      : cell ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/50' : ''
                  }`}
                >
                  {cell ? cell.eday : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card fade-in">
        <div className="card-header flex items-center gap-2">
          <Info size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-sm text-stone-700 dark:text-stone-300">{T('year')} Info</span>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500 dark:text-stone-400">{T('gregorian')}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{viewDate.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 dark:text-stone-400">{T('edergawi')}</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">{yearInfo.eraLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 dark:text-stone-400">{T('months')}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{yearInfo.totalMonths}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{T('alshahrAlharam')}</span>
            {yearInfo.hasAshar ? (
              <span className="ashar-indicator">
                <Star size={10} /> {T('present')}
              </span>
            ) : (
              <span className="text-xs text-stone-400 dark:text-stone-500">—</span>
            )}
          </div>
          <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
            <p className="text-xs text-stone-400 dark:text-stone-500 leading-relaxed">
              {T('baseYear')}<br />
              {T('muharram1')}
            </p>
          </div>
        </div>
      </div>

      <div className="card fade-in">
        <div className="card-header flex items-center gap-2">
          <Moon size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-sm text-stone-700 dark:text-stone-300">{T('lunarNote')}</span>
        </div>
        <div className="p-4 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          <p>{T('lunarNoteText')}</p>
          <p className="mt-2 text-amber-600 dark:text-amber-400 font-medium">• {T('daysLabel')}: 29-30 {T('daysLabel')}<br />• {T('alshahrCycle')}</p>
        </div>
      </div>
    </aside>
  );
}
