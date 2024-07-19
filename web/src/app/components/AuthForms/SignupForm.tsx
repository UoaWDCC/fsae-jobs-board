import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
  Image,
} from '@mantine/core';
import { FormEvent } from 'react';
import classes from './authform.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Role } from '../../type/role';

interface Field {
  label: string;
  name: string;
}

interface FormComponentProps {
  fields: Field[];
  role: Role;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const fieldsByRole: { [key in Role]: Field[] } = {
  [Role.Student]: [
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
  ],
  [Role.Sponsor]: [
    { label: 'Company', name: 'company' },
    { label: 'Phone Number', name: 'phoneNumber' },
  ],
  [Role.Alumni]: [
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Company', name: 'company' },
  ],
};

const FormComponent: React.FC<FormComponentProps> = ({ fields, onSubmit }) => (
  <form className={classes.form} onSubmit={onSubmit}>
    <Stack gap={30}>
      {fields.map((field) => (
        <TextInput
          key={field.name}
          label={field.label}
          name={field.name}
          size="lg"
          required
          classNames={{ label: classes.formLabel }}
        />
      ))}
      <TextInput
        label="Email"
        name="email"
        size="lg"
        required
        classNames={{ label: classes.formLabel }}
      />
      <Flex justify="space-between">
        <PasswordInput
          label="Password"
          name="password"
          size="lg"
          required
          classNames={{ label: classes.formLabel, root: classes.horizontalInput }}
        />
        <PasswordInput
          label="Confirmed Password"
          name="confirmPassword"
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
        name="terms"
      />
      <Button color="var(--mantine-color-customAzureBlue-1)" size="lg" type="submit">
        Confirm
      </Button>
    </Stack>
  </form>
);

const SignupForm = ({ role }: { role: Role }) => {
  const navigate = useNavigate();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    // Add form submission logic here
  };

  return (
    <div className={classes.signupFormContainer}>
      <div className={classes.banner} style={{ alignSelf: 'flex-start' }}>
        <NavLink to="/" className={classes.logo}>
          <Image h={25} src="/fsae_white_and_orange_logo.png" fit="contain" />
        </NavLink>
      </div>
      <Title order={5} ta="center" mt="md" mb={50}>
        Join the FSAE:47 Job Board Community
      </Title>

      {role && <FormComponent fields={fieldsByRole[role]} role={role} onSubmit={handleSubmit} />}
      <Text ta="center" mt="md">
        Already have an account?{' '}
        <Anchor<'a'> href="#" fw={700} onClick={(event) => navigate('/login')}>
          Login
        </Anchor>
      </Text>
    </div>
  );
};

export default SignupForm;
