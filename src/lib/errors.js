import { format, formatDistanceToNowStrict } from 'date-fns';

const resetText = (error) =>
  error.resetAt ? `at ${format(error.resetAt, 'HH:mm')} (in ${formatDistanceToNowStrict(error.resetAt)})` : 'within the hour';

export function describeError(error, username) {
  switch (error?.type) {
    case 'invalid':
      return { stamp: 'Invalid', title: `“${username}” isn't a valid GitHub username.`, body: 'Usernames contain only letters, numbers and single hyphens, and cannot start or end with a hyphen.', canRetry: false };
    case 'not_found':
      return { stamp: 'No record', title: `There's no file for @${username}.`, body: 'GitHub has no public account under this username. Usernames are exact — check the spelling and try again.', canRetry: false };
    case 'rate_limit':
      return { stamp: 'Rate limited', title: "GitHub's public request limit has been reached.", body: `Without signing in, GitHub allows 60 API requests per hour from your network. The profile may be perfectly fine — the limit resets ${resetText(error)}.`, canRetry: true };
    case 'network':
      return { stamp: 'No signal', title: "GitHub couldn't be reached.", body: 'The request never made it — you may be offline, or GitHub may be unreachable from your network right now.', canRetry: true };
    default:
      return { stamp: `Error ${error?.status ?? ''}`.trim(), title: 'GitHub returned an unexpected response.', body: error?.message || 'The GitHub API failed to answer this request.', canRetry: true };
  }
}

export function shortError(error) {
  switch (error?.type) {
    case 'rate_limit': return `GitHub's public API limit was reached. It resets ${resetText(error)}.`;
    case 'network': return "GitHub couldn't be reached. Check your connection.";
    case 'not_found': return 'GitHub no longer has this data.';
    default: return `GitHub returned an error${error?.status ? ` (${error.status})` : ''}.`;
  }
}