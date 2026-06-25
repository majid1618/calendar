const BASE_YEAR = 2022;
const GREG_NAMES = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'};
const GREG_NUM = {January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};

const DAY_NAMES = {short:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],long:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
const ARABIC_DAY_NAMES = {short:['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت']};

const MONTH_SEQUENCE = [
  'Muharram','Saffar',"Rabe' Awal","Rabe' Thani",
  'Jumada Awal','Jumada Thani','Rajab','Shaban',
  'Ramadan','Shawal',"Zul Qe'da",'Zul Hijja'
];

const ASHAR_INSERT_POSITIONS = [9, 5, 1, 13];

const ARABIC_NAMES = {
  'Muharram':'محرم','Saffar':'صفر',"Rabe' Awal":'ربيع أول',"Rabe' Thani":'ربيع ثاني',
  'Jumada Awal':'جمادى أول','Jumada Thani':'جمادى ثاني','Rajab':'رجب','Shaban':'شعبان',
  'Alshahr Alharam':'الشهر الحرام','Ramadan':'رمضان','Shawal':'شوال',
  "Zul Qe'da":'ذو القعدة','Zul Hijja':'ذو الحجة'
};

function jdFromDate(y,m,d) {
  const a = Math.floor((14-m)/12);
  const yy = y+4800-a;
  const mm = m+12*a-3;
  return d + Math.floor((153*mm+2)/5) + 365*yy + Math.floor(yy/4) - Math.floor(yy/100) + Math.floor(yy/400) - 32045;
}

function dateFromJd(jd) {
  const z = Math.floor(jd+0.5);
  const a = z+32044;
  const b = Math.floor((4*a+3)/146097);
  const c = a - Math.floor(146097*b/4);
  const d2 = Math.floor((4*c+3)/1461);
  const e = c - Math.floor(1461*d2/4);
  const m = Math.floor((5*e+2)/153);
  const day = e - Math.floor((153*m+2)/5) + 1;
  const month = m + 3 - 12 * Math.floor(m/10);
  const year = 100*b + d2 - 4800 + Math.floor(m/10);
  return {year, month, day};
}

function jdToGregorianDate(jd) {
  const {year, month, day} = dateFromJd(jd);
  return new Date(year, month-1, day);
}

function gregorianDateToJd(date) {
  return jdFromDate(date.getFullYear(), date.getMonth()+1, date.getDate());
}

const TZ_OFFSET = 3.0;
let CORRECTION_OFFSET = 0;

export function getCorrectionOffset() { return CORRECTION_OFFSET; }
export function setCorrectionOffset(days) { CORRECTION_OFFSET = days; }

function deltaT(year) {
  const y = year - 2000;
  return 62.92 + 0.32217 * y + 0.005589 * y * y;
}

function jdeToUt2(jde, year) {
  return jde - deltaT(year) / 86400.0 + TZ_OFFSET / 24.0;
}

function computeFullMoon(k) {
  const T = k / 1236.85;
  const T2 = T*T;
  const T3 = T2*T;

  let jde = 2451550.09765 + 29.530588853*k;
  jde += 0.0001337*T2 - 0.00000015*T3 + 0.00000000073*T3*T;

  const M = 2.5534 + 29.10535669*k - 0.0000014*T2;
  const mVal = 201.5643 + 385.81693528*k + 0.0107582*T2 + 0.00001238*T3 - 0.000000058*T3*T;
  const F = 160.7108 + 390.67050284*k - 0.0016118*T2 - 0.00000227*T3 + 0.000000011*T3*T;

  const Mr = M*Math.PI/180;
  const mr = mVal*Math.PI/180;
  const Fr = F*Math.PI/180;

  const E = 1 - 0.002516*T - 0.0000074*T2;
  const E2 = E*E;

  jde += -0.40614*Math.sin(mr) + 0.17302*E*Math.sin(Mr) + 0.01614*Math.sin(2*mr) + 0.01043*Math.sin(2*Fr);
  jde += 0.00734*E*Math.sin(mr-Mr) + 0.00515*E*Math.sin(mr+Mr) + 0.00495*E2*Math.sin(mr-2*Mr);
  jde += 0.00386*Math.sin(2*mr+Fr) + 0.00321*Math.sin(2*Mr-2*mr-Fr) + -0.00284*Math.sin(mr+2*Mr);
  jde += 0.00275*Math.sin(2*mr-Fr) + -0.00247*E*Math.sin(2*Fr-2*Mr+mr) + 0.00167*Math.sin(Fr+mr-2*Mr);

  return jde;
}

