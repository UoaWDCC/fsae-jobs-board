import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { Button, Flex, Image, Group, ActionIcon, Menu } from '@mantine/core';
import { UserType, resetUser } from '@/app/features/user/userSlice';
import { IconSettings, IconUserCircle, IconBell, IconLogout } from '@tabler/icons-react';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userType = useSelector((state: RootState) => state.user.userType);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
      { path: '/profile/admin', label: 'Admin Dashboard' }, // the url should be changed to something more secure
    ],
  };
  const handleLogout = () => {
    dispatch(resetUser()); // Assuming you have an action to reset user state
    localStorage.removeItem('accessToken');
    navigate('/login');
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
      {userType && (
        <Group>
          <Menu opened={profileMenuOpen} onClose={() => setProfileMenuOpen(false)}>
            <Menu.Target>
              <ActionIcon
                size={32}
                variant="subtle"
                color="white"
                onClick={() => setProfileMenuOpen((o) => !o)}
              >
                <IconUserCircle />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>

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
