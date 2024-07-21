import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { LoginForm } from '../components/AuthForms/LoginForm';
import { LoginSideImage } from '../components/LoginSideImage/LoginSideImage';
import { Grid, GridCol } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const handleLoginAs = (userType: 'student' | 'sponsor' | 'alumni' | 'admin') => {
    // Simulate successful login (to be replaced with the actual authentication logic)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    localStorage.setItem('accessToken', mockToken);
    // If authentication is successful: Update Redux store with userType
    dispatch(setUserType(userType));
    // Redirect to the appropriate profile page based on userType
    const profilePath = {
      student: '/profile/student',
      sponsor: '/profile/sponsor',
      alumni: '/profile/alumni',
      admin: '/profile/admin',
    }[userType];
    toast.success('Logged in as ' + userType);
    navigate(profilePath, { replace: true });
  };
  return (
    <Grid>
      {isSmallScreen ? (
        <Grid.Col span={12}>
          <LoginForm />
        </Grid.Col>
      ) : (
        <>
          <Grid.Col span={6}>
            <LoginSideImage />
          </Grid.Col>
          <Grid.Col span={6}>
            <LoginForm />
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
