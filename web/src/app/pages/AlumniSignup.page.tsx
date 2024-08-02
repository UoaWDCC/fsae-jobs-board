import SignupForm from '../components/AuthForms/SignupForm';
import { Role } from '../type/role';
import classes from '../styles/LoginPage.module.css';
import { Box } from '@mantine/core';

export function AlumniSignUp() {
  return (
    <>
      <Box className={classes.wrapper}>
        <SignupForm role={Role.Alumni} />
      </Box>
    </>
  );
}
