import SignupForm from '../components/AuthForms/SignupForm';
import { Role } from '../type/role';
import classes from "./page.module.css"

export function AlumniSignUp() {
  return (
    <>
      <div className={classes.wrapper}>
        <SignupForm role={Role.Alumni} />
      </div>
    </>
  );
}
