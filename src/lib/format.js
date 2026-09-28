import { format, formatDistanceToNowStrict } from 'date-fns';

const compactFmt = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fullFmt = new Intl.NumberFormat('en');

export const compact = (n) => compactFmt.format(n ?? 0);
export const full = (n) => fullFmt.format(Math.round(n ?? 0));
export const smart = (n) => (n >= 100000 ? compact(n) : full(n));
export const date = (iso) => format(new Date(iso), 'MMM d, yyyy');
export const ago = (iso) => `${formatDistanceToNowStrict(new Date(iso))} ago`;
export const bytes = (n) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`;
export const href = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
export const stripProtocol = (url) => url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
export const pct = (share) => (share * 100).toFixed(share < 0.1 ? 1 : 0);
export const avatar = (url, size) => `${url}${url.includes('?') ? '&' : '?'}s=${size}`;