import { Flex, Text } from '@mantine/core';

const DeleteTab = () => {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text fw={700} ta="center">
        Are you sure you want to delete your account?
      </Text>
      <Text fw={700} ta="center">
        All your data will be permanently lost.
      </Text>
      <Text fw={700} ta="center">
        This action cannot be undone.
      </Text>
    </Flex>
  );
}

export default DeleteTab;
