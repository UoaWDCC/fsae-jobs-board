import { ResetPasswordForm } from '../../components/AuthForms/ResetPasswordForm';
import { Box } from '@mantine/core';
import styles from '../../styles/LoginPage.module.css';
import { useLocation } from 'react-router-dom';

export function ResetPassword() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const resetToken = urlParams.get('token'); // Extract the reset token from the URL

  return (
    <Box className={styles.wrapper}>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', height: '100%' }}>
        <ResetPasswordForm resetToken={resetToken} /> {/* Pass the reset token to the form */}
      </Box>
    </Box>
  );
}
