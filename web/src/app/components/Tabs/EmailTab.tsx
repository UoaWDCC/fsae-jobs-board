import { Stack, TextInput, PasswordInput, Flex } from '@mantine/core';
import styles from '../Tabs/Settings.module.css';
import { useState } from 'react';

interface EmailTabProp {
  email: string;
}

const EmailTab: FC<EmailTabProp> = ({ email }) => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);


  return (
    <Flex direction="column" align="center" justify="center">
      <Stack className={styles.container} w="100%" justify="center" align="center">
        <TextInput
          label="Current Email"
          placeholder="Current Email"
          classNames={{ input: styles.input, label: styles.inputLabel }}
          style={{ width: isPortrait ? '90%' : '60%' }}
        ></TextInput>
        <TextInput
          label="New Email"
          placeholder="New Email"
          classNames={{ input: styles.input, label: styles.inputLabel }}
          style={{ width: isPortrait ? '90%' : '60%' }}
        ></TextInput>
      </Stack>
    </Flex>
  );
};

export default EmailTab;
