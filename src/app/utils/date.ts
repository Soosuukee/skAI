export function formatLocalDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseYYYYMMDDToLocalDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map((v) => Number(v));
  if (!y || !m || !d) return undefined;
  // Construct date in local timezone at midday to avoid DST issues
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}


