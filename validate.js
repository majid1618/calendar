const fs = require('fs');
const path = require('path');
const eng = require('./desktop/src/utils/edergawiEngine');

const GREG_NUM = {January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};

const csv = fs.readFileSync(path.join(__dirname, 'verify.csv'), 'utf-8');
const lines = csv.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('Arabic Name'));

let currentYear = null;
const expected = [];

for (const line of lines) {
  const yearMatch = line.match(/^(\d{4}):$/);
  if (yearMatch) {
    currentYear = parseInt(yearMatch[1]);
    continue;
  }
  if (currentYear === null) continue;
  const parts = line.split(',');
  if (parts.length !== 4) continue;
  const [arabic, english, gregMonth, dayStr] = parts;
  const day = parseInt(dayStr);
  const gregM = GREG_NUM[gregMonth];
  if (!gregM) {
    console.log(`WARN: Unknown Gregorian month "${gregMonth}" for ${english} ${currentYear}`);
    continue;
  }
  expected.push({ year: currentYear, english, arabic, gregMonth: gregM, day });
}

let totalMatch = 0, totalMismatch = 0, totalExpected = 0;
const mismatches = [];

const years = [...new Set(expected.map(e => e.year))].sort((a,b) => a-b);

for (const year of years) {
  const yearExpected = expected.filter(e => e.year === year);
  const aeYear = eng.gregToAEYear(year);

  process.stdout.write(`\n${year} (AE ${aeYear}): `);

  let yearTotal = 0, yearMatch = 0, yearMiss = 0;

  for (const exp of yearExpected) {
    // Determine the engine's month index for this expected month
    // Try looking up by English name in this Gregorian year
    let found = false;

    const months = eng.getMonthsForYear(year);
    for (let mi = 0; mi < months.length; mi++) {
      const m = months[mi];
      const mName = m.english.replace('Alshahr', 'Alshar');
      const eName = exp.english.replace('Alshahr', 'Alshar');
      if (mName === eName) {
        found = true;
        totalExpected++;
        yearTotal++;

        // The expected date from CSV
        const expDate = new Date(year, exp.gregMonth - 1, exp.day);
        // The engine's start date for this month
        const engDate = m.startDate;

        const expStr = `${String(exp.gregMonth).padStart(2,'0')}-${String(exp.day).padStart(2,'0')}`;
        const engStr = `${String(engDate.getMonth()+1).padStart(2,'0')}-${String(engDate.getDate()).padStart(2,'0')}`;
        const diff = Math.round((engDate - expDate) / 86400000);

        if (diff === 0) {
          totalMatch++;
          yearMatch++;
        } else {
          totalMismatch++;
          yearMiss++;
          mismatches.push({ year, month: exp.english, expDate: expStr, engDate: engStr, diff });
        }
        break;
      }
    }
    if (!found) {
      process.stdout.write(`[${exp.english} NOT FOUND] `);
    }
  }

  const pct = yearTotal > 0 ? Math.round(yearMatch / yearTotal * 100) : 0;
  process.stdout.write(`${yearMatch}/${yearTotal} (${pct}%)`);
}

const total = totalMatch + totalMismatch;
const pct = total > 0 ? Math.round(totalMatch / total * 100) : 0;
console.log(`\n\n=== SUMMARY ===`);
console.log(`Total: ${totalMatch}/${total} matched (${pct}%)`);
console.log(`Mismatches: ${totalMismatch}`);

if (mismatches.length > 0) {
  console.log(`\nDetailed mismatches (first 30):`);
  for (const m of mismatches.slice(0, 30)) {
    console.log(`  ${m.year} ${m.month}: expected ${m.expDate}, got ${m.engDate} (diff ${m.diff}d)`);
  }
  if (mismatches.length > 30) {
    console.log(`  ... and ${mismatches.length - 30} more`);
  }
}
