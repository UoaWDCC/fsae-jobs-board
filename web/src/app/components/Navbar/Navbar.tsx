import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Button, Flex, Image, List } from '@mantine/core';
import { UserType } from '@/app/features/user/userSlice';

function Navbar() {
  const userType = useSelector((state: RootState) => state.user.userType);

  const navLinks: { [key in UserType]: { path: string; label: string }[] } = {
    student: [
      { path: '/jobs', label: 'Jobs' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    sponsor: [{ path: '/students', label: 'Students' }],
    alumni: [
      { path: '/students', label: 'Students' },
      { path: '/alumni', label: 'Alumni' },
    ],
    admin: [
      { path: '/jobs', label: 'Jobs' },
      { path: '/students', label: 'Students' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
      { path: '/admin', label: 'Admin Dashboard' }, // the url should be changed to something more secure
    ],
  };

  return (
    <nav>
      <Flex gap="md" mt="md" mr="md" justify="space-between" align="center">
        <Image src="favicon.svg" alt="FSAE Logo" style={{ height: 50 }} />
        {userType ? (
          <List>
            {navLinks[userType].map((link) => (
              <List.Item key={link.path}>
                <NavLink to={link.path}>{link.label}</NavLink>
              </List.Item>
            ))}
          </List>
        ) : (
          <Flex gap="md">
            <NavLink to="/signup">
              <Button variant="filled" color="customPapayaOrange">
                Sign Up
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button color="customAzureBlue">Log In</Button>
            </NavLink>
          </Flex>
        )}
      </Flex>
    </nav>
  );
}

export default Navbar;
