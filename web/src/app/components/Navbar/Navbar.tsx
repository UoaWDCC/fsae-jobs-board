import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { Button, Flex, Image, Group, ActionIcon, Text, Menu } from '@mantine/core';
import { UserType, resetUser } from '@/app/features/user/userSlice';
import { IconUserCircle, IconBell, IconLogout } from '@tabler/icons-react';
import { useScrollIntoView } from '@mantine/hooks';

function Navbar() {
  // Use Redux State Management
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userType = useSelector((state: RootState) => state.user.userType);
  // Define navigation links based on user type
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
    ],
  };
  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem('accessToken');
    navigate('/');
  };
  // Redirect to the user's profile page based on their type
  const handleProfileClick = () => {
    if (userType) {
      const profilePath = {
        student: '/profile/student',
        sponsor: '/profile/sponsor',
        alumni: '/profile/alumni',
        admin: '/profile/admin',
      }[userType as UserType];
      navigate(profilePath);
    } else {
      // Handle the case where userType is null
      navigate('/login');
    }
  };

  return (
    <Flex gap="md" mt="md" mr="md" ml="md" mb="md" justify="space-between" align="center">
      <NavLink to="/">
        <Image radius="md" h={20} src="fsae_white_and_orange_logo.png" alt="FSAE Logo" />
      </NavLink>

      <Flex justify="center" align="center" style={{ flex: 1 }}>
        {userType ? (
          <Group gap="xl">
            {navLinks[userType].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  borderBottom: isActive
                    ? `2px solid var(--mantine-color-customPapayaOrange-5)`
                    : 'none',
                  color: isActive
                    ? 'var(--mantine-color-customMercurySilver-5)'
                    : 'var(--mantine-color-white)',
                  paddingBottom: '2px',
                })}
              >
                <Text size="md">{link.label}</Text>
              </NavLink>
            ))}
          </Group>
        ) : null}
      </Flex>
      {userType && (
        <Group>
          <ActionIcon size={32} variant="subtle" color="white" onClick={handleProfileClick}>
            <IconUserCircle />
          </ActionIcon>

          {userType !== 'student' && (
            <ActionIcon size={32} variant="subtle" color="white">
              <IconBell />
            </ActionIcon>
          )}
          <ActionIcon size={32} variant="subtle" color="white">
            <IconLogout onClick={handleLogout} />
          </ActionIcon>
        </Group>
      )}

      <Flex gap="md">
        {!userType && ( // Only render if not logged in
          <>
            <Menu>
              <Menu.Target>
                <Button variant="filled" color="customPapayaOrange">
                  Sign Up
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <NavLink
                  to="/signup/student"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    backgroundColor: isActive ? ' customAzureBlue' : 'none',
                  })}
                >
                  <Menu.Item> Student</Menu.Item>
                </NavLink>
                <NavLink
                  to="/signup/sponsor"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    backgroundColor: isActive ? ' customAzureBlue' : 'none',
                  })}
                >
                  <Menu.Item> Sponsor</Menu.Item>
                </NavLink>
                <NavLink
                  to="/signup/alumni"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    backgroundColor: isActive ? ' customAzureBlue' : 'none',
                  })}
                >
                  <Menu.Item> Alumni</Menu.Item>
                </NavLink>
              </Menu.Dropdown>
            </Menu>

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
