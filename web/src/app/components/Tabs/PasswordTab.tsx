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
      <Stack className={styles.container} justify="center" align="center" w="100%">
        <PasswordInput
          label="Current Password"
          defaultValue={password}
          classNames={{ label: styles.label }}
          style={{ width: isPortrait ? '90%' : '60%' }}
        ></PasswordInput>
        <PasswordInput
          label="New Password"
          placeholder="New Password"
          style={{ width: isPortrait ? '90%' : '60%' }}
        ></PasswordInput>
        <PasswordInput
          label="Retype New Password"
          placeholder="Retype New Password"
          style={{ width: isPortrait ? '90%' : '60%' }}
        ></PasswordInput>
      </Stack>
    </Flex>
  );
};

export default PasswordTab;
