import { Card, Avatar, Text, Box, Title, Button, Grid, Flex, Loader } from '@mantine/core';
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
import { fetchJobsByPublisherId } from '@/api/job';
import { Alumni } from '@/models/alumni.model';
import { Job } from '@/models/job.model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';
import { subGroupDisplayMap } from '@/app/utils/field-display-maps';
import { SubGroup } from '@/models/subgroup.model';

export function AlumniProfile() {
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
  const [userData, setUserData] = useState<Alumni | null>(null);

  const userRole = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.id);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleAvatarChange = () => {
    setModalType('avatar');
    setModalContent(<EditAvatar avatar={userData?.avatarURL} />);
    setModalTitle('Profile Photo');
    setOpenProfileModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setModalContent(<EditBannerModal banner={userData?.bannerURL} />);
    setModalTitle('Banner Photo');
    setOpenProfileModal(true);
  };

  const handleProfileChange = () => {
    setModalType('profile');
    setModalContent(
      <EditAlumniProfile
        userData={userData}
        setUserData={setUserData}
        close={() => setOpenProfileModal(false)}
      />
    );
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleJobOpportunitiesChange = () => {
    setOpenJobEditorModal(true);
  };

  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  const handleJobSaved = () => {
    const reload = async () => {
      try {
        const js: Job[] = await fetchJobsByPublisherId(id as string);
        const mapped = js.map((j) => ({
          id: j.id,
          title: j.title,
          specialisation: j.specialisation,
          description: j.description,
          roleType: j.roleType || 'Full-time',
          salary: j.salary,
          applicationDeadline: j.applicationDeadline,
          datePosted: j.datePosted,
          publisherID: j.publisherID,
        }));
        setJobData(mapped);
      } catch {}
    };
    if (id) reload();
    setOpenJobEditorModal(false);
    setEditingJob(null);
  };

  const handleDeactivateAccount = (reason: string) => {
    setDeactivateModalOpen(false);
  };

  const fetchAvatar = async () => {
    if (!id) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const resp = await fetch(`http://localhost:3000/user/alumni/${id}/avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setUserData((prev) => (prev ? { ...prev, avatarURL: url } : prev));
      return () => URL.revokeObjectURL(url);
    } catch {}
  };

  const fetchBanner = async () => {
    if (!id) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const resp = await fetch(`http://localhost:3000/user/alumni/${id}/banner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setUserData((prev) => (prev ? { ...prev, bannerURL: url } : prev));
      return () => URL.revokeObjectURL(url);
    } catch {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        const u = await fetchAlumniById(id as string);
        if (!u) {
          navigate('/404');
          return;
        }
        setUserData(u);
        setIsLocalProfile(u.id == userId);
        const js: Job[] = await fetchJobsByPublisherId(id as string);
        const mapped = js.map((j) => ({
          id: j.id,
          title: j.title,
          specialisation: j.specialisation,
          description: j.description,
          roleType: j.roleType || 'Full-time',
          salary: j.salary,
          applicationDeadline: j.applicationDeadline,
          datePosted: j.datePosted,
          publisherID: j.publisherID,
        }));
        setJobData(mapped);
      } catch {}
    };
    if (id) load();
    fetchAvatar();
    fetchBanner();
  }, [id]);

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
        return isLocalProfile ? (
          <Button onClick={handleProfileChange} classNames={{ root: styles.button_root }}>
            Edit Profile
          </Button>
        ) : null;
      case 'addNewBtn':
        return isLocalProfile ? (
          <Button
            onClick={handleJobOpportunitiesChange}
            leftSection={<IconPlus stroke={3} size={'1rem'} />}
            classNames={{ root: styles.button_root }}
            style={{ marginLeft: '10px' }}
          >
            Add New
          </Button>
        ) : null;
      default:
        return null;
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
      default:
        return null;
    }
  };

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={isLocalProfile ? handleBannerChange : undefined}
          style={{ backgroundImage: `url(${userData?.bannerURL || ''})` }}
        />

        {/* NAME — same offsets as Sponsor */}
        <Box className={styles.name} pl={170} pt={140}>
          <EditableField
            value={userData?.firstName || ''}
            placeholder="First name"
            fieldName="firstName"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, v) => userData && setUserData({ ...userData, firstName: v })}
            editable={isLocalProfile}
            required
            validation={(v) => (!v.trim() ? 'First name is required' : null)}
            className={styles.companyName} // ← use Sponsor’s heading style
          />
          <EditableField
            value={userData?.lastName || ''}
            placeholder="Last name"
            fieldName="lastName"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, v) => userData && setUserData({ ...userData, lastName: v })}
            editable={isLocalProfile}
            required
            validation={(v) => (!v.trim() ? 'Last name is required' : null)}
            className={styles.companyName} // ← same heading style
          />
        </Box>

        {/* AVATAR — same position as Sponsor */}
        <Avatar
          src={userData?.avatarURL}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={isLocalProfile ? handleAvatarChange : undefined}
        />

        {/* SUBTITLE ROW — same as Sponsor’s industry row */}
        <Box mt={-30} ml={170} className={styles.text}>
          <EditableField
            value={userData?.subGroup || ''}
            placeholder="FSAE sub-team"
            fieldName="subGroup"
            userId={id as string}
            userRole="alumni"
            onUpdate={(_, v) => userData && setUserData({ ...userData, subGroup: v as SubGroup })}
            editable={isLocalProfile}
            size="lg"
          />
        </Box>
      </Card>

      {/* same actions row class as Sponsor */}
      <Flex className={styles.profileBtn}>{getElementBasedOnRole('profileBtn')}</Flex>

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
                    label="Email"
                    placeholder="Click to add email"
                    fieldName="email"
                    userId={id as string}
                    userRole="alumni"
                    type="email"
                    onUpdate={(_, value) => setUserData({ ...userData, email: value })}
                    editable={isLocalProfile}
                    required
                    validation={(v) =>
                      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)
                        ? null
                        : 'Please enter a valid email'
                    }
                  />
                  <EditableField
                    size="lg"
                    value={userData.phoneNumber}
                    label="Phone Number"
                    placeholder="Click to add phone number"
                    fieldName="phoneNumber"
                    userId={id as string}
                    userRole="alumni"
                    type="tel"
                    onUpdate={(_, value) => setUserData({ ...userData, phoneNumber: value })}
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
            {/* match Sponsor label */}
            <Title order={5}>About</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <EditableField
                  size="md"
                  value={userData.description || ''}
                  label="About Me"
                  placeholder="Click to add a description about yourself..."
                  fieldName="description"
                  userId={id as string}
                  userRole="alumni"
                  type="textarea"
                  onUpdate={(_, value) => setUserData({ ...userData, description: value })}
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
            <Box miw="100%">
              <Flex
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginRight: '20px',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <Title order={5}>Job Opportunities</Title>
                {getElementBasedOnRole('addNewBtn')}
              </Flex>
              <Flex mt={15} justify="center" align="center">
                <JobCarousel jobs={jobData} />
              </Flex>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>

      <EditModal
        opened={openProfileModal}
        close={() => {
          setOpenProfileModal(false);
          if (modalType === 'avatar') fetchAvatar();
          if (modalType === 'banner') fetchBanner();
        }}
        content={modalContent}
        title={modalTitle}
      />

      <JobEditorModal
        opened={openJobEditorModal}
        onClose={() => setOpenJobEditorModal(false)}
        onSuccess={handleJobSaved}
        initialData={editingJob}
        mode={editingJob ? 'edit' : 'create'}
      />

      <DeactivateAccountModal
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateAccount}
        opened={deactivateModalOpen}
      />
    </Box>
  );
}
