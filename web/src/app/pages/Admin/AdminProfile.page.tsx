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
import EditModal from '../../components/Modal/EditModal';
import {EditAvatar} from '../../components/Modal/EditAvatar';
import {EditBannerModal} from '../../components/Modal/EditBannerModal';
import styles from '../../styles/SponsorProfile.module.css';

export function AdminProfile() {
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  const [adminData, setAdminData] = useState({
    fullName: 'Alex Johnson',
    email: 'admin@example.com',
    phone: '+64 21 123 4567',
    joined: '2023-10-01',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    banner:
      'https://images.unsplash.com/photo-1504384308090-cb064f939db4?auto=format&fit=crop&w=500&q=80',
    bio: 'System administrator overseeing user onboarding, approvals and infrastructure maintenance. Responsible for managing permissions, deactivating accounts, and ensuring platform security.',
  });

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth,
  );
  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleAvatarChange = () => {
    setModalType('avatar');
    setModalContent(<EditAvatar avatar={""} role={"admin"} />);
    setModalTitle('Profile Photo');
    setOpenProfileModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setModalContent(<EditBannerModal banner={""} role={"admin"} />);
    setModalTitle('Banner Photo');
    setOpenProfileModal(true);
  };

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

      <Grid>
        <Grid.Col span={{md: 3, xs: 12}}>
          <Box ml={20} mt={20}>
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

        <Grid.Col span={{md: 9, xs: 12}}>
          <Box mx={20} mt={20}>
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {adminData.bio ? (
                <>
                  {showMoreDescription ? (
                    <Text size="md">{adminData.bio}</Text>
                  ) : (
                    <Text size="md">{adminData.bio.slice(0, 1200)}</Text>
                  )}
                  {adminData.bio.length > 1200 && (
                    <Button
                      size="sm"
                      variant="subtle"
                      pl={0}
                      pr={0}
                      onClick={() =>
                        setShowMoreDescription(!showMoreDescription)
                      }
                    >
                      {showMoreDescription ? 'Show less' : 'View more'}
                    </Button>
                  )}
                </>
              ) : (
                <Loader color="blue" />
              )}
            </Box>
          </Box>

          <Divider my="xl" />
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
