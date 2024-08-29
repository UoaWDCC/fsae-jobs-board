import { Stack, TextInput, PasswordInput, Flex } from '@mantine/core';
import styles from '../Tabs/Settings.module.css';
import { useState } from 'react';

interface EmailTabProp {
  email: string;
}

const EmailTab: FC<EmailTabProp> = ({ email }) => {

  return (
    <Flex direction="column" align="center" justify="center">
      <Stack className={styles.container}>
        <TextInput
          label="Current Email"
          placeholder="Current Email"
          classNames={{ input: styles.input, label: styles.inputLabel }}
        ></TextInput>
        <TextInput
          label="New Email"
          placeholder="New Email"
          classNames={{ input: styles.input, label: styles.inputLabel }}
        ></TextInput>
      </Stack>
    </Flex>
  );
};

export default EmailTab;
