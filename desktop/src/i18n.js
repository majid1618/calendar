const en = {
  appTitle: 'Edergawi Calendar',
  today: 'Today',
  year: 'Year',
  month: 'Month',
  settings: 'Settings',
  ae: 'AE',
  be: 'BE',
  gregorian: 'Gregorian',
  edergawi: 'Edergawi',
  months: 'Months',
  alshahrAlharam: 'Alshahr Alharam',
  sacredMonth: 'Sacred Month',
  ramadan: 'Ramadan',
  monthOfFasting: 'Month of Fasting',
  present: 'Present',
  lunarNote: 'Lunar Note',
  lunarNoteText: 'Each Edergawi month begins the day after the full moon.',
  baseYear: 'Base Year: 2022 CE · Year 1 AE',
  muharram1: 'Muharram 1 = January 19, 2022',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  language: 'Language',
  arabic: 'Arabic',
  english: 'English',
  edergawiNames: 'Edergawi Month Names',
  gregNames: 'Gregorian Month Names',
  sacredMonths: 'Sacred Months',
  sacredMonthsDesc: 'Select up to 4 sacred months to highlight in red',
  correctionOffset: 'Correction Offset (days)',
  correctionOffsetDesc: 'Adjust month start dates (default: 0)',
  about: 'About',
  aboutDesc: 'The Edergawi calendar is a lunar calendar system based on full moon observations.',
  save: 'Save',
  cancel: 'Cancel',
  prevYear: 'Previous year',
  nextYear: 'Next year',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  noData: 'No calendar data for this month',
  daysLabel: 'days',
  alshahrAlharamYear: '✦ Alshahr Alharam Year',
  alshahrCycle: 'Alshar cycle: ~32 months',
};

const ar = {
  appTitle: 'التقويم العديرقاوي',
  today: 'اليوم',
  year: 'سنة',
  month: 'شهر',
  settings: 'الإعدادات',
  ae: 'تاريخ العديرقاوي',
  be: 'قبل العديرقاوي',
  gregorian: 'ميلادي',
  edergawi: 'عديرقاوي',
  months: 'شهور',
  alshahrAlharam: 'الشهر الحرام',
  sacredMonth: 'شهر حرام',
  ramadan: 'رمضان',
  monthOfFasting: 'شهر الصيام',
  present: 'موجود',
  lunarNote: 'ملاحظة قمرية',
  lunarNoteText: 'يبدأ كل شهر عديرقاوي في اليوم التالي للبدر.',
  baseYear: 'سنة الأساس: 2022 م · السنة 1 ت.ع',
  muharram1: 'محرم 1 = 19 يناير 2022',
  theme: 'المظهر',
  light: 'فاتح',
  dark: 'داكن',
  system: 'تلقائي',
  language: 'اللغة',
  arabic: 'العربية',
  english: 'الإنجليزية',
  edergawiNames: 'أسماء الأشهر العديرقاوية',
  gregNames: 'أسماء الأشهر الميلادية',
  sacredMonths: 'الأشهر الحرم',
  sacredMonthsDesc: 'اختر حتى 4 أشهر حرم لتظليلها بالأحمر',
  correctionOffset: 'تصحيح الإزاحة (أيام)',
  correctionOffsetDesc: 'ضبط تواريخ بداية الأشهر (الافتراضي: 0)',
  about: 'حول التطبيق',
  aboutDesc: 'التقويم العديرقاوي هو نظام تقويم قمري يعتمد على رؤية البدر.',
  save: 'حفظ',
  cancel: 'إلغاء',
  prevYear: 'السنة السابقة',
  nextYear: 'السنة التالية',
  prevMonth: 'الشهر السابق',
  nextMonth: 'الشهر التالي',
  noData: 'لا توجد بيانات لهذا الشهر',
  daysLabel: 'أيام',
  alshahrAlharamYear: '✦ سنة الشهر الحرام',
  alshahrCycle: 'دورة الشهر الحرام: ~32 شهرًا',
};

export function t(key, isArabic) {
  const dict = isArabic ? ar : en;
  return dict[key] || key;
}

export function monthName(englishName, arabicName, isArabic) {
  return isArabic ? (arabicName || englishName) : englishName;
}

export function eraLabel(aeYear, isArabic) {
  if (aeYear >= 1) {
    return isArabic ? `السنة ${aeYear} ت.ع` : `Year ${aeYear} AE`;
  }
  return isArabic ? `السنة ${-aeYear} ق.ع` : `Year ${-aeYear} BE`;
}

export default { en, ar, t, monthName, eraLabel };
