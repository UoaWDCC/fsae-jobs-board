import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex, Title, Image, Anchor } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export function HomePage() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="space-between" mt="md" mr="md">
        <Flex justify="left">
          <NavLink to="">
            <Image src={logo} alt="Logo" ml={10} width={50} height={36} />        
          </NavLink>
        </Flex>
        <Flex justify="center" gap="md">
        <NavLink to="#Students">
          <Anchor>Students</Anchor>
          </NavLink>
        <NavLink to="#Sponsors">
          <Anchor>Sponsors</Anchor>
        </NavLink>
        <NavLink to="#Alumni">
          <Anchor>Alumni</Anchor>
        </NavLink>
        <NavLink to="/about"><Anchor>About</Anchor></NavLink>
        </Flex>
        <Flex justify="right" gap="md">
          <NavLink to="/signup">
            <Button variant="filled" color="customPapayaOrange">
              Sign up
            </Button>
          </NavLink>
          <NavLink to="/login">
            <Button color="customAzureBlue">Log in</Button>
          </NavLink>
        </Flex>
    </Flex>
      {/* <Welcome /> */}
      {/* <ColorSchemeToggle /> */}
    </>
  );
}
