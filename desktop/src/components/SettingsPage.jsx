import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { t, monthName } from '../i18n';

export default function SettingsPage({ onClose }) {
  const {
    isArabic, toggleArabic,
    isGregArabic, toggleGregArabic,
    sacredMonths, toggleSacredMonth,
    correctionOffset, setCorrectionOffset,
    theme, setTheme,
    isDark, allMonths,
  } = useSettings();

  const T = (key) => t(key, isArabic);

  return (
    <div className="fade-in max-w-2xl mx-auto space-y-6 pb-12">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
            {T('settings')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">{T('language')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">{T('edergawiNames')}</span>
                <button
                  onClick={toggleArabic}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isArabic
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {isArabic ? T('arabic') : T('english')}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">{T('gregNames')}</span>
                <button
                  onClick={toggleGregArabic}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isGregArabic
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {isGregArabic ? T('arabic') : T('english')}
                </button>
              </div>
            </div>
          </section>

          <hr className="border-stone-200 dark:border-stone-700" />

          <section>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">{T('theme')}</h3>
            <div className="flex gap-3">
              {[
                { key: 'light', icon: Sun },
                { key: 'dark', icon: Moon },
                { key: 'system', icon: Monitor },
              ].map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    theme === key
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600'
                  }`}
                >
                  <Icon size={16} />
                  {T(key)}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-stone-200 dark:border-stone-700" />

          <section>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">{T('sacredMonths')}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">{T('sacredMonthsDesc')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allMonths.map((month) => {
                const selected = sacredMonths.includes(month);
                const arName = { Muharram: 'محرم', Saffar: 'صفر', "Rabe' Awal": 'ربيع أول', "Rabe' Thani": 'ربيع ثاني', 'Jumada Awal': 'جمادى أول', 'Jumada Thani': 'جمادى ثاني', Rajab: 'رجب', Shaban: 'شعبان', Shawal: 'شوال', "Zul Qe'da": 'ذو القعدة', 'Zul Hijja': 'ذو الحجة' }[month];
                return (
                  <button
                    key={month}
                    onClick={() => toggleSacredMonth(month)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                      selected
                        ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-red-200 dark:hover:border-red-800'
                    }`}
                  >
                    <span className="block">{monthName(month, arName, false)}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">{monthName(month, arName, true)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-stone-200 dark:border-stone-700" />

          <section>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">{T('correctionOffset')}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{T('correctionOffsetDesc')}</p>
            <input
              type="number"
              min="-5"
              max="5"
              value={correctionOffset}
              onChange={(e) => setCorrectionOffset(e.target.value)}
              className="w-24 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-sm text-center text-stone-800 dark:text-stone-200 font-medium"
            />
          </section>

          <hr className="border-stone-200 dark:border-stone-700" />

          <section>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">{T('about')}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {T('aboutDesc')}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-2">
              {T('baseYear')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
