import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  Button,
  Flex,
  Image,
  Group,
  ActionIcon,
  Text,
  Menu,
  Burger,
  AppShell,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Role } from '@/app/type/role';
import { IconUserCircle, IconBell, IconLogout, IconSettings, IconBriefcase2 } from '@tabler/icons-react';
import styles from './Navbar.module.css';
import SettingModal from '../Modal/EditModal';
import { EditSetting } from '../Modal/EditSetting';
import { resetUser } from '../../features/user/userSlice';

function Navbar() {
  // Use Redux State Management
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function isRole(value: any): value is Role {
    return value === Role.Member || value === Role.Sponsor || value === Role.Alumni || value === Role.Admin;
  }

  const role = useSelector((state: RootState) => state.user.role);
  // Define navigation links based on user type
  const navLinks: { [key in Role]: { path: string; label: string }[] } = {
    [Role.Member]: [
      { path: '/jobs', label: 'Jobs' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    [Role.Sponsor]: [
      { path: '/members', label: 'Students' },
      { path: '/alumni', label: 'Alumni' },
    ],
    [Role.Alumni]: [
      { path: '/members', label: 'Students' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    [Role.Admin]: [
      { path: '/jobs', label: 'Job Board' },
      { path: '/members', label: 'Students' },
      { path: '/sponsors', label: 'Sponsors' },
      { path: '/alumni', label: 'Alumni' },
    ],
    [Role.Unknown]: [],
  };
  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem('accessToken');
    navigate('/');
  };
  // Redirect to the user's profile page based on their type
  const handleProfileClick = () => {
    if (role) {
      const profilePath = {
        [Role.Member]: '/profile/member',
        [Role.Sponsor]: '/profile/sponsor',
        [Role.Alumni]: '/profile/alumni',
        [Role.Admin]: '/profile/admin',
        [Role.Unknown]: '/profile/unknown',
      }[role as Role];
      navigate(profilePath);
    } else {
      // Handle the case where role is null
      navigate('/login');
    }
  };

  const handleJobClick = () => {
    if (role) {
      const jobPath = {
        [Role.Member]: '/jobs',
        [Role.Sponsor]: '/jobs',
        [Role.Alumni]: '/jobs',
        [Role.Admin]: '/jobs',
        [Role.Unknown]: '/jobs',
      }[role as Role];
      navigate(jobPath);
    } else {
      // Handle the case where role is null
      navigate('/login');
    }
  };

  const [opened, { toggle, open, close }] = useDisclosure();
  // Initialize based on current width
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 

  // Setting modals
  const [openModal, setOpenModal] = useState(false);

  const handleSetting = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Set initial state
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Flex
        className={styles.Navbar}
        gap="md"
        pt="lg"
        pr="lg"
        pl="lg"
        pb="lg"
        justify="space-between"
        align="center"
      >
        <NavLink to="/">
          <Image radius="md" h={20} src="/fsae_white_and_orange_logo.png" alt="FSAE Logo" />
        </NavLink>

        {/* Desktop Navigation Links */}
        <Flex justify="center" align="center" style={{ flex: 1 }}>
          {!isMobile && role && isRole(role) && (
            <Group gap={100}>
              {navLinks[role].map((link) => (
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
                  <Text size="lg">{link.label}</Text>
                </NavLink>
              ))}
            </Group>
          )}
        </Flex>

        {/* Desktop Icons/Auth Buttons */}
        {!isMobile && (
          <Flex gap="md" align="center">
            {role ? ( // Render icons if logged in
              <Group gap={20}>
                <ActionIcon size={35} variant="subtle" color="white" onClick={handleJobClick}>
                  <IconBriefcase2 size={35} values='Jobs'/>
                </ActionIcon>
                
                <ActionIcon size={35} variant="subtle" color="white" onClick={handleProfileClick}>
                  <IconUserCircle size={35} />
                </ActionIcon>

                <ActionIcon size={35} variant="subtle" color="white" onClick={handleSetting}>
                  <IconSettings size={35} />
                </ActionIcon>

                {role !== Role.Member && (
                  <ActionIcon size={35} variant="subtle" color="white">
                    <IconBell size={35} />
                  </ActionIcon>
                )}
                <ActionIcon size={35} variant="subtle" color="white" onClick={handleLogout}>
                  <IconLogout size={35} />
                </ActionIcon>
              </Group>
            ) : ( // Render Sign Up/Log In if not logged in
              <>
                <Menu>
                  <Menu.Target>
                    <Button variant="filled" color="customPapayaOrange">
                      Sign Up
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <NavLink
                      to="/signup/member"
                      style={{ textDecoration: 'none' }}
                    >
                      <Menu.Item> Student</Menu.Item>
                    </NavLink>
                    <NavLink
                      to="/signup/sponsor"
                      style={{ textDecoration: 'none' }}
                    >
                      <Menu.Item> Sponsor</Menu.Item>
                    </NavLink>
                    <NavLink
                      to="/signup/alumni"
                      style={{ textDecoration: 'none' }}
                    >
                      <Menu.Item> Alumni</Menu.Item>
                    </NavLink>
                  </Menu.Dropdown>
                </Menu>

                <NavLink to="/login">
                  <Button color="var(--mantine-color-customAzureBlue-1)">Log In</Button>
                </NavLink>
              </>
            )}
          </Flex>
        )}

        {/* Burger Menu Button (only visible on mobile) */}
        {isMobile && (
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label="Toggle navigation"
            size="sm"
            color="white" // Ensure burger is visible
          />
        )}
      </Flex>

      {/* Mobile Navigation Drawer */}
      <AppShell
        header={{ height: 0 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
        hidden={!isMobile}
      >
        <AppShell.Navbar p="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}> {/* Adjust background as needed */}
          {/* Close button inside drawer */}
          <Group justify="flex-end">
            <Burger
              opened={opened}
              onClick={toggle}
              aria-label="Toggle navigation"
              size="sm"
              color="white"
            />
          </Group>
          <Divider my="sm" />

          {role && isRole(role) ? (
            <>
              {/* Mobile Nav Links for Logged-in Users */}
              <Flex justify="center" align="center" gap="xl" direction="column" style={{ flexGrow: 1 }}>
                {navLinks[role].map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={close}
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
              </Flex>

              {/* Mobile Actions for Logged-in Users */}
              <Flex
                justify="center"
                align="center" // Center items horizontally
                gap="sm"
                direction="column"
              >
                <Divider my="sm" />
                <Button
                  variant="subtle" color="white" fullWidth
                  onClick={() => { handleProfileClick(); close(); }}
                  leftSection={<IconUserCircle size={20} />}
                >
                  Profile
                </Button>
                <Button
                  variant="subtle" color="white" fullWidth
                  onClick={() => { handleSetting(); close(); }} // Also close drawer when opening settings
                  leftSection={<IconSettings size={20} />}
                >
                  Settings
                </Button>
                {role !== Role.Member && (
                  <Button variant="subtle" color="white" fullWidth onClick={close} leftSection={<IconBell size={20} />}>
                    Notifications
                  </Button>
                )}
                <Button
                  variant="subtle" color="white" fullWidth
                  onClick={() => { handleLogout(); close(); }}
                  leftSection={<IconLogout size={20} />}
                >
                  Logout
                </Button>
              </Flex>
            </>
          ) : (
            <>
              {/* Mobile Auth for Logged-out Users */}
              <Flex
                justify="center"
                align="center" // Center items horizontally
                gap="sm"
                direction="column"
              >
                <Divider my="sm" />
                <Menu width={200}>
                  <Menu.Target>
                    <Button variant="subtle" color="white" fullWidth>
                      Sign Up
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <NavLink to="/signup/member" onClick={close} style={{ textDecoration: 'none' }}>
                      <Menu.Item>Student</Menu.Item>
                    </NavLink>
                    <NavLink to="/signup/sponsor" onClick={close} style={{ textDecoration: 'none' }}>
                      <Menu.Item>Sponsor</Menu.Item>
                    </NavLink>
                    <NavLink to="/signup/alumni" onClick={close} style={{ textDecoration: 'none' }}>
                      <Menu.Item>Alumni</Menu.Item>
                    </NavLink>
                  </Menu.Dropdown>
                </Menu>

                <NavLink to="/login" onClick={close} style={{ textDecoration: 'none', width: '100%' }}>
                  <Button variant="subtle" color="white" fullWidth>
                    Log In
                  </Button>
                </NavLink>
              </Flex>
            </>
          )}
        </AppShell.Navbar>
      </AppShell>

      <SettingModal
        opened={openModal}
        close={() => setOpenModal(false)}
        content={<EditSetting close={() => setOpenModal(false)} />}
        title="Settings"
      />
    </>
  );
}

export default Navbar;