function jdToUtcDate(jd) {
  const z = Math.floor(jd+0.5);
  const {year, month, day} = dateFromJd(z);
  return {year, month, day};
}

function getFullMoonsBetween(startJd, endJd) {
  const startK = Math.floor((startJd - 2451550.09765) / 29.530588853 - 0.5) + 0.5;
  const fms = [];
  for (let k = startK; ; k += 1.0) {
    const jde = computeFullMoon(k);
    if (jde > endJd) break;
    if (jde >= startJd) {
      fms.push({jde, ...jdToUtcDate(jde)});
    }
  }
  return fms;
}

function buildEdergawiMonthsForYear(gregYear, correctionOffset = 0) {
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
    const {year: y, month: m, day: d} = dateFromJd(jdTz);
    let assignYear, assignMonth, assignDay;
    if (m === 12 && d === 31) {
      assignYear = y + 1; assignMonth = 1; assignDay = 1;
    } else {
      assignYear = y; assignMonth = m; assignDay = d;
    }
    const msDate = jdToGregorianDate(jdTz);
    msDate.setDate(msDate.getDate() + offsetDays);
    const msJd = gregorianDateToJd(msDate) - 0.5;
    const assignJd = jdFromDate(assignYear, assignMonth, assignDay) - 0.5;

    if (assignJd >= yearStartJd && assignJd < yearEndJd) {
      fmRecords.push({
        jde,
        msGregYear: msDate.getFullYear(),
        msGregMonth: msDate.getMonth() + 1,
        msGregDay: msDate.getDate(),
        msJd,
      });
    }
  }

  return fmRecords;
}

