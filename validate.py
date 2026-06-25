from edergawi_calendar_utils import get_edergawi_year

GREG_REV = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
}
GREG_NAMES = {v: k for k, v in GREG_REV.items()}
BASE_YEAR = 2022

def greg_to_ae(gy):
    if gy >= BASE_YEAR:
        return gy - BASE_YEAR + 1
    return -(BASE_YEAR - gy)

lines = open('verify.csv').read().strip().split('\n')
lines = [l for l in lines if not l.startswith('Arabic Name')]

errors = []
total = 0
current_year = None

for line in lines:
    line = line.strip()
    if not line:
        continue
    if line.endswith(':'):
        current_year = int(line.rstrip(':'))
        continue
    parts = line.split(',')
    if len(parts) < 4:
        continue
    arabic = parts[0].strip()
    english = parts[1].strip()
    greg_month_str = parts[2].strip()
    day_str = parts[3].strip()
    day = int(day_str)
    greg_month_num = GREG_REV[greg_month_str]
    total += 1
    ae = greg_to_ae(current_year)
    yi = get_edergawi_year(ae)
    found = None
    for m in yi['months']:
        if m['english'] == english:
            found = m
            break
    if found is None:
        errors.append(f'{current_year} {english}: month not found')
        continue
    actual_gy = found['gregYear']
    actual_gm_str = found['gregorian']
    actual_day = found['startDay']
    actual_gm = GREG_REV[actual_gm_str]
    expected_gy = current_year
    if actual_gy != expected_gy:
        errors.append(f'{current_year} {english}: expected year {expected_gy} got {actual_gy}')
        continue
    if actual_gm != greg_month_num:
        errors.append(f'{current_year} {english}: expected greg month {greg_month_str} got {actual_gm_str}')
        continue
    if actual_day != day:
        diff = actual_day - day
        errors.append(f'{current_year} {english}: expected day {day} got {actual_day} diff={diff}')
        continue

match_count = total - len(errors)
pct = 100.0 * match_count / total if total > 0 else 0
print(f'Total: {total}, Matches: {match_count}, Errors: {len(errors)}, Match rate: {pct:.1f}%')
if errors:
    print('\nErrors:')
    for e in errors:
        print(e)
