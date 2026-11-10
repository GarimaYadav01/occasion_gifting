export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export const pctOff = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const monthName = (m: number) => MONTHS[m];
export const dayName = (d: number) => DAYS[d];

export const fmtDate = (iso?: string, withDay = false) => {
  if (!iso) { return '—'; }
  const d = new Date(iso);
  return `${withDay ? DAYS[d.getDay()] + ', ' : ''}${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const fmtShort = (iso?: string) => {
  if (!iso) { return '—'; }
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export const addDays = (n: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

export const relativeDay = (iso: string) => {
  const d = new Date(iso);
  const t = new Date();
  const a = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const b = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  const diff = Math.round((a - b) / 86400000);
  if (diff === 0) { return 'Today'; }
  if (diff === 1) { return 'Tomorrow'; }
  if (diff === -1) { return 'Yesterday'; }
  return fmtShort(iso);
};

/** Days until the next yearly recurrence of a YYYY-MM-DD date. */
export const daysUntilYearly = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  let next = new Date(t.getFullYear(), m - 1, d);
  if (next < t) { next = new Date(t.getFullYear() + 1, m - 1, d); }
  return Math.round((next.getTime() - t.getTime()) / 86400000);
};

export const genId = (prefix: string) => prefix + Math.floor(10000 + Math.random() * 89999);
