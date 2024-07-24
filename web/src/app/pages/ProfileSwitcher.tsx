import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

function ProfileSwitcher() {
  // Not directly used here, but could be for future enhancements (e.g., conditional redirects)
  const location = useLocation();

  // Type the useSelector result using RootState
  const userType = useSelector((state: RootState) => state.user.userType);

  if (!userType) {
    // Handle undefined userType (user not logged in or authentication not yet determined)
    return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login
  }

  return <Outlet />;
}

export default ProfileSwitcher;
