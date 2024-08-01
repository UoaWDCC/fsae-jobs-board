import { Flex, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import classes from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType } from '../../features/user/userSlice';
import { toast } from 'react-toastify';

export function LoginForm() {
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
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={classes.loginFormContainer}
    >
      <form className={classes.form}>
        <Title order={3} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput placeholder="Enter email" size="lg" mb="lg" />
        <PasswordInput placeholder="Enter password" mt="xl" size="lg" />
        <Checkbox label="Remember Me" mt="xl" size="md" />
        <Button fullWidth mt="xl" mb="md" size="lg">
          Login
        </Button>
        <Flex justify="center" gap="md" mt="md" mr="md">
          <Button variant="filled" color="green" onClick={() => handleLoginAs('student')}>
            Student
          </Button>
          <Button variant="filled" color="blue" onClick={() => handleLoginAs('sponsor')}>
            Sponsor
          </Button>
          <Button variant="filled" color="violet" onClick={() => handleLoginAs('alumni')}>
            Alumni
          </Button>
          <Button variant="filled" color="red" onClick={() => handleLoginAs('admin')}>
            Admin
          </Button>
        </Flex>
        <Text ta="center" mt="xl">
          Don&apos;t have an account?{' '}
          <NavLink to="/" className={classes.link}>
            Sign up
          </NavLink>
        </Text>
        <Text ta="center" mt="md">
          Forget your{' '}
          <NavLink to="/" className={classes.link}>
            password?
          </NavLink>
        </Text>
      </form>
    </Flex>
  );
}
