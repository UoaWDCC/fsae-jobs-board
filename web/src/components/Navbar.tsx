import {
  Container,
  Group,
  Box,
  Button,
  ActionIcon,
} from "@mantine/core";
import { useContext, useState } from "react";
import { IconUserCircle, IconSettings, IconBell } from "@tabler/icons-react";

const Navbar = () => {
  // const {user} = useContext(AuthContext) => depends on authentication

  return (
    <header>
      <Container>
        <Group justify="space-between">
          <a href="/">FSAE logo</a>
          <Box>
            {user ? (
              <div>
                {user.roles === "student" && (
                  <>
                    <a href="/">Job Board</a>
                    <a href="/">Sponsors</a>
                  </>
                )}
                {user.roles === "alumni" && <a href="/">Students</a>}
                {user.roles === "sponsor" && <a href="/">Students</a>}
                {user.roles === "admin" && (
                  <>
                    <a href="/">Students</a>
                    <a href="/">Sponsors</a>
                    <a href="/">Alumni</a>
                  </>
                )}
                <Button>Logout</Button>
                <Group justify="center">
                  <ActionIcon>
                    <IconUserCircle />
                  </ActionIcon>
                  <ActionIcon>
                    <IconSettings />
                  </ActionIcon>
                  <ActionIcon>
                    <IconBell />
                  </ActionIcon>
                </Group>
              </div>
            ) : (
              <div>
                <Group justify="center">
                  <a href="/">About Us</a>
                  <a href="/">Students</a>
                  <a href="/">Sponsors</a>
                  <a href="/">Alumni</a>
                </Group>
                <Group justify="center">
                  <Button>Login</Button>
                  <Button>Signup</Button>
                </Group>
              </div>
            )}
          </Box>
        </Group>
      </Container>
    </header>
  );
};

export default Navbar;
