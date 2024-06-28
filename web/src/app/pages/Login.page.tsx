import { Button, Flex, Image, Title } from '@mantine/core';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { LoginForm } from '../components/AuthForms/LoginForm';
import classes from './page.module.css';
import logo from '../assets/images/logo.png';

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
    <div className={classes.wrapper}>
      {/* Temporary buttons for protected routes testing purpose*/}
      <div className={classes.banner}>
        <NavLink to="/" className={classes.logo}>
          <Image h={25} src={logo} fit="contain" />
        </NavLink>
      </div>
      <LoginForm />
    </div>
  );
}
