import { AdminLoginForm } from '@/app/components/AuthForms/AdminLoginForm';
import { LoginForm } from '../../components/AuthForms/LoginForm';
import { LoginSideImage } from '../../components/LoginSideImage/LoginSideImage';
import { Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function AdminLogin() {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <Grid>
      {isSmallScreen ? (
        <Grid.Col span={12}>
          <AdminLoginForm />
        </Grid.Col>
      ) : (
        <>
          <Grid.Col span={6}>
            <LoginSideImage />
          </Grid.Col>
          <Grid.Col span={6}>
            <AdminLoginForm />
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
