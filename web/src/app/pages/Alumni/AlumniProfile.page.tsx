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
import { JobEditorModal } from '@/app/components/Modal/EditJob';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlumniById } from '@/api/alumni';
import { fetchJobsByPublisherId } from '@/api/job';
import { Alumni } from '@/models/alumni.model';
import { Job } from "@/models/job.model";
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';
import { subGroupDisplayMap } from '@/app/utils/field-display-maps';
import { SubGroup } from '@/models/subgroup.model';

export function AlumniProfile() {
  // UseState for future modal implementation
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [role, setRole] = useState<Role>(Role.Alumni); // Dummy role, replace with actual role from Redux store
  const [modalTitle, setModalTitle] = useState('');
  const [openJobEditorModal, setOpenJobEditorModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocalProfile, setIsLocalProfile] = useState(false) // Is this profile this user's profile (aka. should we show the edit button)
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /*
  const handleAvatarChange = () => {
    setModalType('avatar');
    setOpenProfileModal(true);
    setModalContent(<EditAvatar avatar={userData?.avatar} />);
    setModalTitle('Profile Photo');
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setOpenProfileModal(true);
    setModalContent(<EditBannerModal banner={userData?.banner} />)
    setModalTitle('Banner Photo');
  };*/
  
  const handleProfileChange = () => {
    setOpenProfileModal(true);
    setModalContent(
      <EditAlumniProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)} />
    );
    setModalTitle('Edit Profile');
  };

  const handleJobOpportunitiesChange = () => {
    navigate('/job-editor');
  };

  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  const [userData, setUserData] = useState<Alumni | null>(null);
  
  const handleJobSaved = () => {
    // Reload jobs to get updated data
    const fetchUserData = async () => {
      try {
        const jobs: Job[] = await fetchJobsByPublisherId(id as string);
        const jobsForJobCard = jobs.map((thisJob) => {
          return {
            id: thisJob.id,
            title: thisJob.title,
            specialisation: thisJob.specialisation,
            description: thisJob.description,
            roleType: thisJob.roleType || "Full-time",
            salary: thisJob.salary,
            applicationDeadline: thisJob.applicationDeadline,
            datePosted: thisJob.datePosted,
            publisherID: thisJob.publisherID
          }
        });
        setJobData(jobsForJobCard);
      } catch (err) {
        console.error('Failed to reload jobs:', err);
      }
    };
    if (id) fetchUserData();
    setOpenJobEditorModal(false);
    setEditingJob(null);
  };

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
            id: thisJob.id,
            title: thisJob.title,
            specialisation: thisJob.specialisation,
            description: thisJob.description,
            roleType: thisJob.roleType || "Full-time",
            salary: thisJob.salary,
            applicationDeadline: thisJob.applicationDeadline,
            datePosted: thisJob.datePosted,
            publisherID: thisJob.publisherID
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

      <JobEditorModal
        opened={openJobEditorModal}
        onClose={() => setOpenJobEditorModal(false)}
        onSuccess={handleJobSaved}
        initialData={editingJob}
        mode={editingJob ? "edit" : "create"}
      />
      <DeactivateAccountModal
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateAccount}
        opened={deactivateModalOpen}
      />
    </Box>
  );
}
