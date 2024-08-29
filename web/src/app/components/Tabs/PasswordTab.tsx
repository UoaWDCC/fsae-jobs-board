import { Stack, TextInput, PasswordInput, Flex } from '@mantine/core';
import styles from '../Tabs/Settings.module.css';
import { useState } from 'react';

interface PasswordTabProp {
  password: string;
}

const PasswordTab: FC<PasswordTabProp> = ({ password }) => {
  const [newPassword, setNewPassword] = useState('new password');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  return (
    <Flex direction="column" align="center" justify="center">
      <Stack className={styles.container}>
        <PasswordInput label="Current Password" defaultValue={password} classNames={{label: styles.label}}></PasswordInput>
        <PasswordInput label="New Password" placeholder="New Password"></PasswordInput>
        <PasswordInput label="Retype New Password" placeholder="Retype New Password"></PasswordInput>
      </Stack>
    </Flex>
  );
};

export default PasswordTab;
