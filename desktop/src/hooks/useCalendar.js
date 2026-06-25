import { useState, useMemo, useCallback } from 'react';
import { getMonthsForYear, getYearInfo, getTodayInfo, getMonthForGregorianDate, GREGORIAN_MONTHS, getEdergawiMonthData, getEdergawiMonthGrid, aeYearToGregorian, gregToAEYear } from '../utils/edergawiEngine';

export default function useCalendar() {
  const today = getTodayInfo();
  const [edergawiYear, setEdergawiYear] = useState(() => gregToAEYear(today.gregorian.year));
  const [edergawiMonthIdx, setEdergawiMonthIdx] = useState(0);
  const [viewMode, setViewMode] = useState('emonth');
  const [selectedDate, setSelectedDate] = useState(null);

  const gregYear = useMemo(() => aeYearToGregorian(edergawiYear), [edergawiYear]);

  const yearInfo = useMemo(() => getYearInfo(gregYear), [gregYear]);

  const totalMonths = yearInfo.totalMonths;

  const eMonthData = useMemo(() => {
    return getEdergawiMonthData(edergawiYear, edergawiMonthIdx);
  }, [edergawiYear, edergawiMonthIdx]);

  const eMonthGrid = useMemo(() => {
    return getEdergawiMonthGrid(edergawiYear, edergawiMonthIdx);
  }, [edergawiYear, edergawiMonthIdx]);

  const navigateEdergawi = useCallback((dir) => {
    if (viewMode === 'eyear') {
      setEdergawiYear(prev => {
        const next = prev + dir;
        if (next === 0) return dir > 0 ? 1 : -1;
        return next;
      });
      return;
    }
    setEdergawiMonthIdx(prev => {
      let next = prev + dir;
      if (next >= totalMonths) {
        setEdergawiYear(y => {
          const ny = y + 1;
          return ny === 0 ? 1 : ny;
        });
        return 0;
      }
      if (next < 0) {
        setEdergawiYear(y => {
          const ny = y - 1;
          return ny === 0 ? -1 : ny;
        });
        return 0;
      }
      return next;
    });
  }, [viewMode, totalMonths]);

  const goToToday = useCallback(() => {
    const ae = gregToAEYear(today.gregorian.year);
    setEdergawiYear(ae);
    const eInfo = getMonthForGregorianDate(today.gregorian.year, today.gregorian.month, today.gregorian.day);
    if (eInfo) {
      setEdergawiMonthIdx(eInfo.monthNumber - 1);
      setSelectedDate(eInfo.dayInMonth);
    } else {
      setEdergawiMonthIdx(0);
      setSelectedDate(null);
    }
    setViewMode('emonth');
  }, [today]);

  const selectDate = useCallback((eday) => {
    setSelectedDate(eday);
  }, []);

  const edergawiMonthsList = useMemo(() => {
    return getMonthsForYear(gregYear);
  }, [gregYear]);

  const edergawiForToday = useMemo(() => {
    return getMonthForGregorianDate(today.gregorian.year, today.gregorian.month, today.gregorian.day);
  }, [today]);

  const eraLabel = useMemo(() => {
    if (edergawiYear >= 1) return `Year ${edergawiYear} AE`;
    return `Year ${-edergawiYear} BE`;
  }, [edergawiYear]);

  const gregMonths = useMemo(() => {
    return Object.entries(GREGORIAN_MONTHS).map(([name, num]) => ({ name, num }));
  }, []);

  return {
    viewDate: { year: gregYear, month: 1 },
    setViewDate: () => {},
    edergawiYear,
    setEdergawiYear,
    edergawiMonthIdx,
    setEdergawiMonthIdx,
    viewMode,
    setViewMode,
    selectedDate,
    selectDate,
    navigate: navigateEdergawi,
    goToToday,
    today,
    yearInfo,
    gregMonths,
    edergawiMonths: edergawiMonthsList,
    edergawiForToday,
    eMonthData,
    eMonthGrid,
    eraLabel,
    gregYear,
    totalMonths,
    monthName: eMonthData?.english || '',
  };
}