function countRawFmsInYear(gregYear) {
  const yearStartJd = jdFromDate(gregYear, 1, 1) - 0.5;
  const yearEndJd = jdFromDate(gregYear + 1, 1, 1) - 0.5;
  const searchStart = Math.floor((yearStartJd - 2451550.09765) / 29.530588853 - 0.5) + 0.5 - 2;
  let count = 0;
  for (let i = 0; i < 20; i++) {
    const jde = computeFullMoon(searchStart + i);
    if (jde > yearEndJd + 30) break;
    const jdTz = jdeToUt2(jde, gregYear);
    const {year: y, month: m, day: d} = dateFromJd(jdTz);
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

export function getEdergawiYear(aeYear, correctionOffset = CORRECTION_OFFSET) {
  const gregYear = aeYearToGregorian(aeYear);
  const fmRecords = buildEdergawiMonthsForYear(gregYear, correctionOffset);

  const totalMonths = fmRecords.length;
  const hasAshar = totalMonths === 13;
  const monthNames = [...MONTH_SEQUENCE];
  if (hasAshar) {
    const posIndex = getAsharInsertIndex(aeYear, totalMonths);
    const insertAt = ASHAR_INSERT_POSITIONS[posIndex];
    const splicePos = insertAt === 13 ? 12 : insertAt - 1;
    monthNames.splice(splicePos, 0, 'Alshahr Alharam');
  }

  const gregMonths = fmRecords.map((fr, i) => {
    const engName = monthNames[i] || 'Alshahr Alharam';
    const startDate = new Date(fr.msGregYear, fr.msGregMonth - 1, fr.msGregDay);
    let endDate;
    if (i < totalMonths - 1) {
      const nextFr = fmRecords[i + 1];
      endDate = new Date(nextFr.msGregYear, nextFr.msGregMonth - 1, nextFr.msGregDay - 1);
    } else {
      const nextYear = buildEdergawiMonthsForYear(gregYear + 1);
      if (nextYear.length > 0) {
        endDate = new Date(nextYear[0].msGregYear, nextYear[0].msGregMonth - 1, nextYear[0].msGregDay - 1);
      } else {
        endDate = new Date(startDate);
      }
    }

    return {
      english: engName,
      arabic: ARABIC_NAMES[engName] || engName,
      gregorian: GREG_NAMES[fr.msGregMonth],
      startDay: fr.msGregDay,
      gregYear: fr.msGregYear,
      monthIndex: i,
      startDate,
      endDate,
      length: Math.round((endDate - startDate) / 86400000) + 1,
      isAshar: engName === 'Alshahr Alharam',
      isRamadan: engName === 'Ramadan',
    };
  });

  return {
    gregorianYear: gregYear,
    edergawiYear: aeYear,
    eraLabel: getEraLabel(gregYear),
    hasAshar,
    totalMonths,
    months: gregMonths,
  };
}

function getNextYearFirstMonth(gregYear) {
  const months = buildEdergawiMonthsForYear(gregYear + 1);
  if (months.length > 0) {
    return new Date(months[0].msGregYear, months[0].msGregMonth - 1, months[0].msGregDay);
  }
  return null;
}

export function getMonthsForYear(gregYear) {
  const yearInfo = getEdergawiYear(gregToAEYear(gregYear));
  return yearInfo.months.map(m => ({
    english: m.english,
    arabic: m.arabic,
    gregorian: m.gregorian,
    startDay: m.startDay,
    startDate: m.startDate,
    endDate: m.endDate,
    length: m.length,
    isAshar: m.isAshar,
    isRamadan: m.isRamadan,
  }));
}

export function hasAsharAlharam(gregYear) {
  return getEdergawiYear(gregToAEYear(gregYear)).hasAshar;
}

export function getEraLabel(gregYear) {
  if (gregYear < BASE_YEAR) return `${BASE_YEAR - gregYear} BE`;
  return `${gregYear - BASE_YEAR + 1} AE`;
}

export function getEraFull(gregYear) {
  if (gregYear < BASE_YEAR) return `${BASE_YEAR - gregYear} BE (Before Edergawi)`;
  const ae = gregYear - BASE_YEAR + 1;
  return `${ae} AE${ae === 1 ? ' (Base Year)' : ''}`;
}

export function getDaysInGregorianMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(month, year) {
  return new Date(year, month - 1, 1).getDay();
}

export function getCalendarGrid(year, month) {
  const daysInMonth = getDaysInGregorianMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export function getMonthForGregorianDate(year, month, day) {
  const ae = gregToAEYear(year);
  const yInfo = getEdergawiYear(ae);

  const checkDate = new Date(year, month - 1, day);

  for (const checkAe of [ae - 1, ae, ae + 1]) {
    const yi = getEdergawiYear(checkAe);
    for (let i = 0; i < yi.months.length; i++) {
      const m = yi.months[i];
      const s = m.startDate;
      const e = m.endDate;
      if (checkDate >= s && checkDate <= e) {
        const dayInMonth = Math.round((checkDate - s) / 86400000) + 1;
        return {
          english: m.english,
          arabic: m.arabic,
          gregorian: m.gregorian,
          startDay: m.startDay,
          monthNumber: i + 1,
          dayInMonth,
          eraLabel: yi.eraLabel,
          totalMonths: yi.totalMonths,
          isAshar: m.isAshar,
          isRamadan: m.isRamadan,
        };
      }
    }
  }

  return null;
}

export function getTodayInfo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const e = getMonthForGregorianDate(y, m, d);
  const ae = gregToAEYear(y);
  return {
    gregorian: { year: y, month: m, day: d, monthName: GREG_NAMES[m] },
    edergawi: e,
    era: getEraFull(y),
    hasAshar: hasAsharAlharam(y),
    dow: now.getDay(),
    aeYear: ae,
  };
}

export function getYearInfo(year) {
  const ae = gregToAEYear(year);
  const yi = getEdergawiYear(ae);
  return {
    gregorianYear: year,
    edergawiYear: ae,
    eraLabel: yi.eraLabel,
    eraFull: getEraFull(year),
    hasAshar: yi.hasAshar,
    totalMonths: yi.totalMonths,
    months: yi.months.map(m => ({
      english: m.english,
      arabic: m.arabic,
      gregorian: m.gregorian,
      startDay: m.startDay,
      startDate: m.startDate,
      endDate: m.endDate,
      length: m.length,
      isAshar: m.isAshar,
      isRamadan: m.isRamadan,
    })),
  };
}

export function getEdergawiMonthsForGregorianMonth(year, gregMonth) {
  const result = [];
  for (const checkAe of [gregToAEYear(year - 1), gregToAEYear(year), gregToAEYear(year + 1)]) {
    const yi = getEdergawiYear(checkAe);
    if (!yi) continue;
    for (let i = 0; i < yi.months.length; i++) {
      const m = yi.months[i];
      const sm = m.startDate.getMonth() + 1;
      const em = m.endDate.getMonth() + 1;
      if (sm === gregMonth || em === gregMonth || (sm < gregMonth && em > gregMonth)) {
        result.push({
          ...m,
          checkYear: yi.gregorianYear,
          startGregYear: m.startDate.getFullYear(),
          startGregMonth: sm,
          startDay: m.startDate.getDate(),
          endGregYear: m.endDate.getFullYear(),
          endGregMonth: em,
          endDay: m.endDate.getDate(),
        });
      }
    }
  }
  result.sort((a, b) => a.startDay - b.startDay);
  return result;
}

export function getEDaysInMonth(monthData, year) {
  if (monthData.startDate && monthData.endDate) {
    return Math.round((monthData.endDate - monthData.startDate) / 86400000) + 1;
  }
  return 30;
}

export function aeYearToGregorian(aeYear) {
  if (aeYear >= 1) return BASE_YEAR + aeYear - 1;
  return BASE_YEAR + aeYear;
}

export function gregToAEYear(gregYear) {
  if (gregYear >= BASE_YEAR) return gregYear - BASE_YEAR + 1;
  return -(BASE_YEAR - gregYear);
}

export function getEdergawiMonthData(aeYear, monthIndex) {
  const yi = getEdergawiYear(aeYear);
  if (!yi || monthIndex < 0 || monthIndex >= yi.months.length) return null;
  const m = yi.months[monthIndex];
  return {
    ...m,
    monthIndex,
    gregYear: yi.gregorianYear,
    aeYear,
    totalMonths: yi.totalMonths,
    eraLabel: yi.eraLabel,
    eraFull: getEraFull(yi.gregorianYear),
  };
}

export function getEdergawiMonthGrid(aeYear, monthIndex) {
  const data = getEdergawiMonthData(aeYear, monthIndex);
  if (!data) return null;
  const days = [];
  const start = data.startDate;
  const firstDow = start.getDay();
  for (let i = 0; i < firstDow; i++) days.push(null);
  for (let d = 0; d < data.length; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    days.push({
      eday: d + 1,
      gmonth: date.getMonth() + 1,
      gday: date.getDate(),
      gyear: date.getFullYear(),
      gname: GREG_NAMES[date.getMonth() + 1],
      dow: date.getDay(),
    });
  }
  while (days.length % 7 !== 0) days.push(null);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export function monthSpan(monthData, months, idx, year) {
  const startDate = monthData.startDate || new Date(year, GREG_NUM[monthData.gregorian] - 1, monthData.startDay);
  let endDate;
  if (idx < months.length - 1) {
    const next = months[idx + 1];
    const nextStart = next.startDate || new Date(year, GREG_NUM[next.gregorian] - 1, next.startDay);
    endDate = new Date(nextStart);
    endDate.setDate(endDate.getDate() - 1);
  } else {
    const nextYear = getEdergawiYear(gregToAEYear(year + 1));
    if (nextYear && nextYear.months.length > 0) {
      endDate = new Date(nextYear.months[0].startDate);
      endDate.setDate(endDate.getDate() - 1);
    } else {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 29);
    }
  }
  const len = Math.round((endDate - startDate) / 86400000) + 1;
  return { startDate, endDate, length: len };
}

const GREGORIAN_MONTHS = GREG_NUM;
export { BASE_YEAR, GREG_NAMES, GREGORIAN_MONTHS, DAY_NAMES, ARABIC_DAY_NAMES, MONTH_SEQUENCE };
