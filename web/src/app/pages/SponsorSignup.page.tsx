import SignupForm from '../components/AuthForms/SignupForm';
import { Role } from '../type/role';
import classes from './page.module.css';

export function SponsorSignUp() {
  return (
    <>
      <div className={classes.wrapper}>
        <SignupForm role={Role.Sponsor} />
      </div>
    </>
  );
}
