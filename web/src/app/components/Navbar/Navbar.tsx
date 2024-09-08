import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
import { UserType, resetUser } from '@/app/features/user/userSlice';
import { IconUserCircle, IconBell, IconLogout, IconSettings } from '@tabler/icons-react';
import styles from './Navbar.module.css';
import SettingModal from '../Modal/EditModal';
import { EditSetting } from '../Modal/EditSetting';
import { useScroll } from '../../contexts/ScrollContext';

function Navbar() {
    // Use Redux State Management
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    function isUserType(value: any): value is UserType {
        return value === 'student' || value === 'sponsor' || value === 'alumni' || value === 'admin';
    }

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
    const [opened, { toggle, open, close }] = useDisclosure();
    // Use a media query to determine small screen size for the collapsible menu
    const [isMobile, setIsMobile] = useState(false);

    // Setting modals
    const [openModal, setOpenModal] = useState(false);

    const handleSetting = () => {
        setOpenModal(true);
    };

    const { scrollToGuide } = useScroll();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <Flex
                className={styles.Navbar}
                gap="md"
                pt="md"
                pr="md"
                pl="md"
                pb="md"
                justify="space-between"
                align="center"
            >
                <NavLink to="/">
                    <Image radius="md" h={20} src="fsae_white_and_orange_logo.png" alt="FSAE Logo" />
                </NavLink>

                <Flex justify="center" align="center" style={{ flex: 1 }}>
                    {!isMobile && userType && isUserType(userType) && (
                        <Group gap={100}>
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
                                    <Text size="lg">{link.label}</Text>
                                </NavLink>
                            ))}
                        </Group>
                    )}
                </Flex>
                {!isMobile && userType && (
                    <Group gap={20}>
                        <ActionIcon size={35} variant="subtle" color="white" onClick={handleProfileClick}>
                            <IconUserCircle size={35} />
                        </ActionIcon>

                        <ActionIcon size={35} variant="subtle" color="white" onClick={handleSetting}>
                            <IconSettings size={35} />
                        </ActionIcon>

                        {userType !== 'student' && (
                            <ActionIcon size={35} variant="subtle" color="white">
                                <IconBell size={35} />
                            </ActionIcon>
                        )}
                        <ActionIcon size={35} variant="subtle" color="white">
                            <IconLogout size={35} onClick={handleLogout} />
                        </ActionIcon>
                    </Group>
                )}

                <Flex justify="space-between" align="center">
                    {!isMobile && !userType && location.pathname === '/' && (
                        <>
                            <Flex justify="center" align="center" style={{ flex: 1, left: "50%", transform: "translateX(-50%)", position: 'absolute' }}>
                                <Group gap={100}>
                                    <NavLink
                                        to=""
                                        onClick={() => scrollToGuide('student')}
                                        style={{ textDecoration: 'none', color: 'white', fontSize: '16px' }}
                                    >
                                        Students
                                    </NavLink>
                                    <NavLink
                                        to=""
                                        onClick={() => scrollToGuide('sponsor')}
                                        style={{ textDecoration: 'none', color: 'white', fontSize: '16px' }}
                                    >
                                        Sponsors
                                    </NavLink>
                                    <NavLink
                                        to=""
                                        onClick={() => scrollToGuide('alumni')}
                                        style={{ textDecoration: 'none', color: 'white', fontSize: '16px' }}
                                    >
                                        Alumni
                                    </NavLink>
                                </Group>
                            </Flex>

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
                                            backgroundColor: isActive
                                                ? 'var(--mantine-color-customAzureBlue-1)'
                                                : 'none',
                                            fontSize: '16px',
                                        })}
                                    >
                                        <Menu.Item> Student</Menu.Item>
                                    </NavLink>
                                    <NavLink
                                        to="/signup/sponsor"
                                        style={({ isActive }) => ({
                                            textDecoration: 'none',
                                            backgroundColor: isActive
                                                ? 'var(--mantine-color-customAzureBlue-1)'
                                                : 'none',
                                            fontSize: '16px',
                                        })}
                                    >
                                        <Menu.Item> Sponsor</Menu.Item>
                                    </NavLink>
                                    <NavLink
                                        to="/signup/alumni"
                                        style={({ isActive }) => ({
                                            textDecoration: 'none',
                                            backgroundColor: isActive
                                                ? 'var(--mantine-color-customAzureBlue-1)'
                                                : 'none',
                                            fontSize: '16px',
                                        })}
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

                {/* Burger Menu Button (only visible on mobile) */}
                {isMobile && (
                    <Flex gap="md">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            aria-label="Toggle navigation"
                            size="sm"
                            mr="md"
                        />
                    </Flex>
                )}
            </Flex>

            {/* Mobile Navigation (conditionally rendered based on `opened` state) */}
            {opened && (
                <AppShell
                    header={{ height: 60 }}
                    navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                    padding="md"
                >
                    <AppShell.Header>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            aria-label="Toggle navigation"
                            size="sm"
                            mr="md"
                            p={20}
                        />
                    </AppShell.Header>
                    <AppShell.Navbar p="md">
                        {userType && isUserType(userType) && (
                            <Flex justify="center" align="center" gap="xl" direction="column" style={{ flex: 1 }}>
                                {navLinks[userType].map((link) => (
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
                                            fontSize: '16px',
                                        })}
                                    >
                                        <Text size="md">{link.label}</Text>
                                    </NavLink>
                                ))}
                            </Flex>
                        )}

                        {userType && (
                            <Flex
                                justify="center"
                                align="Flex-end"
                                gap="sm"
                                direction="column"
                                style={{ flex: 1 }}
                            >
                                <Divider my="sm" />
                                <Menu>
                                    <Menu.Item
                                        onClick={() => {
                                            handleProfileClick();
                                            close();
                                        }}
                                        leftSection={<IconUserCircle size={30} />}
                                    >
                                        Profile
                                    </Menu.Item>

                                    <Menu.Item leftSection={<IconSettings size={30} />}>Settings</Menu.Item>

                                    {userType !== 'student' && (
                                        <Menu.Item onClick={close} leftSection={<IconBell size={30} />}>
                                            Notifications
                                        </Menu.Item>
                                    )}
                                    <Menu.Item
                                        onClick={() => {
                                            handleLogout();
                                            close();
                                        }}
                                        leftSection={<IconLogout size={30} />}
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu>
                            </Flex>
                        )}

                        {!userType && (
                            <Flex
                                justify="center"
                                align="Flex-end"
                                gap="sm"
                                direction="column"
                                style={{ flex: 1 }}
                            >
                                <Menu>
                                    <Menu.Target>
                                        <Menu.Item>Sign Up</Menu.Item>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <NavLink
                                            to="/signup/student"
                                            style={({ isActive }) => ({
                                                textDecoration: 'none',
                                                backgroundColor: isActive ? 'var(--mantine-color-customAzureBlue-1)' : 'none',
                                                fontSize: '16px',
                                            })}
                                        >
                                            <Menu.Item> Student</Menu.Item>
                                        </NavLink>
                                        <NavLink
                                            to="/signup/sponsor"
                                            style={({ isActive }) => ({
                                                textDecoration: 'none',
                                                backgroundColor: isActive ? 'var(--mantine-color-customAzureBlue-1)' : 'none',
                                                fontSize: '16px',
                                            })}
                                        >
                                            <Menu.Item> Sponsor</Menu.Item>
                                        </NavLink>
                                        <NavLink
                                            to="/signup/alumni"
                                            style={({ isActive }) => ({
                                                textDecoration: 'none',
                                                backgroundColor: isActive ? 'var(--mantine-color-customAzureBlue-1)' : 'none',
                                                fontSize: '16px',
                                            })}
                                        >
                                            <Menu.Item> Alumni</Menu.Item>
                                        </NavLink>
                                    </Menu.Dropdown>

                                    <Menu.Item onClick={close}>
                                        <NavLink
                                            style={{
                                                textDecoration: 'none',
                                                color: 'var(--mantine-color-customAzureBlue-1)',
                                                fontSize: '16px',
                                            }}
                                            to="/login"
                                        >
                                            Log In
                                        </NavLink>
                                    </Menu.Item>
                                </Menu>
                            </Flex>
                        )}
                    </AppShell.Navbar>
                </AppShell>
            )}

            <SettingModal
                opened={openModal}
                close={() => setOpenModal(false)}
                content={<EditSetting close={() => setOpenModal(false)} />}
                title="Settings"
            ></SettingModal>
        </>
    );
}

export default Navbar;
