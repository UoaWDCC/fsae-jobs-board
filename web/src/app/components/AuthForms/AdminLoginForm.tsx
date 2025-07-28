import {
  Flex,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  useMantineTheme,
} from '@mantine/core';
import styles from './authform.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../../features/user/userSlice';
import { toast } from 'react-toastify';

export function AdminLoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const handleLoginAs = (role: 'member' | 'sponsor' | 'alumni' | 'admin') => {
    // Simulate successful login (to be replaced with the actual authentication logic)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ...';
    localStorage.setItem('accessToken', mockToken);
    // If authentication is successful: Update Redux store with role
    dispatch(setRole(role));
    // Redirect to the appropriate profile page based on role
    const profilePath = {
      member: '/profile/member',
      sponsor: '/profile/sponsor',
      alumni: '/profile/alumni',
      admin: '/profile/admin',
    }[role];
    toast.success('Logged in as ' + role);
    navigate(profilePath, { replace: true });
  };

  const handleLogin = () => {
    console.log('Login button clicked');
  };

  return (
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={styles.loginFormContainer}
    >
      <form className={styles.form}>
        <Title order={3} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput placeholder="Enter email" size="lg" mb="lg" />
        <PasswordInput placeholder="Enter password" mt="xl" size="lg" />
        <Checkbox label="Remember Me" mt="xl" size="md" />
        <Button
          fullWidth
          mt="xl"
          mb="md"
          size="lg"
          color={theme.colors.customPapayaOrange[1]}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Flex justify="center" gap="md" mt="md" mr="md">
          <Button variant="filled" color="red" onClick={() => handleLoginAs('admin')}>
            Temp Admin Login
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
