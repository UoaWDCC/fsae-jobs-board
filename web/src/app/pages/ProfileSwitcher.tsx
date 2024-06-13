import { useLocation, Navigate } from 'react-router-dom';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

function ProfileSwitcher() {
  // Not directly used here, but could be for future enhancements (e.g., conditional redirects)
  const location = useLocation();

  // Type the useSelector result using RootState
  const userType = useSelector((state: RootState) => state.user.userType);

  // Explicit type for the profilePath object
  const profilePath: Record<string, string> = {
    student: '/profile/student',
    sponsor: '/profile/sponsor',
    alumni: '/profile/alumni',
  };

  // Conditional logic for redirection based on userType
  if (!userType) {
    return <Navigate to="/login" />; // Handle the case where userType is undefined
  }

  // Ensure userType is a valid key for profilePath
  const redirectPath = profilePath[userType] || '/profile/student'; // Default to student profile

  return <Navigate to={redirectPath} replace />;
}

export default ProfileSwitcher;
