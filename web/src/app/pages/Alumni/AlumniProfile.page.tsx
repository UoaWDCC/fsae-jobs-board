import { Card, Avatar, Text, Box, Title, Button, Grid, Flex, Loader, Image } from '@mantine/core';
import styles from '../../styles/SponsorProfile.module.css';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { JobCarousel } from '../../components/JobCardCarousel/JobCarousel';
import { JobCardProps } from '../../components/JobCardCarousel/JobCard';
import { Role } from '@/app/type/role';
import EditModal from '../../components/Modal/EditModal';
import EditAlumniProfile from '../../components/Modal/EditAlumniProfile';
import { EditAvatar } from '../../components/Modal/EditAvatar';
import { EditBannerModal } from '../../components/Modal/EditBannerModal';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlumniById } from '@/api/alumni';
import { fetchJobsByPublisherId } from '@/api/job';
import { Alumni } from '@/models/alumni.model';
import { Job } from "@/models/job.model";
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { jwtDecode } from 'jwt-decode';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';

const PLACEHOLDER_BANNER = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
const PLACEHOLDER_AVATAR = "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"


export function AlumniProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false); // look better into this stuff. im not really sure how we are using the modals :3
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isLocalProfile, setIsLocalProfile] = useState(false) // Is this profile this user's profile (aka. should we show the edit button)
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

  interface JwtPayload {
    role?: string;
  }

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  try {
    if (!token) {
      setRole(Role.Unknown);
      return;
    }
    const payload = jwtDecode<JwtPayload>(token);
    const decoded = payload.role?.toLowerCase();

    if (Object.values(Role).includes(decoded as Role)) {
      setRole(decoded as Role);
    } else {
      setRole(Role.Unknown);
    }
  } catch {
    setRole(Role.Unknown);
  }
}, []);


  const handleAvatarChange = () => {
    setModalType('avatar');
    setOpenProfileModal(true);
    // Alumni avatar doesnt exist in the model yet
    //setModalContent(<EditAvatar avatar={userData?.avatar} />);
    setModalContent(<EditAvatar avatar={""} />);
    setModalTitle('Profile Photo');
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setOpenProfileModal(true);
    // Banner doesnt exist in alumni model yet
    //setModalContent(<EditBannerModal banner={userData?.banner} />)
    setModalContent(<EditBannerModal banner={""} />)
    setModalTitle('Banner Photo');
  };
  
  const handleProfileChange = () => {
    if (!userData) return;
    setOpenProfileModal(true);
    setModalContent(
      <EditAlumniProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)} />
    );
    setModalTitle('Edit Profile');
  };

  const handleJobOpportunitiesChange = () => {
    setModalType('jobOpportunities');
    setOpenModal(true);
  };

  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  const [userData, setUserData] = useState<Alumni | null>(null);
  const handleDeactivateAccount = (reason: string) => {
    console.log('Account deactivated:', reason);
    setDeactivateModalOpen(false);
    // trigger backend call to deactivate account.
  };

  

  const [jobData, setJobData] = useState<JobCardProps[]>([]);

  useEffect(() => {
    // Logic to fetch data and setUserData
    const fetchUserData = async () => {
      try {
        const userData = await fetchAlumniById(id as string);
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
        return null;
      case 'addNewBtn':
        return null;
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
        if (!isLocalProfile) return null;
        return (
          <Button
            onClick={handleJobOpportunitiesChange}
            leftSection={<IconPlus stroke={3} size={'1rem'} />}
            classNames={{
              root: styles.button_root,
            }}
            style={{ marginLeft: '10px' }}
          >
            Add New
          </Button>
        );
    }
  };

  const getAdminElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        return (
          <Button
            onClick={() => setDeactivateModalOpen(true)}
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
      <Card className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          // TODO: userData?.banner ?? PLACEHOLDER_BANNER
          // Alumni model doesnt currently have a banner field
          style={{ backgroundImage: `url(${PLACEHOLDER_BANNER})`}}
        />
        {(userData?.firstName && userData?.lastName) && (
          <Text className={styles.name} pl={170} pt={140}>
            {userData.firstName + " " + userData.lastName}
          </Text>
        )}
        {userData?.subGroup && (
          <Text size="xl" className={styles.subGroup} pl={170} pt={160}>
            {userData.subGroup}
          </Text>
        )}

        <Avatar
          //TODO: Use alumni avatar (not in the model yet as of writing) src={userData?.avatar ?? PLACEHOLDER_AVATAR}
          src={PLACEHOLDER_AVATAR}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />
        <Text size="lg" mt={-30} ml={170} className={styles.text}>
          {"Company Placeholder"}
        </Text>
      </Card>

      <Flex className={styles.profileBtn}>
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
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginRight: '20px',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
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

      <DeactivateAccountModal
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateAccount}
        opened={deactivateModalOpen}
      />
    </Box>
  );
}
