# Edergawi Calendar - Quick Reference Card

## 📅 The 13 Months

| # | English | Arabic | Gregorian Month | Start Day | Notes |
|---|---------|--------|-----------------|-----------|-------|
| 1 | Muharram | محرم | January | 8 | First month |
| 2 | Saffar | صفر | February | 6 | |
| 3 | Rabe' Awal | ربيع أول | March | 8 | |
| 4 | Rabe' Thani | ربيع ثاني | April | 7 | |
| 5 | Jumada Awal | جمادى أول | May | 6 | |
| 6 | Jumada Thani | جمادى ثاني | June | 5 | |
| 7 | Rajab | رجب | July | 4 | |
| 8 | Shaban | شعبان | August | 2 | |
| **9** | **Alshar Alharam** | **الشهر الحرام** | **September** | **1** | **✦ Sacred month (every 2.67 years)** |
| 10 | Ramadan | رمضان | September/October | 30/19 | Varies by year |
| 11 | Shawal | شوال | October | 29/18 | Varies by year |
| 12 | Zul Qe'da | ذو القعدة | November | 28/17 | Varies by year |
| 13 | Zul Hijja | ذو الحجة | December | 28/17 | Last month |

---

## 🗓️ Year Type Indicators

### Years with Alshar Alharam (13 Months) ✦
2023, 2026, 2029, 2031, 2034, 2037, 2039, 2042, 2044, 2047, 2050...

### Standard Years (12 Months)
All other years (2024, 2025, 2027, 2028, 2030, etc.)

---

## 🔄 Era System

| Format | Meaning | Example |
|--------|---------|---------|
| **X AE** | Years After Edergawi (from 2022) | 5 AE = 2026 |
| **X BE** | Years Before Edergawi (before 2022) | 1 BE = 2021 |

### Quick Conversion
```
Gregorian Year 2026 = Year 5 AE
Gregorian Year 2021 = Year 1 BE
Gregorian Year 2022 = Year 1 AE (Base Year)
```

---

## 🌙 Full Moon Night (Start of Month)

**Definition**: The night when moonrise has the **least time after sunset** during the full moon phase

**Result**: Each Edergawi month begins the **day after** this astronomical event

**Why**: Provides an observable, astronomical basis for the calendar

---

## 📊 Month Statistics

| Property | Value |
|----------|-------|
| Regular months per year | 12 or 13 |
| Average month length | 29-30 days |
| Lunar sync | Yes (synodic month ≈ 29.53 days) |
| Alshar cycle | Every 2 years & 8 months (≈32 months) |
| Year 1 | 2022 CE |
| Months in 13-month year | 13 |
| Months in 12-month year | 12 |

---

## 🛠️ File Quick Reference

### For Web Display
**File**: `edergawi_calendar.jsx`
- React component
- Interactive navigation
- Responsive design
- Click Next/Previous for years

### For Calculations
**File**: `edergawi_calendar_utils.py`
- Python utility functions
- No external dependencies
- Easy import and use

### For Learning
**File**: `EDERGAWI_CALENDAR_GUIDE.md`
- Complete documentation
- Historical context
- Implementation details

### For Analysis
**File**: `PATTERN_ANALYSIS.md`
- How pattern was discovered
- Verification methods
- Mathematical proofs

---

## 🎯 Common Tasks

### Task 1: Check if a year has Alshar Alharam
```python
from edergawi_calendar_utils import EdergawiCalendar
has_ashar = EdergawiCalendar.has_ashar_alharam(2026)  # True
```

### Task 2: Get all months for a year
```python
months = EdergawiCalendar.get_months_for_year(2026)
# Returns list of 13 month dictionaries
```

### Task 3: Convert year to Edergawi era
```python
year, label = EdergawiCalendar.gregorian_to_edergawi(2026)
print(label)  # "5 AE"
```

### Task 4: Find Edergawi month for a date
```python
from datetime import datetime
date = datetime(2026, 9, 1)
month = EdergawiCalendar.find_month_for_gregorian_date(date)
print(month['english'])  # "Alshar Alharam"
```

