import { Card, Avatar, Text, Box, Title, Button, Grid, Flex, Loader, Anchor } from '@mantine/core';
import { EditableField } from '../../components/EditableField';
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
import { jwtDecode } from 'jwt-decode';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';
import { ActivateDeactivateAccountButton } from '@/app/components/AdminDashboard/ActivateDeactivateAccountButton';
import { FsaeRole } from '@/models/roles';

export function SponsorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false); // look better into this stuff. im not really sure how we are using the modals :3
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);


  const [userData, setUserData] = useState<Sponsor | null>(null);
  const [jobData, setJobData] = useState<JobCardProps[]>([]);

  const [newUserData, setNewUserData] = useState<Partial<Sponsor> | null>(null); // partial because the database schema is currently messed up

  const [isLocalProfile, setIsLocalProfile] = useState(false) // Is this profile this user's profile (aka. should we show the edit button)
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user
/*
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
  };*/

  const handleProfileChange = () => {
    setModalType('profile');
    setModalContent(<EditSponsorProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)}/>);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleJobOpportunitiesChange = () => {
    setModalType('jobOpportunities');
    setOpenModal(true);
  };

  //wtf?? shouldve been done but idefk whats happening here
  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  const handleDeactivateAccount = (reason: string) => {
    console.log('Account deactivated:', reason);
    setDeactivateModalOpen(false);
    // trigger backend call to deactivate account.
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
            style={{ marginLeft: '10px' }}
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
          style={{ backgroundImage: `url(${userData?.bannerURL})` }}
        />
        <Box className={styles.name} pl={170} pt={140}>
          <EditableField
            value={userData?.companyName || ''}
            placeholder="Company name"
            fieldName="companyName"
            userId={id as string}
            userRole="sponsor"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, companyName: value });
              }
            }}
            editable={isLocalProfile}
            required
            validation={(value) => {
              if (!value.trim()) return 'Company name is required';
              return null;
            }}
            className={styles.companyName}
            size={undefined}
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
        <Box mt={-30} ml={170} className={styles.text}>
          <EditableField
            value={userData?.industry || ''}
            placeholder="Click to add industry"
            fieldName="industry"
            userId={id as string}
            userRole="sponsor"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, industry: value });
              }
            }}
            editable={isLocalProfile}
            size="lg"
          />
        </Box>
        {userRole === "admin" && (
          <Box style={{ position: 'absolute', top: 20, right: 20 }}>
            <ActivateDeactivateAccountButton 
              userId={id} 
              role={FsaeRole.SPONSOR}
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
                    label="Email"
                    placeholder="Click to add email"
                    fieldName="email"
                    userId={id as string}
                    userRole="sponsor"
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
                    label="Phone Number"
                    placeholder="Click to add phone number"
                    fieldName="phoneNumber"
                    userId={id as string}
                    userRole="sponsor"
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
            <Title order={5}>About</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <EditableField
                  size="md"
                  value={userData.description || ''}
                  label="About Us"
                  placeholder="Click to add a description about your company..."
                  fieldName="description"
                  userId={id as string}
                  userRole="sponsor"
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
