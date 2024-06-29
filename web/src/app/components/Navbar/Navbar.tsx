import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Button, Flex, Image, Group, ActionIcon } from '@mantine/core';
import { UserType } from '@/app/features/user/userSlice';
import { IconSettings, IconUserCircle, IconBell } from '@tabler/icons-react';

function Navbar() {
  const userType = useSelector((state: RootState) => state.user.userType);

  const navLinks: { [key in UserType]: { path: string; label: string }[] } = {
    student: [
      { path: '/jobs', label: 'Jobs' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    sponsor: [
      { path: '/students', label: 'Students' },
      { path: '/alumni', label: 'Alumni' },
    ],
    alumni: [
      { path: '/students', label: 'Students' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    admin: [
      { path: '/jobs', label: 'Job Board' },
      { path: '/students', label: 'Students' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
      { path: '/admin', label: 'Admin Dashboard' }, // the url should be changed to something more secure
    ],
  };

  return (
    <Flex gap="md" mt="md" mr="md" ml="md" mb="md" justify="space-between" align="center">
      <NavLink to="/">
        <Image radius="md" h={30} src="fsae_logo_black.png" alt="FSAE Logo" />
      </NavLink>

      <Flex justify="center" align="center" style={{ flex: 1 }}>
        {userType ? (
          <Group>
            {navLinks[userType].map((link) => (
              <NavLink key={link.path} to={link.path}>
                <Button variant="subtle" color="white">
                  {link.label}
                </Button>
              </NavLink>
            ))}
          </Group>
        ) : null}
      </Flex>
      {/* Icons on the Right (when logged in) */}
      {userType && (
        <Group>
          <ActionIcon size={32} variant="subtle" color="white">
            <IconUserCircle />
          </ActionIcon>
          <ActionIcon size={32} variant="subtle" color="white">
            <IconSettings />
          </ActionIcon>
          <ActionIcon size={32} variant="subtle" color="white">
            <IconBell />
          </ActionIcon>
        </Group>
      )}

      <Flex gap="md">
        {!userType && ( // Only render if not logged in
          <>
            <NavLink to="/signup">
              <Button variant="filled" color="customPapayaOrange">
                Sign Up
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button color="customAzureBlue">Log In</Button>
            </NavLink>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Navbar;
