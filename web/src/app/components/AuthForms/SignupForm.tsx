import {
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
} from '@mantine/core';
import { FormEvent } from 'react';
import styles from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { Role } from '../../type/role';
import {toast} from "react-toastify";
import {createFSAEUserDto, register_alumni, register_member, register_sponsor} from "@/api/register";

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
  ],
  [Role.Alumni]: [
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Company', name: 'company' },
  ],
};

const FormComponent: React.FC<FormComponentProps> = ({ fields, onSubmit }) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <Stack gap={30}>
      {fields.map((field) => (
        <TextInput
          key={field.name}
          label={field.label}
          name={field.name}
          size="md"
          required
          classNames={{ label: styles.formLabel }}
        />
      ))}
      <TextInput
        label="Email"
        name="email"
        size="md"
        required
        classNames={{ label: styles.formLabel }}
      />
      <TextInput
        label="Phone Number"
        name="phoneNumber"
        size="md"
        required
        classNames={{ label: styles.formLabel }}
      />
      <Flex justify="space-between">
        <PasswordInput
          label="Password"
          name="password"
          size="md"
          required
          classNames={{ label: styles.formLabel, root: styles.horizontalInput }}
        />
        <PasswordInput
          label="Confirmed Password"
          name="confirmPassword"
          size="md"
          required
          classNames={{ label: styles.formLabel, root: styles.horizontalInput }}
        />
      </Flex>
      <Checkbox
        size="md"
        label={
          <>
            I accept{' '}
            <NavLink to="/" className={styles.link}>
              terms and conditions
            </NavLink>
          </>
        }
        required
        name="terms"
      />
      <Button color="var(--mantine-color-customAzureBlue-1)" size="md" type="submit">
        Confirm
      </Button>
    </Stack>
  </form>
);

const SignupForm = ({ role }: { role: Role }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Todo: Redirect or do something after successful registration
    if (role === Role.Student) {
      register_member(data as createFSAEUserDto).then((response) => {
        toast.success('Student Registration Successful');
      }).catch((error) => {
        toast.error(error.toString());
      })
    } else if (role === Role.Sponsor) {
      register_sponsor(data as createFSAEUserDto).then((response) => {
        toast.success('Sponsor Registration Successful');
      }).catch((error) => {
        toast.error(error.toString());
      })
    } else if (role === Role.Alumni) {
      register_alumni(data as createFSAEUserDto).then((response) => {
        toast.success('Alumni Registration Successful');
      }).catch((error) => {
        toast.error(error.toString());
      })
    } else {
      toast.error('Registering Unknown Role');
    }
  };

  return (
    <Flex align="center" justify="center" className={styles.signupFormContainer}>
      <Title order={5} ta="center" mt="lg" mb="lg" style={{ fontStyle: 'italic' }}>
        Join the F:SAE:47 Job Board Community
      </Title>

      {role ? (
        <FormComponent fields={fieldsByRole[role]} role={role} onSubmit={handleSubmit} />
      ) : (
        <Text ta="center">Please select a role to proceed.</Text>
      )}
      <Text ta="center" mt="md">
        Already have an account?{' '}
        <NavLink to="/login" className={styles.link}>
          Login
        </NavLink>
      </Text>
    </Flex>
  );
};

export default SignupForm;
