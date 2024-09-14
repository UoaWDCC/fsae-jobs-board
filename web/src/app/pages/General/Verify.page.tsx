import { VerifyForm } from '../../components/AuthForms/VerifyForm';
import { Box } from '@mantine/core';
import styles from '../../styles/LoginPage.module.css';

// Usage: <Verify email={email} /> when passing an email to this component 
// from another component or page like the registration page or login page

interface VerifyProps {
  email: string;
}

export function Verify({ email }: VerifyProps) {
  return (
    <Box className={styles.wrapper}>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', height: '100%' }}>
        <VerifyForm email={email} />
      </Box>
    </Box>
  );
}
