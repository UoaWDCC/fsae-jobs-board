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
  Popover,
  ScrollArea,
  UnstyledButton,
  Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Role } from '@/app/type/role';
import {
  IconUserCircle,
  IconBell,
  IconLogout,
  IconSettings,
  IconBriefcase2,
} from '@tabler/icons-react';
import styles from './Navbar.module.css';
import SettingModal from '../Modal/EditModal';
import { EditSetting } from '../Modal/EditSetting';
import { resetUser } from '../../features/user/userSlice';
import { notificationApi } from '@/api/notification';
import type { Notification } from '@/models/notification';

function timeAgo(d: string | Date) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  const t = (n: number, u: string) => `${n} ${u}${n > 1 ? 's' : ''} ago`;
  if (s < 60) return t(s, 'sec');
  const m = Math.floor(s / 60);
  if (m < 60) return t(m, 'min');
  const h = Math.floor(m / 60);
  if (h < 24) return t(h, 'hour');
  const dd = Math.floor(h / 24);
  if (dd < 7) return t(dd, 'day');
  return new Date(d).toLocaleDateString();
}

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isRole = (value: any): value is Role =>
    value === Role.Member ||
    value === Role.Sponsor ||
    value === Role.Alumni ||
    value === Role.Admin;

  const role = useSelector((state: RootState) => state.user.role);
  const id = useSelector((state: RootState) => state.user.id);

  const [unread, setUnread] = useState(0);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notifsOpen, setNotifsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!role || !id) {
        setUnread(0);
        return;
      }
      try {
        const { unreadCount } = await notificationApi.getNotifications(role, id);
        if (!cancelled) setUnread(unreadCount);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [role, id]);

  const handleNotificationClick = async () => {
    if (!role || !id) return;
    try {
      const { notifications } = await notificationApi.getNotifications(role, id);
      setNotifs(notifications);
      setNotifsOpen(true);
      await notificationApi.markAsRead(role, id);
      setUnread(0);
      setNotifs((n) => n.map((x) => ({ ...x, read: true })));
    } catch {}
  };

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
      { path: '/admin-dashboard', label: 'Dashboard' },
    ],
    [Role.Unknown]: [],
  };

  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (role) {
      const profilePath = {
        [Role.Member]: `/profile/member/${id}`,
        [Role.Sponsor]: `/profile/sponsor/${id}`,
        [Role.Alumni]: `/profile/alumni/${id}`,
        [Role.Admin]: '/profile/admin',
        [Role.Unknown]: '/profile/unknown',
      }[role as Role];
      navigate(profilePath);
    } else {
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
      navigate('/login');
    }
  };

  const [opened, { toggle, close }] = useDisclosure();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openModal, setOpenModal] = useState(false);
  const handleSetting = () => setOpenModal(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
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

        {!isMobile && (
          <Flex gap="md" align="center">
            {role ? (
              <Group gap={20}>
                <ActionIcon
                  size={35}
                  variant="subtle"
                  color="white"
                  onClick={handleJobClick}
                  aria-label="See jobs"
                >
                  <IconBriefcase2 size={35} />
                </ActionIcon>

                <ActionIcon
                  size={35}
                  variant="subtle"
                  color="white"
                  onClick={handleProfileClick}
                  aria-label="See profile"
                >
                  <IconUserCircle size={35} />
                </ActionIcon>

                <ActionIcon
                  size={35}
                  variant="subtle"
                  color="white"
                  onClick={handleSetting}
                  aria-label="Go to settings"
                >
                  <IconSettings size={35} />
                </ActionIcon>

                <Popover
                  opened={notifsOpen}
                  onChange={setNotifsOpen}
                  withArrow
                  shadow="lg"
                  width={360}
                  position="bottom-end"
                  offset={8}
                  withinPortal
                  trapFocus
                >
                  <Popover.Target>
                    <ActionIcon
                      size={35}
                      variant="subtle"
                      color="white"
                      onClick={handleNotificationClick} // fetch + open + mark-all
                      aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
                      className={styles.iconBtn}
                    >
                      <IconBell size={35} />
                      {unread > 0 && (
                        <span className={styles.badge} aria-hidden>
                          {unread}
                        </span>
                      )}
                    </ActionIcon>
                  </Popover.Target>

                  <Popover.Dropdown className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <Text fw={600}>Notifications</Text>
                      <Badge variant="light">{notifs.filter((n) => !n.read).length} unread</Badge>
                    </div>

                    <ScrollArea h={260} type="auto">
                      {notifs.length === 0 ? (
                        <Text c="dimmed" ta="center" py="md">
                          No notifications
                        </Text>
                      ) : (
                        <ul className={styles.list} role="listbox" aria-label="Notifications">
                          {notifs.map((n) => (
                            <li key={n.id}>
                              <UnstyledButton
                                className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                                onClick={() => setNotifsOpen(false)} // or navigate to deepLink
                                title={new Date(n.createdAt).toLocaleString()}
                              >
                                {!n.read && <span className={styles.dot} aria-hidden />}
                                <div className={styles.msg}>
                                  <span className={styles.time}>{timeAgo(n.createdAt)}</span>
                                  <Text
                                    size="sm"
                                    fw={n.read ? 400 : 600}
                                    className={styles.message}
                                  >
                                    {n.message}
                                  </Text>
                                </div>
                              </UnstyledButton>
                            </li>
                          ))}
                        </ul>
                      )}
                    </ScrollArea>
                  </Popover.Dropdown>
                </Popover>

                <ActionIcon
                  size={35}
                  variant="subtle"
                  color="white"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <IconLogout size={35} />
                </ActionIcon>
              </Group>
            ) : (
              <>
                <Menu>
                  <Menu.Target>
                    <Button variant="filled" color="customPapayaOrange">
                      Sign Up
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <NavLink to="/signup/member" style={{ textDecoration: 'none' }}>
                      <Menu.Item> Student</Menu.Item>
                    </NavLink>
                    <NavLink to="/signup/sponsor" style={{ textDecoration: 'none' }}>
                      <Menu.Item> Sponsor</Menu.Item>
                    </NavLink>
                    <NavLink to="/signup/alumni" style={{ textDecoration: 'none' }}>
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

        {isMobile && (
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label="Toggle navigation"
            size="sm"
            color="white"
          />
        )}
      </Flex>

      <AppShell
        header={{ height: 0 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
        hidden={!isMobile}
      >
        <AppShell.Navbar p="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
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
              <Flex justify="center" align="center" gap="sm" direction="column">
                <Divider my="sm" />
                <Button
                  variant="subtle"
                  color="white"
                  fullWidth
                  onClick={() => {
                    handleProfileClick();
                    close();
                  }}
                  leftSection={<IconUserCircle size={20} />}
                >
                  Profile
                </Button>
                <Button
                  variant="subtle"
                  color="white"
                  fullWidth
                  onClick={() => {
                    handleSetting();
                    close();
                  }}
                  leftSection={<IconSettings size={20} />}
                >
                  Settings
                </Button>
                {role !== Role.Member && (
                  <Button
                    variant="subtle"
                    color="white"
                    fullWidth
                    onClick={close}
                    leftSection={<IconBell size={20} />}
                  >
                    Notifications
                  </Button>
                )}
                <Button
                  variant="subtle"
                  color="white"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    close();
                  }}
                  leftSection={<IconLogout size={20} />}
                >
                  Logout
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Flex justify="center" align="center" gap="sm" direction="column">
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
                    <NavLink
                      to="/signup/sponsor"
                      onClick={close}
                      style={{ textDecoration: 'none' }}
                    >
                      <Menu.Item>Sponsor</Menu.Item>
                    </NavLink>
                    <NavLink to="/signup/alumni" onClick={close} style={{ textDecoration: 'none' }}>
                      <Menu.Item>Alumni</Menu.Item>
                    </NavLink>
                  </Menu.Dropdown>
                </Menu>

                <NavLink
                  to="/login"
                  onClick={close}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
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
