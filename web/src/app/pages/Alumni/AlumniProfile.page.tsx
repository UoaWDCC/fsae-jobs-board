import { Card, Avatar, Box, Title, Button, Grid, Flex, Loader, Image, Text } from '@mantine/core';
import { EditableField } from '../../components/EditableField';
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
import { subGroupDisplayMap } from '@/app/utils/field-display-maps';
import { SubGroup } from '@/models/subgroup.model';
import { ActivateDeactivateAccountButton } from '@/app/components/AdminDashboard/ActivateDeactivateAccountButton';
import { FsaeRole } from '@/models/roles';


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

  /*
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
  };*/
  
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
          //onClick={handleBannerChange}
          style={{ backgroundImage: `url(${userData?.bannerURL})`}}
        />
        <Box className={styles.name} pl={170} pt={140}>
          <EditableField
            value={userData?.firstName || ''}
            placeholder="First name"
            fieldName="firstName"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, firstName: value });
              }
            }}
            editable={isLocalProfile}
            required
            validation={(value) => {
              if (!value.trim()) return 'First name is required';
              return null;
            }}
            className={styles.firstName}
            size={undefined}
          />
          <EditableField
            value={userData?.lastName || ''}
            placeholder="Last name"
            fieldName="lastName"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, lastName: value });
              }
            }}
            editable={isLocalProfile}
            required
            validation={(value) => {
              if (!value.trim()) return 'Last name is required';
              return null;
            }}
            className={styles.lastName}
            size={undefined}
          />
        </Box>
        <Box pl={170} pt={160}>
          <EditableField
            value={userData?.subGroup || ''}
            placeholder="FSAE sub-team"
            fieldName="subGroup"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, subGroup: value as SubGroup });
              }
            }}
            editable={isLocalProfile}
            className={styles.subGroup}
            size="xl"
          />
        </Box>
        <Avatar
          src={userData?.avatarURL}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          //onClick={handleAvatarChange}
        />
        <Text size="lg" mt={-50} ml={170} className={styles.text}>
          {`${userData?.subGroup ? subGroupDisplayMap[userData?.subGroup] : ""}`}
        </Text>
        {userRole === "admin" && (
          <Box style={{ position: 'absolute', top: 20, right: 20 }}>
            <ActivateDeactivateAccountButton 
              userId={id} 
              role={FsaeRole.MEMBER}
              activated={userData?.activated}
            />
          </Box>
        )}
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
              {userData ? (
                <>
                  <EditableField
                    size="md"
                    value={userData.email}
                    placeholder="Email"
                    fieldName="email"
                    userId={id as string}
                    userRole="alumni"
                    type="email"
                    onUpdate={(_, value) => {
                      setUserData({ ...userData, email: value });
                    }}
                    editable={isLocalProfile}
                    required
                    validation={(value) => {
                      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
                      if (!emailPattern.test(value)) return 'Please enter a valid email';
                      return null;
                    }}
                  />
                  <EditableField
                    size="lg"
                    value={userData.phoneNumber}
                    placeholder="Phone number"
                    fieldName="phoneNumber"
                    userId={id as string}
                    userRole="alumni"
                    type="tel"
                    onUpdate={(_, value) => {
                      setUserData({ ...userData, phoneNumber: value });
                    }}
                    editable={isLocalProfile}
                    required
                  />
                </>
              ) : (
                <Loader color="blue" />
              )}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={10}>
            {/* ABOUT ME SECTION */}
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <EditableField
                  size="md"
                  value={userData.description || ''}
                  placeholder="Tell us about yourself..."
                  fieldName="description"
                  userId={id as string}
                  userRole="alumni"
                  type="textarea"
                  onUpdate={(_, value) => {
                    setUserData({ ...userData, description: value });
                  }}
                  editable={isLocalProfile}
                  maxLength={1500}
                  minRows={4}
                />
              ) : (
                <Loader color="blue" />
              )}
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
