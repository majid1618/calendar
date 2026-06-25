import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const BASE_YEAR = 2022;

const GREG_NAMES = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'};
const GREG_NUM = {January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};

const MONTH_ORDER = [
  'Muharram','Saffar',"Rabe' Awal","Rabe' Thani",
  'Jumada Awal','Jumada Thani','Rajab','Shaban',
  'Ramadan','Shawal',"Zul Qe'da",'Zul Hijja'
];

const ASHAR_POSITIONS = [9, 5, 1, 13];

const ARABIC = {
  Muharram:'محرم',Saffar:'صفر',"Rabe' Awal":'ربيع أول',"Rabe' Thani":'ربيع ثاني',
  'Jumada Awal':'جمادى أول','Jumada Thani':'جمادى ثاني',Rajab:'رجب',Shaban:'شعبان',
  'Alshahr Alharam':'الشهر الحرام',Ramadan:'رمضان',Shawal:'شوال',
  "Zul Qe'da":'ذو القعدة','Zul Hijja':'ذو الحجة',
};

function jdFromDate(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function dateFromJd(jd) {
  const z = Math.floor(jd + 0.5);
  const a = z + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d2 = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d2 / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d2 - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function deltaT(year) {
  const y = year - 2000;
  return 62.92 + 0.32217 * y + 0.005589 * y * y;
}

const TZ_OFFSET = 3.0;
let CORRECTION_OFFSET = 0;

export function getCorrectionOffset() { return CORRECTION_OFFSET; }
export function setCorrectionOffset(days) { CORRECTION_OFFSET = days; }

function jdeToUt2(jde, year) {
  const dt = deltaT(year) / 86400.0;
  return jde - dt + TZ_OFFSET / 24.0;
}

function computeFullMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let jde = 2451550.09765 + 29.530588853 * k;
  jde += 0.0001337 * T2 - 0.00000015 * T3 + 0.00000000073 * T3 * T;
  const M = 2.5534 + 29.10535669 * k - 0.0000014 * T2;
  const mVal = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T3 * T;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T3 * T;
  const Mr = M * Math.PI / 180;
  const mr = mVal * Math.PI / 180;
  const Fr = F * Math.PI / 180;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;
  jde += -0.40614 * Math.sin(mr) + 0.17302 * E * Math.sin(Mr) + 0.01614 * Math.sin(2 * mr) + 0.01043 * Math.sin(2 * Fr);
  jde += 0.00734 * E * Math.sin(mr - Mr) + 0.00515 * E * Math.sin(mr + Mr) + 0.00495 * E2 * Math.sin(mr - 2 * Mr);
  jde += 0.00386 * Math.sin(2 * mr + Fr) + 0.00321 * Math.sin(2 * Mr - 2 * mr - Fr) + -0.00284 * Math.sin(mr + 2 * Mr);
  jde += 0.00275 * Math.sin(2 * mr - Fr) + -0.00247 * E * Math.sin(2 * Fr - 2 * Mr + mr) + 0.00167 * Math.sin(Fr + mr - 2 * Mr);
  return jde;
}

function buildMonthsForYear(gregYear, correctionOffset = 0) {
  const yearStartJd = jdFromDate(gregYear, 1, 1) - 0.5;
  const yearEndJd = jdFromDate(gregYear + 1, 1, 1) - 0.5;
  const searchStart = Math.floor((yearStartJd - 2451550.09765) / 29.530588853 - 0.5) + 0.5 - 2;
  const allFms = [];
  for (let i = 0; i < 20; i++) {
    const jde = computeFullMoon(searchStart + i);
    if (jde > yearEndJd + 30) break;
    allFms.push(jde);
  }
  const offsetDays = 1 + correctionOffset;
  const fmRecords = [];
  for (const jde of allFms) {
    const jdTz = jdeToUt2(jde, gregYear);
    const { year: y, month: m, day: d } = dateFromJd(jdTz);
    let assignYear, assignMonth, assignDay;
    if (m === 12 && d === 31) {
      assignYear = y + 1; assignMonth = 1; assignDay = 1;
    } else {
      assignYear = y; assignMonth = m; assignDay = d;
    }
    const msDate = new Date(y, m - 1, d + offsetDays);
    const msJd = jdFromDate(msDate.getFullYear(), msDate.getMonth() + 1, msDate.getDate()) - 0.5;
    const assignJd = jdFromDate(assignYear, assignMonth, assignDay) - 0.5;
    if (assignJd >= yearStartJd && assignJd < yearEndJd) {
      fmRecords.push({
        jde,
        fmYear: y, fmMonth: m, fmDay: d,
        msYear: msDate.getFullYear(),
        msMonth: msDate.getMonth() + 1,
        msDay: msDate.getDate(),
        msJd,
      });
    }
  }
  return fmRecords;
}

function aeYearToGregorian(aeYear) {
  return aeYear >= 1 ? BASE_YEAR + aeYear - 1 : BASE_YEAR + aeYear;
}

function gregToAE(gregYear) {
  return gregYear >= BASE_YEAR ? gregYear - BASE_YEAR + 1 : -(BASE_YEAR - gregYear);
}

function getEraLabel(gregYear) {
  return gregYear < BASE_YEAR ? `${BASE_YEAR - gregYear} BE` : `${gregYear - BASE_YEAR + 1} AE`;
}

const leapCache = {};

function countRawFmsInYear(gregYear) {
  const yearStartJd = jdFromDate(gregYear, 1, 1) - 0.5;
  const yearEndJd = jdFromDate(gregYear + 1, 1, 1) - 0.5;
  const searchStart = Math.floor((yearStartJd - 2451550.09765) / 29.530588853 - 0.5) + 0.5 - 2;
  let count = 0;
  for (let i = 0; i < 20; i++) {
    const jde = computeFullMoon(searchStart + i);
    if (jde > yearEndJd + 30) break;
    const jdTz = jdeToUt2(jde, gregYear);
    const { year: y, month: m, day: d } = dateFromJd(jdTz);
    const fmJd = jdFromDate(y, m, d) - 0.5;
    if (fmJd >= yearStartJd && fmJd < yearEndJd) count++;
  }
  return count;
}

function getAsharInsertIndex(aeYear, totalMonths) {
  if (totalMonths !== 13) return -1;
  let rawCount = 0;
  for (let y = 1; y <= aeYear; y++) {
    if (countRawFmsInYear(aeYearToGregorian(y)) === 13) rawCount++;
  }
  const extra = Math.floor(rawCount / 7);
  return (rawCount - 1 + extra) % 4;
}

function getEdergawiYear(aeYear, correctionOffset = CORRECTION_OFFSET) {
  const gregYear = aeYearToGregorian(aeYear);
  const fmRecords = buildMonthsForYear(gregYear, correctionOffset);
  const totalMonths = fmRecords.length;
  const monthNames = [...MONTH_ORDER];
  if (totalMonths === 13) {
    const posIndex = getAsharInsertIndex(aeYear, totalMonths);
    const insertAt = ASHAR_POSITIONS[posIndex];
    const splicePos = insertAt === 13 ? 12 : insertAt - 1;
    monthNames.splice(splicePos, 0, 'Alshahr Alharam');
  }
  const months = fmRecords.map((fr, i) => {
    const engName = monthNames[i] || 'Alshahr Alharam';
    const startDate = new Date(fr.msYear, fr.msMonth - 1, fr.msDay);
    let endDate;
    if (i < fmRecords.length - 1) {
      const next = fmRecords[i + 1];
      endDate = new Date(next.msYear, next.msMonth - 1, next.msDay - 1);
    } else {
      const nextYear = buildMonthsForYear(gregYear + 1);
      if (nextYear.length > 0) {
        endDate = new Date(nextYear[0].msYear, nextYear[0].msMonth - 1, nextYear[0].msDay - 1);
      } else {
        endDate = new Date(startDate);
      }
    }
    const length = Math.round((endDate - startDate) / 86400000) + 1;
    return {
      english: engName,
      arabic: ARABIC[engName] || engName,
      gregorian: GREG_NAMES[fr.msMonth],
      startDay: fr.msDay,
      startDate,
      endDate,
      length,
      isAshar: engName === 'Alshahr Alharam',
      isRamadan: engName === 'Ramadan',
    };
  });
  return {
    gregorianYear: gregYear,
    edergawiYear: aeYear,
    eraLabel: getEraLabel(gregYear),
    hasAshar: totalMonths === 13,
    totalMonths,
    months,
  };
}

function hasAshar(gregYear) {
  return getEdergawiYear(gregToAE(gregYear)).hasAshar;
}

function getMonthsForYear(gregYear) {
  return getEdergawiYear(gregToAE(gregYear)).months;
}

function getEra(gregYear) {
  if (gregYear < BASE_YEAR) return { label: `${BASE_YEAR - gregYear} BE`, ae: -(BASE_YEAR - gregYear) };
  return { label: `${gregYear - BASE_YEAR + 1} AE`, ae: gregYear - BASE_YEAR + 1 };
}

function getGrid(aeYear, midx) {
  const gregY = aeYearToGregorian(aeYear);
  const months = getEdergawiYear(aeYear).months;
  if (!months || midx < 0 || midx >= months.length) return null;
  const m = months[midx];
  const { startDate, endDate, length } = m;
  const firstDow = startDate.getDay();
  const days = [];
  for (let i = 0; i < firstDow; i++) days.push(null);
  for (let d = 0; d < length; d++) {
    const dt = new Date(startDate);
    dt.setDate(dt.getDate() + d);
    days.push({ eday: d + 1, gm: dt.getMonth() + 1, gd: dt.getDate(), gy: dt.getFullYear(), dow: dt.getDay() });
  }
  while (days.length % 7 !== 0) days.push(null);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return { grid: weeks, len: length, startDate, endDate, m, months, gregY };
}

export default function EdergawiCalendar() {
  const [aeYear, setAeYear] = useState(1);
  const [monthIdx, setMonthIdx] = useState(0);

  const gregY = aeYearToGregorian(aeYear);
  const months = getEdergawiYear(aeYear).months;
  const totalMonths = months.length;
  const eMonth = months[monthIdx];
  const isAshar = eMonth?.isAshar;

  const data = getGrid(aeYear, monthIdx);

  const nav = (dir) => {
    let mi = monthIdx + dir;
    if (mi >= totalMonths) { setAeYear(y => y + 1); setMonthIdx(0); }
    else if (mi < 0) { setAeYear(y => y - 1); setMonthIdx(0); }
    else setMonthIdx(mi);
  };

  const era = getEra(gregY);
  const eraFull = aeYear >= 1 ? `Year ${aeYear} AE` : `Year ${-aeYear} BE`;

  const today = () => {
    const now = new Date();
    const ae = gregToAE(now.getFullYear());
    setAeYear(ae);
    const yi = getEdergawiYear(ae);
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (let i = 0; i < yi.months.length; i++) {
      if (targetDate >= yi.months[i].startDate && targetDate <= yi.months[i].endDate) {
        setMonthIdx(i);
        return;
      }
    }
    setMonthIdx(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-900 mb-2">Edergawi Calendar</h1>
          <p className="text-lg text-amber-700">تقويم الإدرجاوي</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`px-6 py-5 text-white ${isAshar ? 'bg-gradient-to-r from-red-700 to-rose-600' : 'bg-gradient-to-r from-amber-700 to-orange-700'}`}>
            <div className="flex items-center justify-between">
              <button onClick={() => nav(-12)} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <h2 className={`text-3xl font-bold ${isAshar ? 'text-red-100' : ''}`}>
                  {isAshar && <span className="mr-2">✦</span>}{eMonth?.english || '—'}
                </h2>
                <p className="text-xl arabic-text mt-1">{eMonth?.arabic || ''}</p>
                <p className="text-sm mt-1 opacity-80">
                  {eraFull} · Gregorian {gregY}
                </p>
                {isAshar && <p className="text-xs text-red-200 mt-1 font-semibold">✦ Alshahr Alharam — Sacred Month</p>}
              </div>
              <button onClick={() => nav(12)} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {data && (
            <div className="p-6">
              <p className="text-sm text-amber-800 mb-4 text-center">
                {eMonth.english} {data.len} days · Starts {eMonth.gregorian} {eMonth.startDay}, {data.gregY}
              </p>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-bold text-amber-700 py-1">{d}</div>
                ))}
              </div>

              {data.grid.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                  {week.map((cell, di) => {
                    if (!cell) return <div key={`e-${wi}-${di}`} className="bg-stone-50 rounded" style={{paddingTop:'100%'}} />;
                    const gname = GREG_NAMES[cell.gm];
                    return (
                      <div
                        key={`${cell.gy}-${cell.gm}-${cell.gd}`}
                        className={`rounded p-1 flex flex-col items-center justify-center text-center ${isAshar ? 'bg-red-50' : 'bg-amber-50'}`}
                      >
                        <span className={`text-lg font-bold leading-tight ${isAshar ? 'text-red-700' : 'text-amber-800'}`}>
                          {cell.eday}
                        </span>
                        <span className={`text-[10px] leading-tight ${isAshar ? 'text-red-500' : 'text-stone-500'}`}>
                          {gname.slice(0,3)} {cell.gd}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between text-sm">
                  <button onClick={() => nav(-1)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1">
                    <ChevronLeft size={16} /> Prev Month
                  </button>
                  <button onClick={today} className="px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-lg transition-colors flex items-center gap-1">
                    <RotateCcw size={14} /> Today
                  </button>
                  <button onClick={() => nav(1)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1">
                    Next Month <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-amber-900">Edergawi Calendar</p>
            <p className="text-xs text-stone-500">Day 1/1/1 = January 19, 2022 · Computed via pure astronomical engine (Meeus full moon algorithm)</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-600">
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Key Features</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>12 or 13 months per year (astronomically determined)</li>
                <li>Month starts day after full moon (FM+1)</li>
                <li>Full moons computed via Meeus algorithm</li>
                <li>Alshahr Alharam inserted at cycle-based position</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-xs text-stone-400">
                Each cell: <strong>Edergawi day</strong> (large) + Gregorian date (small)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-stone-400">
          <p>Year {eraFull} · {totalMonths} months {isAshar ? '· Includes Alshahr Alharam ✦' : ''}</p>
        </div>
      </div>
    </div>
  );
}
