import {useState, useEffect} from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Loader,
  Text,
  Title,
} from '@mantine/core';
import { EditAvatar } from '../../components/Modal/EditAvatar';
import { EditBannerModal } from '../../components/Modal/EditBannerModal';
import EditModal from '../../components/Modal/EditModal';
import styles from '../../styles/SponsorProfile.module.css';
import {Role} from '@/app/type/role';

export function AdminProfile() {
  /* ─── modal plumbing ────────────────────────── */
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleAvatarChange = () => {
    setModalTitle('Profile Photo');
    setModalContent(<EditAvatar avatar={adminData.avatar} />);
    setOpenProfileModal(true);
  };

  const handleBannerChange = () => {
    setModalTitle('Banner Photo');
    setModalContent(<EditBannerModal banner={adminData.banner} />);
    setOpenProfileModal(true);
  };

  const handleDeactivateUser = () => {
    // TODO: hook up deactivate logic
    alert('Deactivate-User clicked');
  };

  /* ─── dummy admin data (replace with real fetch) ─── */
  const [adminData, setAdminData] = useState({
    fullName: 'Alex Johnson',
    email: 'admin@example.com',
    phone: '+64 21 123 4567',
    joined: '2023-10-01',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    banner:
      'https://images.unsplash.com/photo-1504384308090-cb064f939db4?auto=format&fit=crop&w=500&q=80',
    bio: 'System administrator overseeing user onboarding, approvals and infra maintenance.',
  });

  /* ─── responsiveness hook (portrait / landscape) ── */
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth,
  );
  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ─── render ─────────────────────────────────────── */
  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          style={{backgroundImage: `url(${adminData.banner})`}}
        />
        <Text className={styles.name}>{adminData.fullName}</Text>

        <Avatar
          src={adminData.avatar}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />

        <Text size="md" className={styles.text}>
          Administrator
        </Text>
      </Card>

      {/* Deactivate-User button (admin-only) */}
      <Flex className={styles.profileBtn}>
        <Button
          onClick={handleDeactivateUser}
          classNames={{root: styles.button_admin_root}}
        >
          Deactivate User
        </Button>
      </Flex>

      <Grid>
        {/* Contact card */}
        <Grid.Col span={{md: 3, xs: 12}}>
          <Box ml={20} mt={15}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              <Text size="md">{adminData.email}</Text>
              <Text size="md">{adminData.phone}</Text>
              <Text size="sm" c="dimmed">
                Joined&nbsp;{adminData.joined}
              </Text>
            </Box>
          </Box>
        </Grid.Col>

        {/* Bio + placeholder for Admin dashboard widgets */}
        <Grid.Col span={{md: 9, xs: 12}}>
          <Box mx={20} mt={10}>
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {adminData.bio || <Loader color="blue" />}
            </Box>
          </Box>

          <Divider my="xl" />

          <Box mx={20}>
            <Title order={5}>Admin Dashboard</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {/* Replace with widgets / charts / tables as needed */}
              <Text size="sm" c="dimmed">
                (Dashboard widgets coming soon…)
              </Text>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>

      <EditModal
        opened={openProfileModal}
        close={() => setOpenProfileModal(false)}
        content={modalContent}
        title={modalTitle}
      />
    </Box>
  );
}
