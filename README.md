# Edergawi Calendar System - Complete Implementation

Welcome to the **Edergawi Calendar** (تقويم العديرقاوي) - A sophisticated lunar calendar system that bridges astronomy and culture!

## 📋 Project Overview

This package contains a complete implementation of the Edergawi Calendar system, which:
- Begins in 2022 as the base year
- Contains 12 or 13 months per year (13 when Alshahr Alharam appears)
- Syncs with lunar events (full moon timing) using the **Meeus full moon algorithm**
- Month starts the day after an astronomical full moon (FM+1 rule)
- Maps to the Gregorian calendar for practical use
- Provides both interactive and programmatic interfaces

## 📦 Files Included

### 1. **edergawi_calendar.jsx** - Interactive Web Calendar
**Purpose**: User-friendly React component for viewing and navigating the calendar

**Features**:
- Beautiful gradient UI with responsive design
- Navigate forward/backward through years
- View all 12-13 months for each year
- See both Edergawi and Gregorian dates side-by-side
- Highlighted calendar days showing month duration
- Visual indicator for years with Alshar Alharam

**How to Use**:
```bash
# Install dependencies if needed
npm install

# Use in your React application:
import EdergawiCalendar from './edergawi_calendar.jsx';

// Then render it:
<EdergawiCalendar />
```

**Customization**:
- Change colors by modifying the Tailwind CSS classes
- Adjust the grid layout for different screen sizes
- Add event listeners or callbacks for specific dates

---

### 2. **edergawi_calendar_utils.py** - Python Utility Library
**Purpose**: Programmatic access to calendar calculations and conversions

**Key Functions**:

#### Basic Queries
```python
from edergawi_calendar_utils import EdergawiCalendar

# Check if a year has Alshar Alharam
has_ashar = EdergawiCalendar.has_ashar_alharam(2026)  # Returns: True

# Get all months for a year
months = EdergawiCalendar.get_months_for_year(2026)

# Get information about a specific month
month_info = EdergawiCalendar.get_month_info(2026, 9)  # Month 9
```

#### Conversions
```python
# Convert Gregorian to Edergawi era
year, era_label = EdergawiCalendar.gregorian_to_edergawi(2026)
print(era_label)  # Output: "5 AE" (5 years After Edergawi)

# Convert Edergawi to Gregorian
gregorian_year = EdergawiCalendar.edergawi_to_gregorian(5, is_ae=True)
# Output: 2026
```

#### Date Finding
```python
from datetime import datetime

# Find which Edergawi month a Gregorian date falls into
date = datetime(2026, 9, 1)
edergawi_month = EdergawiCalendar.find_month_for_gregorian_date(date)
print(edergawi_month['english'])  # Output: "Alshar Alharam"

# Get Gregorian start date for an Edergawi month
start_date = EdergawiCalendar.get_gregorian_date_for_month(2026, 9)
print(start_date)  # Output: 2026-09-01
```

#### Comprehensive Information
```python
# Get all information about a year
year_info = EdergawiCalendar.get_year_info(2026)
print(year_info['has_ashar_alharam'])  # True
print(year_info['total_months'])       # 13

# Print formatted calendar
EdergawiCalendar.print_year_calendar(2026)
```

**Installation**:
- No external dependencies required (uses only standard library)
- Just copy the file and import it

**Usage Examples**:
```bash
# Run the utility directly to see examples:
python3 edergawi_calendar_utils.py
```

---

### 3. **EDERGAWI_CALENDAR_GUIDE.md** - Detailed Documentation
**Purpose**: Complete reference guide for understanding the calendar

**Contents**:
- Calendar structure and month names
- Astronomical rules and definitions
- Alshar Alharam cycle pattern
- Era system (AE/BE)
- Usage examples
- Implementation details for developers
- Historical and cultural context

**How to Use**:
- Reference for understanding the calendar system
- Use as documentation for integration into other projects
- Share with users to explain the calendar

---

## 🚀 Quick Start

### For Web Users
1. Use the interactive React calendar (`edergawi_calendar.jsx`)
2. Navigate through years using Previous/Next buttons
3. Click on any year to see all 13 (or 12) months
4. Check if a year has Alshar Alharam (marked with ✦)

### For Developers (Python)
```python
from edergawi_calendar_utils import EdergawiCalendar

# Example: Create a calendar for 2026
year = 2026
year_info = EdergawiCalendar.get_year_info(year)

for month in year_info['months']:
    print(f"{month['english']}: {month['gregorian_month']}")
```

### For Developers (JavaScript/React)
```javascript
import EdergawiCalendar from './edergawi_calendar.jsx';

export default function App() {
  return <EdergawiCalendar />;
}
```

---

## 📅 Calendar Highlights

### The 13 Months
| Month | Arabic | Gregorian | Notes |
|-------|--------|-----------|-------|
| Muharram | محرم | January | 1st month |
| Saffar | صفر | February | 2nd month |
| ... | ... | ... | ... |
| **Alshar Alharam** | **الشهر الحرام** | **Variable** | **Every 2.67 years** ✦ |
| Ramadan | رمضان | September | Sacred month of fasting |
| ... | ... | ... | ... |

