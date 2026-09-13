import { Card, Avatar, Box, Title, Button, Grid, Flex, Loader, Image, Text } from '@mantine/core';
import { EditableField } from '../../components/EditableField';
import styles from '../../styles/SponsorProfile.module.css';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { JobCarousel } from '../../components/JobCardCarousel/JobCarousel';
import { JobCardProps } from '../../components/JobCardCarousel/JobCard';
import EditModal from '../../components/Modal/EditModal';
import EditAlumniProfile from '../../components/Modal/EditAlumniProfile';
import { EditAvatar } from '../../components/Modal/EditAvatar';
import { EditBannerModal } from '../../components/Modal/EditBannerModal';
import { JobEditorModal } from '@/app/components/Modal/EditJob';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlumniById } from '@/api/alumni';
import { API_BASE_URL } from '@/api/ApiInstance';
import { fetchJobsByPublisherId } from '@/api/job';
import { Alumni } from '@/models/alumni.model';
import { Job } from "@/models/job.model";
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';
import { subGroupDisplayMap } from '@/app/utils/field-display-maps';
import { useMediaQuery } from '@mantine/hooks';
import { ActivateDeactivateAccountButton } from '@/app/components/AdminDashboard/ActivateDeactivateAccountButton';
import { FsaeRole } from '@/models/roles';
import { ApplicationHistory } from '@/app/components/ApplicationHistory';

