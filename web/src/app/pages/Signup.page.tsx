import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import SignupForm from '../components/AuthForms/SignupForm';
import classes from './page.module.css';

export function SignUp() {
  return (
    <>
      {/* Temporary buttons for route testing */}

      <div className={classes.wrapper}>
        {/* Temporary buttons for protected routes testing purpose*/}
        <div className={classes.banner}>
          <NavLink to="/">
            <Button variant="filled" color="customPapayaOrange">
              Home
            </Button>
          </NavLink>
          <NavLink to="/login">
            <Button color="customAzureBlue">Log in</Button>
          </NavLink>
        </div>
        <SignupForm />
      </div>
    </>
  );
}