### Special Features
- **Full Moon Basis**: Months start the day after the full moon night
- **Sacred Month**: Alshar Alharam adds cultural/ceremonial significance
- **Predictable**: The Alshar Alharam cycle is mathematically precise
- **Practical**: Synchronized with Gregorian calendar

### Years with Alshar Alharam (2022-2050)
✓ 2023, 2026, 2029, 2031, 2034, 2037, 2039, 2042, 2044, 2047, 2050

---

## 🔧 Integration Examples

### Add to Your Website
```html
<!-- React component -->
<div id="root"></div>
<script>
  import EdergawiCalendar from './edergawi_calendar.jsx';
  
  ReactDOM.render(
    <EdergawiCalendar />,
    document.getElementById('root')
  );
</script>
```

### Use in Your Python Project
```python
import sys
sys.path.append('path/to/edergawi_calendar')

from edergawi_calendar_utils import EdergawiCalendar

class EventScheduler:
    def schedule_event(self, gregorian_date, event_name):
        edergawi_month = EdergawiCalendar.find_month_for_gregorian_date(gregorian_date)
        print(f"{event_name} scheduled for {edergawi_month['english']}")
```

### API/Server Integration
```python
from flask import Flask, jsonify
from edergawi_calendar_utils import EdergawiCalendar

app = Flask(__name__)

@app.route('/api/calendar/<int:year>')
def get_calendar(year):
    year_info = EdergawiCalendar.get_year_info(year)
    return jsonify(year_info)

@app.route('/api/date/<date_str>')
def get_month_for_date(date_str):
    from datetime import datetime
    date = datetime.fromisoformat(date_str)
    month = EdergawiCalendar.find_month_for_gregorian_date(date)
    return jsonify(month)
```

---

## 🌍 Use Cases

### Educational
- Teach about lunar calendars and astronomy
- Demonstrate calendar systems and synchronization
- Explore cultural timekeeping traditions

### Cultural/Religious
- Track important dates in Edergawi tradition
- Plan ceremonies around Alshar Alharam
- Organize events by month name

### Business
- Schedule events using an alternative calendar
- Create dual-calendar applications
- International project coordination

### Scientific
- Study lunar-solar calendar alignment
- Analyze astronomical timing
- Research calendar systems

---

## 🎨 Customization

### Styling the Web Calendar
Edit `edergawi_calendar.jsx` colors:
```jsx
// Change header gradient
className="bg-gradient-to-r from-amber-600 to-orange-600"

// Modify background
className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"

// Change button colors
className="bg-amber-600 hover:bg-amber-700"
```

### Extending the Python Library
Add custom features:
```python
class ExtendedEdergawi(EdergawiCalendar):
    @classmethod
    def get_holidays(cls, year):
        # Add holiday definitions
        return {}
    
    @classmethod
    def get_month_duration(cls, year, month_number):
        # Return actual duration (29 or 30 days)
        return 29  # or 30
```

---

## 🐛 Troubleshooting

### React Calendar Not Displaying
- Ensure React and lucide-react are installed
- Check that Tailwind CSS is configured
- Verify component import path

### Python Utility Errors
- Check Python version (3.6+)
- Verify no circular imports
- Test with provided examples first

### Month Calculations Off
- Verify the year is within supported range (2022+)
- Check date format for conversions
- Consult the documentation for edge cases

---

## 📊 Data Structure Reference

### Month Object
```javascript
{
  english: "Muharram",
  arabic: "محرم",
  gregorian_month: "January",
  start_day: 8
}
```

### Year Info Object
```javascript
{
  gregorian_year: 2026,
  edergawi_year: 5,
  era_label: "5 AE",
  has_ashar_alharam: true,
  total_months: 13,
  months: [/* array of month objects */]
}
```

---

## 🔐 Version Information

- **Calendar Base Year**: 2022
- **Current Implementation**: v1.0
- **Supported Range**: 2000 CE onwards (with conversion)
- **Last Updated**: 2026

---

## 📖 Documentation

For detailed information about:
- **Calendar structure**: See `EDERGAWI_CALENDAR_GUIDE.md`
- **API reference**: See code comments in `.jsx` and `.py` files
- **Examples**: Run `python3 edergawi_calendar_utils.py`

---

## 🤝 Support & Contribution

### Questions?
Refer to the comprehensive guide or example code

### Want to extend?
1. Study the existing implementations
2. Follow the same patterns
3. Add your features to either the Python or React implementation

### Integration Help
The modular design allows easy integration with:
- Web frameworks (Flask, Django, Next.js)
- Mobile apps (React Native, Flutter)
- Desktop applications (Electron, PyQt)
- Server backends (Node.js, Python)

---

## 📝 License & Attribution

The Edergawi Calendar System is presented as an educational and cultural resource.

---

## 🌟 Key Takeaways

✓ **Complete System**: Web UI + Python utilities + Full documentation
✓ **Easy to Use**: Simple functions for common operations
✓ **Well Documented**: Guide, code comments, and examples
✓ **Flexible**: Use interactively or programmatically
✓ **Accurate**: Based on provided data and pattern analysis
✓ **Extensible**: Designed for easy customization

---

**Enjoy exploring the Edergawi Calendar! 🗓️✨**

For the latest updates and more information, consult the included documentation files.