### Task 5: Display full year calendar
```python
EdergawiCalendar.print_year_calendar(2026)
# Prints formatted calendar with all months
```

---

## 🌍 Alshar Alharam Cycle

The sacred 13th month appears in this pattern:

```
2022 → 2023 → (gap) → 2026 → (gap) → 2029 → (gap) → 2031 → ...
  ✓       ✓                ✓              ✓              ✓

Interval pattern: [1, 3, 3, 2, 3, 3, 2] years (then repeats)
Average: 2.125 years between appearances (or ~32 months)
```

---

## 💡 Key Concepts

### Lunar Month
- Synodic month (full moon to full moon) ≈ 29.53 days
- Edergawi months ≈ 29-30 days
- Close match shows proper lunar sync

### Full Moon Timing
- Observable astronomical event
- Repeats approximately every 29.53 days
- Marks the month boundary
- Day after full moon night = month start

### Sacred Month
- Alshar Alharam = "The Sacred Month"
- Ceremonial/cultural significance
- Similar to intercalary months in other calendars (Hebrew, etc.)
- Maintains year balance

---

## 📱 Navigation Guide

### In Web Calendar
1. **Start**: Year 2022 is displayed by default
2. **Forward**: Click "Next" button
3. **Backward**: Click "Previous" button
4. **Current Year**: Shows both Gregorian and Edergawi era
5. **Month Cards**: Each month shows Gregorian start date

### Before Year 2022
- Labeled as "X BE" (Before Edergawi)
- Calendar structure still applies
- Shows what calendar would have looked like retroactively

---

## 🔍 Verification Checklist

Use this to verify calendar correctness:

- [ ] Year has correct Edergawi era label (e.g., "5 AE" for 2026)
- [ ] First month (Muharram) starts January 8
- [ ] Alshar Alharam appears only in years 2023, 2026, 2029...
- [ ] Ramadan appears as 10th or 11th month
- [ ] Total of 12 or 13 months (13 only in Alshar years)
- [ ] Month names in both English and Arabic match
- [ ] Gregorian mapping makes sense (dates progress through year)

---

## 🎓 Learning Path

1. **Start Here**: Read this quick reference
2. **Understand**: Read EDERGAWI_CALENDAR_GUIDE.md
3. **Explore**: Use the interactive web calendar
4. **Verify**: Read PATTERN_ANALYSIS.md
5. **Develop**: Use Python utility or React component
6. **Integrate**: Add to your own projects

---

## 📞 Helpful Resources

| Resource | Purpose |
|----------|---------|
| `README.md` | Complete overview and integration guide |
| `EDERGAWI_CALENDAR_GUIDE.md` | Detailed documentation |
| `PATTERN_ANALYSIS.md` | How the pattern was discovered |
| `edergawi_calendar.jsx` | Interactive calendar web component |
| `edergawi_calendar_utils.py` | Python calculation tools |

---

## ⚡ Pro Tips

✓ **Always verify** calendar data for years beyond 2041 (pattern may change)

✓ **Use Python utility** for bulk calculations and batch processing

✓ **Use React component** for user-friendly interactive display

✓ **Check Alshar years** when planning multi-year projects

✓ **Store dates** in both Gregorian and Edergawi for clarity

✓ **Reference guide** when unsure about month order or properties

---

## 🎉 Features Summary

✓ 13 months (12 + Alshar Alharam)
✓ Lunar synchronization
✓ Precise cycle pattern (every 2.67 years)
✓ Astronomical basis (full moon)
✓ Gregorian mapping included
✓ Interactive web calendar
✓ Python utilities for calculations
✓ Complete documentation
✓ Forward & backward navigation
✓ Era system (AE/BE)

---

## Last Updated
**June 24, 2026 (5 AE)**

**Status**: ✓ Complete & Ready to Use

---

**For detailed information, consult the full documentation files.**
