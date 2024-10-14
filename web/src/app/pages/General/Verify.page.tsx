import { VerifyForm } from '../../components/AuthForms/VerifyForm';
import { Box } from '@mantine/core';
import styles from '../../styles/LoginPage.module.css';

export function Verify() {
  return (
    <Box className={styles.wrapper}>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', height: '100%' }}>
        <VerifyForm />
      </Box>
    </Box>
  );
}
