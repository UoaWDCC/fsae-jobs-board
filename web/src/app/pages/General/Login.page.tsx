import { LoginForm } from '../../components/AuthForms/LoginForm';
import { LoginSideImage } from '../../components/LoginSideImage/LoginSideImage';
import { Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function Login() {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <Grid>
      {isSmallScreen ? (
        <Grid.Col span={12}>
          <LoginForm />
        </Grid.Col>
      ) : (
        <>
          <Grid.Col span={6}>
            <LoginSideImage />
          </Grid.Col>
          <Grid.Col span={6}>
            <LoginForm />
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
