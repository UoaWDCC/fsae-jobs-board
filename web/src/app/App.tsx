import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './global.css';
import '@mantine/carousel/styles.css';
import { useDispatch } from 'react-redux';
import { setRole } from './features/user/userSlice';
import { jwtDecode } from 'jwt-decode';
import { Role, stringToRole } from './type/role';
import { useEffect } from 'react';

export default function App() {
  const dispatch = useDispatch();
  //Keep track of the role of the user
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<{role?: string}>(token);
        if (decoded.role) {
          const roleEnum = stringToRole(decoded.role);
          dispatch(setRole(roleEnum));
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('accessToken');
      }
    }
  }, [dispatch]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router />
      
    </MantineProvider>
  );
}
