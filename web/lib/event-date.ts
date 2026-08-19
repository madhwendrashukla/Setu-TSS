// How an event's date and time are written on the public site.
//
// 🔴 THIS EXISTS BECAUSE THE OLD ONE-LINER PRODUCED "Jul 27–2026 (day: 29)".
// The range branch formatted the end date as
//   end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })
// and en-US has NO pattern for "day + year without a month". ICU falls back to
// printing the year and then appending the day as a LABELLED field, so a
// three-day workshop advertised itself as "JUL 27–2026 (DAY: 29) @ 6:00 PM".
// Never ask toLocaleDateString for a field combination a locale does not have.
//
// 🔴 AND timeZone IS PINNED TO UTC ON PURPOSE. Event dates are stored as a
// calendar date at UTC midnight ("2026-07-27T00:00:00.000Z"). Formatted in the
// viewer's own zone, every visitor west of UTC sees the day BEFORE the one the
// admin typed, and the server (UTC) and the browser disagree — which is why
// these call sites carry suppressHydrationWarning. Pinning UTC means the date
// on screen is the date in the database, for everyone.

type DateInput = string | number | Date | null | undefined;

const MONTH_DAY = { month: 'short', day: 'numeric', timeZone: 'UTC' } as const;
const MONTH_DAY_YEAR = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' } as const;

function parse(value: DateInput): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Same calendar day in UTC — not the same instant. */
function sameUtcDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear()
    && a.getUTCMonth() === b.getUTCMonth()
    && a.getUTCDate() === b.getUTCDate();
}

/**
 * "Jul 27, 2026"          — one day
 * "Jul 27–29, 2026"       — same month
 * "Jul 27 – Aug 2, 2026"  — same year
 * "Dec 30, 2026 – Jan 2, 2027" — spans a year
 */
export function formatEventDateRange(startInput: DateInput, endInput: DateInput): string {
  const start = parse(startInput);
  if (!start) return '';
  const end = parse(endInput);

  if (!end || sameUtcDay(start, end) || end < start) {
    return start.toLocaleDateString('en-US', MONTH_DAY_YEAR);
  }
  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${start.toLocaleDateString('en-US', MONTH_DAY_YEAR)} – ${end.toLocaleDateString('en-US', MONTH_DAY_YEAR)}`;
  }
  if (start.getUTCMonth() !== end.getUTCMonth()) {
    return `${start.toLocaleDateString('en-US', MONTH_DAY)} – ${end.toLocaleDateString('en-US', MONTH_DAY_YEAR)}`;
  }
  // Same month: "Jul 27–29, 2026" — the day alone is safe here because the
  // month and year are already carried by the start half.
  return `${start.toLocaleDateString('en-US', MONTH_DAY)}–${end.getUTCDate()}, ${end.getUTCFullYear()}`;
}

/** The date, plus the admin-entered time when there is one: "Jul 27–29, 2026 @ 6:00 PM". */
export function formatEventWhen(event: {
  start_date?: DateInput;
  end_date?: DateInput;
  start_time?: string | null;
  end_time?: string | null;
}): string {
  const date = formatEventDateRange(event.start_date, event.end_date);
  const from = event.start_time?.trim();
  if (!from) return date;
  const to = event.end_time?.trim();
  return `${date} @ ${to ? `${from} - ${to}` : from}`;
}
