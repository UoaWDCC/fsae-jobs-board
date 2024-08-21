import SignupForm from '../../components/AuthForms/SignupForm';
import { Role } from '../../type/role';
import styles from '../../styles/LoginPage.module.css';
import { Box } from '@mantine/core';

export function AlumniSignUp() {
  return (
    <>
      <Box className={styles.wrapper}>
        <SignupForm role={Role.Alumni} />
      </Box>
    </>
  );
}
