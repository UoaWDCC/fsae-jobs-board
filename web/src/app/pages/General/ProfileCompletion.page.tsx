import { Container } from '@mantine/core';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ProfileCompletion } from '../../components/ProfileCompletion/ProfileCompletion';
import { RootState } from '../../store';

export function ProfileCompletionPage() {
  const userId = useSelector((state: RootState) => state.user.id);
  const userRole = useSelector((state: RootState) => state.user.role);

  // Redirect to login if not authenticated
  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container size="md" py="xl">
      <ProfileCompletion userId={userId} userRole={userRole} />
    </Container>
  );
}