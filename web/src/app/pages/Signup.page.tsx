import SignupForm from '../components/AuthForms/SignupForm';
import classes from './page.module.css';

export function SignUp() {
  return (
    <>
      {/* Temporary buttons for route testing */}

      <div className={classes.wrapper}>
        <SignupForm />
      </div>
    </>
  );
}
