import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex, Title } from '@mantine/core';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType } from '../features/user/userSlice';
import { toast } from 'react-toastify';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <>
      {/* Temporary buttons for protected routes testing purpose*/}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/signup">
          <Button variant="filled" color="customPapayaOrange">
            Sign up
          </Button>
        </NavLink>
        <NavLink to="/">
          <Button color="customAzureBlue">Home</Button>
        </NavLink>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Login Page</Title>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Button variant="filled" color="green" onClick={() => handleLoginAs('student')}>
          Login as Student
        </Button>
        <Button variant="filled" color="blue" onClick={() => handleLoginAs('sponsor')}>
          Login as Sponsor
        </Button>
        <Button variant="filled" color="violet" onClick={() => handleLoginAs('alumni')}>
          Login as Alumni
        </Button>
        <Button variant="filled" color="red" onClick={() => handleLoginAs('admin')}>
          Login as Admin
        </Button>
      </Flex>
      <ColorSchemeToggle />
    </>
  );
}
