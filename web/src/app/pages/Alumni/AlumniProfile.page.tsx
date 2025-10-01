import { Card, Avatar, Box, Title, Button, Grid, Flex, Loader, Image, Text } from '@mantine/core';
import { Card, Avatar, Box, Title, Button, Grid, Flex, Loader, Text } from '@mantine/core';
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
import { useMediaQuery } from '@mantine/hooks';

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

  // Handle profile editing modal
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

  // Handle job save → refresh jobs
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
    const fetchUserData = async () => {
      try {
        const userData = await fetchAlumniById(id as string);
        if (!userData) {
          navigate("/404");
          return;
        }
        setUserData(userData);
        setIsLocalProfile(userData.id == userId);
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
        console.error(err);
      }
    };
    if (id) fetchUserData();
  }, [id]);

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
        return (
          <Button
            onClick={handleDeactivateUserChange}
            classNames={{ root: styles.button_admin_root }}
          >
            Deactivate User
          </Button>
        );
    }
  };

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        {/* Banner */}
        <Card.Section
          h={250}
          className={styles.banner}
          style={{ backgroundImage: `url(${userData?.bannerURL})` }}
        />

        {/* Avatar → Name → Subgroup (stacked) */}
        <Flex direction="column" align="center" mt={-75}>
          <Avatar
            src={userData?.avatarURL}
            size={isMobile ? 110 : 150}
            className={styles.avatar}
          />
          {/* Name from EditableFields, no UNKNOWN fallback */}
          <Flex>
            <EditableField
              value={userData?.firstName || ''}
              placeholder="First name"
              fieldName="firstName"
              userId={id as string}
              userRole="alumni"
              onUpdate={(_, value) => userData && setUserData({ ...userData, firstName: value })}
              editable={isLocalProfile}
              required
              validation={(value) => (!value.trim() ? 'First name is required' : null)}
              className={styles.firstName}
            />
            <EditableField
              value={userData?.lastName || ''}
              placeholder="Last name"
              fieldName="lastName"
              userId={id as string}
              userRole="alumni"
              onUpdate={(_, value) => userData && setUserData({ ...userData, lastName: value })}
              editable={isLocalProfile}
              required
              validation={(value) => (!value.trim() ? 'Last name is required' : null)}
              className={styles.lastName}
            />
          </Flex>
          {userData?.subGroup && (
            <Text size="sm" className={styles.subGroup}>
              {subGroupDisplayMap[userData.subGroup]}
            </Text>
          )}
        </Flex>
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
                  <EditableField
                    size="md"
                    value={userData.email}
                    placeholder="Email"
                    fieldName="email"
                    userId={id as string}
                    userRole="alumni"
                    type="email"
                    onUpdate={(_, value) => setUserData({ ...userData, email: value })}
                    editable={isLocalProfile}
                    required
                  />
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
        </Grid.Col>
      </Grid>

      {/* Modals */}
      <EditModal
        opened={openProfileModal}
        close={() => setOpenProfileModal(false)}
        content={modalContent}
        title={modalTitle}
      />
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
