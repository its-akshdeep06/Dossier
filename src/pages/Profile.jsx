import { useParams } from 'react-router-dom';
import PageTransition from '@/components/shared/PageTransition';
import ErrorState from '@/components/profile/ErrorState';
import ProfileView from '@/components/profile/ProfileView';
import { USERNAME_PATTERN } from '@/lib/validate';

export default function Profile() {
  const { username } = useParams();
  if (!USERNAME_PATTERN.test(username)) {
    return <PageTransition><ErrorState error={{ type: 'invalid' }} username={username} /></PageTransition>;
  }
  return <ProfileView key={username.toLowerCase()} username={username} />;
}