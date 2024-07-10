import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Flex, Title, Image, Anchor } from '@mantine/core';
import logo from '../assets/images/logo.png';

export function HomePage() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/signup">
          <Button variant="filled" color="customPapayaOrange">
            Sign up
          </Button>
        </NavLink>
        <NavLink to="/login">
          <Button color="customAzureBlue">Log in</Button>
        </NavLink>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Home Page</Title>
      </Flex>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
