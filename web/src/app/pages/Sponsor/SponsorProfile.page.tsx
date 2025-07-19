import { Card, Avatar, Text, Box, Title, Button, Grid, Flex, Loader } from '@mantine/core';
import styles from '../../styles/SponsorProfile.module.css';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { JobCarousel } from '../../components/JobCardCarousel/JobCarousel';
import { JobCardProps } from '../../components/JobCardCarousel/JobCard';
import { Role } from '@/app/type/role';
import { EditAvatar } from '@/app/components/Modal/EditAvatar';
import { EditBannerModal } from '@/app/components/Modal/EditBannerModal';
import { EditSponsorProfile } from '@/app/components/Modal/EditSponsorProfile';
import EditModal from '@/app/components/Modal/EditModal';
import { fetchSponsorById } from '@/api/sponsor';
import { useParams, useNavigate } from 'react-router-dom';
import { Sponsor } from '@/models/sponsor.model';
import { Job } from '@/models/job.model';
import { fetchJobsByPublisherId } from '@/api/job';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

const PLACEHOLDER_BANNER = "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
const PLACEHOLDER_AVATAR = "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"

export function SponsorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const [showMoreDescription, setShowMoreDescription] = useState(false);

  const [userData, setUserData] = useState<Sponsor | null>(null);
  const [jobData, setJobData] = useState<JobCardProps[]>([]);

  const [isLocalProfile, setIsLocalProfile] = useState(false) // Is this profile this user's profile (aka. should we show the edit button)
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

  console.log(
    'Change this SponsorPage component to use real role from Redux store once user integration is implemented'
  );

  const handleAvatarChange = () => {
    setModalType('avatar');
    setModalContent(<EditAvatar avatar={userData?.logo ?? PLACEHOLDER_AVATAR} />);
    setModalTitle('Profile Photo');
    setOpenProfileModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setModalContent(<EditBannerModal banner={PLACEHOLDER_BANNER} />);
    setModalTitle('Banner Photo');
    setOpenProfileModal(true);
  };

  const handleProfileChange = () => {
    setModalType('profile');
    setModalContent(<EditSponsorProfile />);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleJobOpportunitiesChange = () => {
    setModalType('jobOpportunities');
    setOpenModal(true);
  };

  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchSponsorById(id as string);
        if (!userData) {
          navigate("/404")
          return;
        }
        setUserData(userData);
        setIsLocalProfile(userData.id == userId);
        const jobs: Job[] = await fetchJobsByPublisherId(id as string);
        const jobsForJobCard = jobs.map((thisJob) => {
          return {
            title: thisJob.title,
            subtitle: "Placeholder subtitle",
            description: thisJob.description,
            jobLink: "#", // TODO: correctly link to job details page
            jobID: thisJob.id
          }
        })
        setJobData(jobsForJobCard)
      } catch (err) {
        // TODO: proper error handling (eg. auth errors/forbidden pages etc.)
        navigate("/404")
      }
    };
    if (id) fetchUserData();
  }, [id]);

  // methods to get elements based on user type
  const getElementBasedOnRole = (element: string) => {
    switch (userRole) {
      case 'sponsor':
        return getSponsorElements(element);
      case 'member':
        return getStudentElements(element);
      case 'alumni':
        return getAlumniElements(element);
      case 'admin':
        return getAdminElements(element);
    }
  };

  const getSponsorElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        if (!isLocalProfile) return null;
        return (
          <Button
            onClick={handleProfileChange}
            classNames={{
              root: styles.button_root,
            }}
          >
            Edit Profile
          </Button>
        );
      case 'addNewBtn':
        return (
          <Button
            onClick={handleJobOpportunitiesChange}
            leftSection={<IconPlus stroke={3} size={'1rem'} />}
            classNames={{
              root: styles.button_root,
            }}
          >
            Add New
          </Button>
        );
    }
  };

  const getStudentElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        return null;
      case 'addNewBtn':
        return null;
    }
  };

  const getAlumniElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        return null;
      case 'addNewBtn':
        return null;
    }
  };

  const getAdminElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        return (
          <Button
            onClick={handleDeactivateUserChange}
            classNames={{
              root: styles.button_admin_root,
            }}
          >
            Deactivate User
          </Button>
        );
      case 'addNewBtn':
        return null;
    }
  };

  return (
    <Box className={styles.container}>
      {/* PICTURE AND COMPANY DETAILS */}
      <Card h={280} className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          style={{ backgroundImage: `url(${PLACEHOLDER_BANNER})` }}
        />
        {userData?.name && (
          <Text className={styles.name} pl={170} pt={140}>
            {userData.name}
          </Text>
        )}

        <Avatar
          src={userData?.logo ?? PLACEHOLDER_AVATAR}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />
        <Text size="lg" mt={-30} ml={170} className={styles.text}>
          {userData?.industry}
        </Text>
      </Card>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        {getElementBasedOnRole('profileBtn')}
      </Flex>

      <Grid>
        <Grid.Col span={{ md: 2.5, xs: 12 }}>
          {/* CONTACT */}
          <Box ml={20} mt={15}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData?.email && <Text size="md">{userData.email}</Text>}
              {userData?.phoneNumber && <Text size="lg">{userData.phoneNumber}</Text>}
              {!userData && <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={10}>
            {/* ABOUT ME SECTION */}
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {/* Conditionally render the full description based on showMore state */}
              {userData?.desc && (
                <>
                  {showMoreDescription ? (
                    <Text size="md">{userData.desc}</Text>
                  ) : (
                    <>
                      <Text size="md">{userData.desc.substring(0, 1200)}</Text>
                    </>
                  )}
                  {userData.desc?.length > 1200 ? (
                    <Button
                      variant="subtle"
                      size="sm"
                      pl={0}
                      pr={0}
                      pt={0}
                      pb={0}
                      onClick={() => setShowMoreDescription(!showMoreDescription)}
                    >
                      {showMoreDescription ? 'Show less' : 'View more'}
                    </Button>
                  ) : null}
                </>
              )}
              {!userData?.desc && <Loader color="blue" />}
            </Box>
          </Box>
          <Box
            ml={20}
            mt={30}
            display="flex"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {/* JOB OPPORTUNITIES CAROUSEL */}
            <Box miw="100%">
              <Flex
                style={{ display: 'flex', justifyContent: 'space-between', marginRight: '20px' }}
              >
                <Title order={5}>Job Opportunities</Title>
                {getElementBasedOnRole('addNewBtn')}
              </Flex>
              <Flex mt={15} justify={'center'} align={'center'}>
                <JobCarousel jobs={jobData} />
              </Flex>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
      <EditModal
        opened={openProfileModal}
        close={() => setOpenProfileModal(false)}
        content={modalContent}
        title={modalTitle}
      ></EditModal>
    </Box>
  );
}
