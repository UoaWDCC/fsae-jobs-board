import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import classes from './authform.module.css';

const SignupForm = () => {
  const [role, setRole] = useState('student');
  return (
    <div className={classes.signupFormContainer}>
      {/* logo */}
      <Title order={5} ta="center" mt="md" mb={50}>
        Join the FSAE:47 Job Board Community
      </Title>

      {role === 'student' && (
        <form className={classes.form}>
          <Stack gap={30}>
            <TextInput
              label="First Name"
              size="lg"
              required
              classNames={{ label: classes.formLabel }}
            />
            <TextInput
              label="Last Name"
              size="lg"
              required
              classNames={{ label: classes.formLabel }}
            />
            <TextInput label="Email" size="lg" required classNames={{ label: classes.formLabel }} />
            <Flex justify="space-between">
              <PasswordInput
                label="Password"
                size="lg"
                required
                classNames={{ label: classes.formLabel, root: classes.horizontalInput }}
              />
              <PasswordInput
                label="Confirmed Password"
                size="lg"
                required
                classNames={{ label: classes.formLabel, root: classes.horizontalInput }}
              />
            </Flex>
            <Checkbox
              size="lg"
              label={
                <>
                  I accept{' '}
                  <Anchor href="https://mantine.dev" target="_blank" inherit>
                    terms and conditions
                  </Anchor>
                </>
              }
              required
            />
            <Button color="var(--mantine-color-customAzureBlue-1)" size="lg">
              Confirm
            </Button>
          </Stack>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
