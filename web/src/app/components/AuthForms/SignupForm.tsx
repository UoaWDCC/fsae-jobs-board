import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { FormEvent, useState } from 'react';
import classes from './authform.module.css';

interface Field {
  label: string;
  name: string;
}

interface FormComponentProps {
  fields: Field[];
  role: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const fieldsByRole: { [key: string]: Field[] } = {
  student: [
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
  ],
  sponsor: [
    { label: 'Company', name: 'company' },
    { label: 'Phone Number', name: 'phoneNumber' },
  ],
  alumni: [
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

const SignupForm = () => {
  const [role, setRole] = useState<string>('alumni');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    // Add form submission logic here
  };

  return (
    <div className={classes.signupFormContainer}>
      <Title order={5} ta="center" mt="md" mb={50}>
        Join the FSAE:47 Job Board Community
      </Title>

      {role && <FormComponent fields={fieldsByRole[role]} role={role} onSubmit={handleSubmit} />}
    </div>
  );
};

export default SignupForm;
