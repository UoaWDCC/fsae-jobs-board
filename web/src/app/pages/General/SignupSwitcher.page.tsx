import { useLocation, Outlet, Navigate } from 'react-router-dom';

function SignupSwitcher() {
  // Not directly used here, but could be for future enhancements (e.g., conditional redirects)
  const location = useLocation();

  return <Outlet />;
}

export default SignupSwitcher;