export function AlumniProfile() {
  const isMobile = useMediaQuery('(max-width: 500px)');

  // State for modals and profile editing
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [openJobEditorModal, setOpenJobEditorModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobData, setJobData] = useState<JobCardProps[]>([]);
  const [isLocalProfile, setIsLocalProfile] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  // Alumni data
  const [userData, setUserData] = useState<Alumni | null>(null);

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const handleAvatarChange = () => {
    setModalType('avatar');
    setOpenProfileModal(true);
    setModalContent(<EditAvatar avatar={""} role={"alumni"} />);
    setModalTitle('Profile Photo');
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setOpenProfileModal(true);
    setModalContent(<EditBannerModal banner={""} role={"alumni"} />)
    setModalTitle('Banner Photo');
  };
  
  const handleProfileChange = () => {
    setOpenProfileModal(true);
    setModalContent(
      <EditAlumniProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)} />
    );
    setModalTitle('Edit Profile');
  };

  // Handle job posting
  const handleJobOpportunitiesChange = () => {
    navigate('/job-editor');
  };

  // Handle admin deactivate
  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  const fetchAvatar = async () => {
    if (!id) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/user/alumni/${id}/avatar`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setUserData(prev => prev ? { ...prev, avatarURL: url } : prev);
    } else {
      setUserData(prev => prev ? { ...prev, avatarURL: '' } : prev);
    }
  };

  const fetchBanner = async () => {
    if (!id) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/user/alumni/${id}/banner`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setUserData(prev => prev ? { ...prev, bannerURL: url } : prev);
    } else {
      setUserData(prev => prev ? { ...prev, bannerURL: '' } : prev);
    }
  };
  
  const handleJobSaved = () => {
    const fetchUserData = async () => {
      try {
        const jobs: Job[] = await fetchJobsByPublisherId(id as string);
        const jobsForJobCard = jobs.map((thisJob) => ({
          id: thisJob.id,
          title: thisJob.title,
          specialisation: thisJob.specialisation,
          description: thisJob.description,
          roleType: thisJob.roleType || "Full-time",
          salary: thisJob.salary,
          applicationDeadline: thisJob.applicationDeadline,
          datePosted: thisJob.datePosted,
          publisherID: thisJob.publisherID
        }));
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
  };

  // Fetch alumni data + jobs
  useEffect(() => {
    // Logic to fetch data and setUserData
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        // Fetch user data, avatar, and banner
        const token = localStorage.getItem('accessToken');
        const userPromise = fetchAlumniById(id as string);
        let avatarPromise = Promise.resolve<string | undefined>(undefined);
        let bannerPromise = Promise.resolve<string | undefined>(undefined);

        if (token) {
          avatarPromise = fetch(`${API_BASE_URL}/user/alumni/${id}/avatar`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.blob() : null)
            .then(blob => blob ? URL.createObjectURL(blob) : undefined);

          bannerPromise = fetch(`${API_BASE_URL}/user/alumni/${id}/banner`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.blob() : null)
          .then(blob => blob ? URL.createObjectURL(blob) : undefined);
        }

        const userData = await userPromise;
        if (!userData) {
          navigate("/404");
          return;
        }
        if (isMounted) {
          setUserData(userData);
          setIsLocalProfile(userData.id == userId);
        }
        const [avatarURL, bannerURL] = await Promise.all([avatarPromise, bannerPromise]);
        if (isMounted) {
          setUserData(prev => prev ? { ...prev, avatarURL: avatarURL || "", bannerURL: bannerURL || "" } : prev);
        }
        const jobs: Job[] = await fetchJobsByPublisherId(id as string);
        const jobsForJobCard = jobs.map((thisJob) => ({
          id: thisJob.id,
          title: thisJob.title,
          specialisation: thisJob.specialisation,
          description: thisJob.description,
          roleType: thisJob.roleType || "Full-time",
          salary: thisJob.salary,
          applicationDeadline: thisJob.applicationDeadline,
          datePosted: thisJob.datePosted,
          publisherID: thisJob.publisherID
        }));
        setJobData(jobsForJobCard);
      } catch (err) {
        if (isMounted) {
          navigate("/404");
        }
        // TODO: proper error handling (eg. auth errors/forbidden pages etc.)
        //navigate("/404")
      }
    };
    if (id) fetchUserData();
   }, [id, navigate, userId]);

  // Role-based UI elements
  const getElementBasedOnRole = (element: string) => {
    switch (userRole) {
      case 'alumni':
        return getAlumniElements(element);
      case 'admin':
        return getAdminElements(element);
      default:
        return null;
    }
  };

  const getAlumniElements = (element: string) => {
    switch (element) {
      case 'profileBtn':
        return (
          <Button
            onClick={handleProfileChange}
            classNames={{ root: styles.button_root }}
          >
            Edit Profile
          </Button>
        );
      case 'addNewBtn':
        return (
          <Button
            onClick={handleJobOpportunitiesChange}
            leftSection={<IconPlus stroke={3} size={'1rem'} />}
            classNames={{ root: styles.button_root }}
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
        return null; // Removed duplicate deactivate button - ActivateDeactivateAccountButton handles this
      case 'addNewBtn':
        return null;
    }
  };

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        {/* Banner */}
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          style={{ backgroundImage: `url(${userData?.bannerURL})`}}
        />

        {/* Avatar → Name → Subgroup (stacked) */}
        <Flex direction="column" align="center" mt={-75}>
          <Avatar
            src={userData?.avatarURL}
            size={isMobile ? 110 : 150}
            className={styles.avatar}
          />
        </Flex>
        <Avatar
          src={userData?.avatarURL}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />
        <Text size="lg" mt={-50} ml={170} className={styles.text}>
          {`${userData?.subGroup ? subGroupDisplayMap[userData?.subGroup] : ""}`}
        </Text>
        {userRole === "admin" && (
          <Box style={{ position: 'absolute', top: 20, right: 20 }}>
            <ActivateDeactivateAccountButton 
              userId={id} 
              role={FsaeRole.ALUMNI}
              activated={userData?.activated}
            />
          </Box>
        )}
      </Card>

      {/* Profile controls */}
      <Flex className={styles.profileBtn}>
        {getElementBasedOnRole('profileBtn')}
      </Flex>

      {/* Contact + About Me + Jobs */}
      <Grid>
        <Grid.Col span={{ md: 2.5, xs: 12 }}>
          <Box ml={20} mt={15}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <>
                  <p>{userData.email}</p>
                  <EditableField
                    size="lg"
                    value={userData.phoneNumber}
                    placeholder="Phone number"
                    fieldName="phoneNumber"
                    userId={id as string}
                    userRole="alumni"
                    type="tel"
                    onUpdate={(_, value) => setUserData({ ...userData, phoneNumber: value })}
                    editable={isLocalProfile}
                  />
                </>
              ) : <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={10}>
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
                  onUpdate={(_, value) => setUserData({ ...userData, description: value })}
                  editable={isLocalProfile}
                  maxLength={1500}
                  minRows={4}
                />
              ) : <Loader color="blue" />}
            </Box>
          </Box>

          <Box ml={20} mt={30}>
            <Flex justify="space-between" wrap="wrap" gap="0.5rem">
              <Title order={5}>Job Opportunities</Title>
              {getElementBasedOnRole('addNewBtn')}
            </Flex>
            <Flex mt={15} justify="center" align="center">
              <JobCarousel jobs={jobData} />
            </Flex>
          </Box>

          {isLocalProfile && (
            <Box ml={20} mt={30}>
              <Title order={5}>My Applications</Title>
              <Box pl={15} mt={10} className={styles.box}>
                <ApplicationHistory userId={id as string} />
              </Box>
            </Box>
          )}
        </Grid.Col>
      </Grid>

      {isLocalProfile && (
        <EditModal
          opened={openProfileModal}
          close={() => {
            setOpenProfileModal(false);
            if (modalType === 'avatar') {
              fetchAvatar();
            }
            if (modalType === 'banner') {
              fetchBanner();
            }
          }}
          content={modalContent}
          title={modalTitle}
        ></EditModal>
      )}

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
