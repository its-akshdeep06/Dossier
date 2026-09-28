export const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function validateUsername(raw) {
  const value = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '');
  if (!value) return { error: 'A username is required — try one of the examples below.' };
  if (!USERNAME_PATTERN.test(value)) {
    return { error: 'GitHub usernames use letters, numbers and single hyphens (up to 39 characters).' };
  }
  return { value };
}