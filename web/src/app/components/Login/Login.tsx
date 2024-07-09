import classes from './Login.module.css';
import LoginForm from './Login.forms';
import { Grid, Image, Title, Text, Anchor} from '@mantine/core';
import { useDocumentTitle, useFavicon, useMediaQuery} from '@mantine/hooks';
import {UserType} from '../../features/user/userSlice';
import { toTitleCase } from '../../utils/helpers';

export function Login({tryLoginAs}: {tryLoginAs: UserType}) {
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
                <Title className={classes.title}>Logging in as a {toTitleCase(tryLoginAs)}</Title>
                <LoginForm tryLoginAs = {tryLoginAs} />
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