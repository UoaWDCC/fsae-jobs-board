// import { Login } from '../components/Login/Login';
import classes from '../components/Login/Login.module.css'
import LoginForm from '../components/Login/Login.forms';
import { Grid, Image, Title, Text, Anchor} from '@mantine/core';
import { useDocumentTitle, useFavicon, useMediaQuery} from '@mantine/hooks';

export function LoginPage() {
    const isNotMobile = useMediaQuery('(min-width: 769px)');
    useFavicon('/src/images/favicon.png');
    useDocumentTitle('F:SAE:47 Job Board | Login');

    return (
    <>
        <Grid>
            {isNotMobile && (
                <Grid.Col className={classes.leftHalf} span={6}>
                    <Text>Left Half</Text>
                </Grid.Col>
            )}
            <Grid.Col className={classes.rightHalf} span={isNotMobile ? 6 : 12}>
                <Image src="../src/images/logo.png" alt="logo" className={classes.logo} />
                <Text className={classes.title}>Login</Text>
                <LoginForm />
                <Text className={classes.registerMessage} ta='center'>
                    Don't have an account?&nbsp;
                    <Anchor>Register</Anchor>
                </Text>
                <Text className={classes.resetPasswordMessage} ta='center'>
                    Forgot your password?&nbsp;
                    <Anchor>Reset Password</Anchor>
                </Text>
            </Grid.Col>
        </Grid>
    </>
    );
}