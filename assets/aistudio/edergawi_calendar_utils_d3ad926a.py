#!/usr/bin/env python3
"""
Edergawi Calendar System - Pure Astronomical Engine
Uses Meeus full moon algorithm for ALL computation.
"""

from datetime import datetime, timedelta, date
from typing import Dict, List, Tuple, Optional
import math

BASE_YEAR = 2022

GREG_NAMES = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'}
GREG_NUM = {'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,'July':7,'August':8,'September':9,'October':10,'November':11,'December':12}

MONTH_SEQUENCE = [
    'Muharram','Saffar',"Rabe' Awal","Rabe' Thani",
    'Jumada Awal','Jumada Thani','Rajab','Shaban',
    'Ramadan','Shawal',"Zul Qe'da",'Zul Hijja'
]

ASHAR_INSERT_POSITIONS = [9, 5, 1, 13]

ARABIC_NAMES = {
    'Muharram':'محرم','Saffar':'صفر',"Rabe' Awal":'ربيع أول',"Rabe' Thani":'ربيع ثاني',
    'Jumada Awal':'جمادى أول','Jumada Thani':'جمادى ثاني','Rajab':'رجب','Shaban':'شعبان',
    'Alshahr Alharam':'الشهر الحرام','Ramadan':'رمضان','Shawal':'شوال',
    "Zul Qe'da":'ذو القعدة','Zul Hijja':'ذو الحجة'
}


def jd_from_date(y: int, m: int, d: int) -> float:
    a = (14 - m) // 12
    yy = y + 4800 - a
    mm = m + 12 * a - 3
    return d + (153 * mm + 2) // 5 + 365 * yy + yy // 4 - yy // 100 + yy // 400 - 32045


def date_from_jd(jd: float) -> Tuple[int, int, int]:
    z = int(jd + 0.5)
    a = z + 32044
    b = (4 * a + 3) // 146097
    c = a - 146097 * b // 4
    d2 = (4 * c + 3) // 1461
    e = c - 1461 * d2 // 4
    m = (5 * e + 2) // 153
    day = e - (153 * m + 2) // 5 + 1
    month = m + 3 - 12 * (m // 10)
    year = 100 * b + d2 - 4800 + (m // 10)
    return year, month, day


def delta_t(year: float) -> float:
    y = year - 2000
    return 62.92 + 0.32217 * y + 0.005589 * y * y


TZ_OFFSET = 3.0  # hours from UTC (UT+3)

CORRECTION_OFFSET = 0  # days, adjustable by user

def set_correction_offset(days: int):
    global CORRECTION_OFFSET
    CORRECTION_OFFSET = days

def jde_to_ut2(jde: float, year: float) -> float:
    dt = delta_t(year) / 86400.0
    jd_ut = jde - dt
    return jd_ut + TZ_OFFSET / 24.0


def compute_full_moon(k: float) -> float:
    T = k / 1236.85
    T2 = T * T
    T3 = T2 * T

    jde = 2451550.09765 + 29.530588853 * k
    jde += 0.0001337 * T2 - 0.00000015 * T3 + 0.00000000073 * T3 * T

    M = 2.5534 + 29.10535669 * k - 0.0000014 * T2
    m_val = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T3 * T
    F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T3 * T

    Mr = math.radians(M)
    mr = math.radians(m_val)
    Fr = math.radians(F)

    E = 1 - 0.002516 * T - 0.0000074 * T2
    E2 = E * E

    jde += -0.40614 * math.sin(mr) + 0.17302 * E * math.sin(Mr) + 0.01614 * math.sin(2 * mr) + 0.01043 * math.sin(2 * Fr)
    jde += 0.00734 * E * math.sin(mr - Mr) + 0.00515 * E * math.sin(mr + Mr) + 0.00495 * E2 * math.sin(mr - 2 * Mr)
    jde += 0.00386 * math.sin(2 * mr + Fr) + 0.00321 * math.sin(2 * Mr - 2 * mr - Fr) + -0.00284 * math.sin(mr + 2 * Mr)
    jde += 0.00275 * math.sin(2 * mr - Fr) + -0.00247 * E * math.sin(2 * Fr - 2 * Mr + mr) + 0.00167 * math.sin(Fr + mr - 2 * Mr)

    return jde


def build_months_for_year(greg_year: int, correction_offset: int = 0) -> List[Dict]:
    year_start_jd = jd_from_date(greg_year, 1, 1) - 0.5
    year_end_jd = jd_from_date(greg_year + 1, 1, 1) - 0.5

    search_start = int((year_start_jd - 2451550.09765) / 29.530588853 - 0.5) + 0.5 - 2
    all_fms = []
    for i in range(20):
        jde = compute_full_moon(search_start + i)
        if jde > year_end_jd + 30:
            break
        all_fms.append(jde)

    offset_days = 1 + correction_offset
    fm_dates = []
    for jde in all_fms:
        jd_tz = jde_to_ut2(jde, greg_year)
        y, m, d = date_from_jd(jd_tz)
        if m == 12 and d == 31:
            assign_year = y + 1
            assign_month = 1
            assign_day = 1
        else:
            assign_year, assign_month, assign_day = y, m, d
        fm_date = date(y, m, d)
        ms_date = fm_date + timedelta(days=offset_days)
        ms_jd = jd_from_date(ms_date.year, ms_date.month, ms_date.day) - 0.5
        fm_jd = jd_from_date(y, m, d) - 0.5
        assign_jd = jd_from_date(assign_year, assign_month, assign_day) - 0.5

        if year_start_jd <= assign_jd < year_end_jd:
            fm_dates.append({
                'jde': jde,
                'fmYear': y,
                'fmMonth': m,
                'fmDay': d,
                'msYear': ms_date.year,
                'msMonth': ms_date.month,
                'msDay': ms_date.day,
                'msJd': ms_jd,
                'fmJd': fm_jd,
            })

    return fm_dates


_leap_count_cache = {}

def count_raw_fms_in_year(greg_year: int) -> int:
    year_start_jd = jd_from_date(greg_year, 1, 1) - 0.5
    year_end_jd = jd_from_date(greg_year + 1, 1, 1) - 0.5
    search_start = int((year_start_jd - 2451550.09765) / 29.530588853 - 0.5) + 0.5 - 2
    count = 0
    for i in range(20):
        jde = compute_full_moon(search_start + i)
        if jde > year_end_jd + 30:
            break
        jd_tz = jde_to_ut2(jde, greg_year)
        y, m, d = date_from_jd(jd_tz)
        fm_jd = jd_from_date(y, m, d) - 0.5
        if year_start_jd <= fm_jd < year_end_jd:
            count += 1
    return count


def count_leap_years(ae_year: int) -> int:
    if ae_year in _leap_count_cache:
        return _leap_count_cache[ae_year]
    count = 0
    for y in range(1, ae_year + 1):
        greg_y = BASE_YEAR + y - 1
        if count_raw_fms_in_year(greg_y) == 13:
            count += 1
    _leap_count_cache[ae_year] = count
    return count


def get_ashar_insert_index(ae_year: int, total_months: int) -> int:
    if total_months != 13:
        return -1
    raw_count = 0
    for y in range(1, ae_year + 1):
        greg_y = BASE_YEAR + y - 1
        if count_raw_fms_in_year(greg_y) == 13:
            raw_count += 1
    extra = raw_count // 7
    return (raw_count - 1 + extra) % 4


def ae_year_to_gregorian(ae_year: int) -> int:
    if ae_year >= 1:
        return BASE_YEAR + ae_year - 1
    return BASE_YEAR + ae_year


def greg_to_ae_year(greg_year: int) -> int:
    if greg_year >= BASE_YEAR:
        return greg_year - BASE_YEAR + 1
    return -(BASE_YEAR - greg_year)


def get_era_label(greg_year: int) -> str:
    if greg_year < BASE_YEAR:
        return f"{BASE_YEAR - greg_year} BE"
    return f"{greg_year - BASE_YEAR + 1} AE"


def get_edergawi_year(ae_year: int, correction_offset: int = 0) -> Dict:
    greg_year = ae_year_to_gregorian(ae_year)
    fm_records = build_months_for_year(greg_year, correction_offset)

    total_months = len(fm_records)
    month_names = list(MONTH_SEQUENCE)

    if total_months == 13:
        pos_index = get_ashar_insert_index(ae_year, total_months)
        insert_at = ASHAR_INSERT_POSITIONS[pos_index]
        splice_pos = 12 if insert_at == 13 else insert_at - 1
        month_names.insert(splice_pos, 'Alshahr Alharam')

    greg_months = []
    for i, fr in enumerate(fm_records):
        eng_name = month_names[i] if i < len(month_names) else 'Alshahr Alharam'
        start_date = date(fr['msYear'], fr['msMonth'], fr['msDay'])

        if i < len(fm_records) - 1:
            next_fr = fm_records[i + 1]
            end_date = date(next_fr['msYear'], next_fr['msMonth'], next_fr['msDay']) - timedelta(days=1)
        else:
            next_year_fms = build_months_for_year(greg_year + 1)
            if next_year_fms:
                next_fr = next_year_fms[0]
                end_date = date(next_fr['msYear'], next_fr['msMonth'], next_fr['msDay']) - timedelta(days=1)
            else:
                end_date = start_date

        length = (end_date - start_date).days + 1

        greg_months.append({
            'english': eng_name,
            'arabic': ARABIC_NAMES.get(eng_name, eng_name),
            'gregorian': GREG_NAMES[fr['msMonth']],
            'startDay': fr['msDay'],
            'gregYear': fr['msYear'],
            'startDate': start_date,
            'endDate': end_date,
            'length': length,
            'isAshar': eng_name == 'Alshahr Alharam',
            'isRamadan': eng_name == 'Ramadan',
        })

    return {
        'gregorianYear': greg_year,
        'edergawiYear': ae_year,
        'eraLabel': get_era_label(greg_year),
        'hasAshar': total_months == 13,
        'totalMonths': total_months,
        'months': greg_months,
    }


class EdergawiCalendar:
    BASE_YEAR = 2022

    @classmethod
    def has_ashar_alharam(cls, year: int) -> bool:
        yi = get_edergawi_year(greg_to_ae_year(year))
        return yi['hasAshar']

    @classmethod
    def get_months_for_year(cls, year: int) -> List[Dict]:
        yi = get_edergawi_year(greg_to_ae_year(year))
        return [{
            'english': m['english'],
            'arabic': m['arabic'],
            'gregorian': m['gregorian'],
            'startDay': m['startDay'],
            'gregorian_year': yi['gregorianYear'],
        } for m in yi['months']]

    @classmethod
    def gregorian_to_edergawi(cls, gregorian_year: int) -> Tuple[int, str]:
        if gregorian_year < cls.BASE_YEAR:
            be_years = cls.BASE_YEAR - gregorian_year
            return (be_years, f"{be_years} BE")
        ae_years = gregorian_year - cls.BASE_YEAR + 1
        return (ae_years, f"{ae_years} AE")

    @classmethod
    def edergawi_to_gregorian(cls, edergawi_year: int, is_ae: bool = True) -> int:
        if is_ae:
            return cls.BASE_YEAR + edergawi_year - 1
        return cls.BASE_YEAR - edergawi_year

    @classmethod
    def get_month_info(cls, year: int, month_number: int) -> Optional[Dict]:
        months = cls.get_months_for_year(year)
        if 1 <= month_number <= len(months):
            m = months[month_number - 1]
            return {
                'english': m['english'],
                'arabic': m['arabic'],
                'gregorian_month': m['gregorian'],
                'startDay': m['startDay'],
                'gregorian_year': year,
                'month_number': month_number,
            }
        return None

    @classmethod
    def get_gregorian_date_for_month(cls, year: int, month_number: int) -> Optional[datetime]:
        month_info = cls.get_month_info(year, month_number)
        if not month_info:
            return None
        month_num = GREG_NUM[month_info['gregorian_month']]
        return datetime(year, month_num, month_info['startDay'])

    @classmethod
    def find_month_for_gregorian_date(cls, dt: datetime) -> Optional[Dict]:
        for check_ae in [greg_to_ae_year(dt.year - 1), greg_to_ae_year(dt.year), greg_to_ae_year(dt.year + 1)]:
            yi = get_edergawi_year(check_ae)
            for i, m in enumerate(yi['months']):
                s = m['startDate']
                if isinstance(s, date):
                    s = datetime.combine(s, datetime.min.time())
                e = m['endDate']
                if isinstance(e, date):
                    e = datetime.combine(e, datetime.max.time())
                if s <= dt <= e:
                    day_in_month = (dt - s).days + 1
                    return {
                        'english': m['english'],
                        'arabic': m['arabic'],
                        'gregorian_month': m['gregorian'],
                        'startDay': m['startDay'],
                        'gregorian_year': yi['gregorianYear'],
                        'month_number': i + 1,
                        'day_in_month': day_in_month,
                    }
        return None

    @classmethod
    def get_year_info(cls, year: int) -> Dict:
        ae_year, era_label = cls.gregorian_to_edergawi(year)
        yi = get_edergawi_year(ae_year)
        return {
            'gregorian_year': year,
            'edergawi_year': ae_year,
            'era_label': era_label,
            'has_ashar_alharam': yi['hasAshar'],
            'total_months': yi['totalMonths'],
            'months': [{
                'english': m['english'],
                'arabic': m['arabic'],
                'gregorian_month': m['gregorian'],
                'start_day': m['startDay'],
            } for m in yi['months']],
        }

    @classmethod
    def print_year_calendar(cls, year: int):
        year_info = cls.get_year_info(year)
        print(f"\n{'='*60}")
        print(f"EDERGAWI CALENDAR - {year_info['era_label']}")
        print(f"Gregorian Year: {year}")
        if year_info['has_ashar_alharam']:
            print("\u2726 This year contains Alshahr Alharam (13 months)")
        else:
            print("\u25CB Standard year with 12 months")
        print(f"{'='*60}\n")
        for i, month in enumerate(year_info['months'], 1):
            start_date = cls.get_gregorian_date_for_month(year, i)
            date_str = start_date.strftime('%Y-%m-%d') if start_date else 'N/A'
            print(f"{i:2d}. {month['english']:20} ({month['arabic']:15})")
            print(f"    \u2514\u2500 {month['gregorian_month']:10} {date_str}")
            print()


if __name__ == "__main__":
    print("Edergawi Calendar System - Pure Astronomical Engine")
    print("=" * 60)

    test_years = [2022, 2023, 2024, 2026, 2028, 2029, 2031, 2034, 2037, 2039, 2040, 2042, 2045, 2048, 2050]
    for year in test_years:
        has = EdergawiCalendar.has_ashar_alharam(year)
        months = EdergawiCalendar.get_months_for_year(year)
        print(f"\n{year} (Ashar: {has}, Months: {len(months)}):")
        for m in months[:5]:
            print(f"  {m['english']:15} \u2192 {m['gregorian']} {m['startDay']}")
        if len(months) > 5:
            print(f"  ... ({len(months) - 5} more)")

    EdergawiCalendar.print_year_calendar(2026)
    EdergawiCalendar.print_year_calendar(2029)

    from datetime import datetime as dt
    print("\nFinding Edergawi month for dates:")
    test_dates = [
        dt(2026, 5, 2),
        dt(2026, 9, 1),
        dt(2029, 1, 1),
        dt(2031, 12, 29),
    ]
    for test_date in test_dates:
        result = EdergawiCalendar.find_month_for_gregorian_date(test_date)
        if result:
            print(f"  {test_date.strftime('%Y-%m-%d')} \u2192 {result['english']} (day {result.get('day_in_month', '?')})")
