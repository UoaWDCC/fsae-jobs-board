import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './global.css';
export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
      <ToastContainer />
    </MantineProvider>
  );
}
