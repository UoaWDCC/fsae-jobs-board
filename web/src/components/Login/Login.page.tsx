import classes from './Login.module.css';
import LoginForm from './Login.forms';
import { useDocumentTitle, useFavicon } from '@mantine/hooks';

export function LoginPage() {
    useFavicon('/src/images/favicon.png');
    useDocumentTitle('F:SAE:47 Job Board | Login');

    return (
        <div className={classes.halvedPage}>
            <div className={classes.leftHalf}>
                <center>
                    Image Placeholder
                </center>
            </div>
            <div className={classes.rightHalf}>
                <div className={classes.logo}>
                    <img src="/src/images/logo.png" alt="logo"/>
                </div>
                <div className = {classes.formContainer}>
                    <h1>Log In</h1>
                    <LoginForm/>
                    <br/>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                    <p>Forgot your password? <a href="/forgot-password">Reset Password</a></p>
                </div>
            </div>
        </div>
    );
}
