import { ForgotPasswordForm } from '../../components/AuthForms/ForgotPasswordForm';
import { LoginSideImage } from '../../components/LoginSideImage/LoginSideImage';
import { Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function ForgotPassword() {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <Grid>
      {isSmallScreen ? (
        <Grid.Col span={12}>
          <ForgotPasswordForm />
        </Grid.Col>
      ) : (
        <>
          <Grid.Col span={6}>
            <LoginSideImage />
          </Grid.Col>
          <Grid.Col span={6}>
            <ForgotPasswordForm />
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
