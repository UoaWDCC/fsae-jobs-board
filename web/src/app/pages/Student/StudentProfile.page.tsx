import {
  Card,
  Avatar,
  Text,
  Box,
  Title,
  Button,
  Grid,
  ActionIcon,
  Flex,
  Loader,
} from '@mantine/core';
import { EditableField } from '../../components/EditableField';
import styles from '../../styles/StudentProfile.module.css';
import { useEffect, useState } from 'react';
import EditModal from '../../components/Modal/EditModal';
import { EditStudentProfile } from '../../components/Modal/EditStudentProfile';
import { EditAvatar } from '../../components/Modal/EditAvatar';
import { EditBannerModal } from '../../components/Modal/EditBannerModal';
import { Member } from '@/models/member.model';
import { fetchMemberById } from '@/api/member';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { jwtDecode } from 'jwt-decode';
import DeactivateAccountModal from '../../components/Modal/DeactivateAccountModal';
        
const PLACEHOLDER_BANNER = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
const PLACEHOLDER_AVATAR = "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"


export function StudentProfile() {
  // UseState for future modal implementation
  const { id } = useParams();
  const navigate = useNavigate();
  const hasCV = useSelector((state: RootState) => state.user.hasCV);

  const [modalType, setModalType] = useState('');
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false); // look better into this stuff. im not really sure how we are using the modals :3
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreEducation, setShowMoreEducation] = useState(false);


  const [userData, setUserData] = useState<Member | null>(null);
  const [isLocalProfile, setIsLocalProfile] = useState(false) // Is this profile this user's profile (aka. should we show the edit button)
  const [isFirstNameEditing, setIsFirstNameEditing] = useState(false);
  const [isLastNameEditing, setIsLastNameEditing] = useState(false);
  const isAnyNameEditing = isFirstNameEditing || isLastNameEditing;
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

  // TODO: avatar and banner doesnt exist in the member model yet

  /*const handleAvatarChange = () => {
    setModalType('avatar');
    setModalContent(<EditAvatar avatar={userData?.photo} />);
    setModalTitle('Profile Photo');
    setOpenProfileModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setModalContent(<EditBannerModal banner={userData?.banner} />);
    setModalTitle('Banner Photo');
    setOpenProfileModal(true);
  };
  */

  const handleProfileChange = () => {
    setModalType('profile');
    setModalContent(<EditStudentProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)} />);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleOpenCV = async () => {
    if (!id) {
      alert('Member ID invalid');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/member/${id}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CV');
      }

      // fetch CV as blob for opening in a new tab
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');

      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error fetching CV:', error);
      alert('Failed to load CV');
    }
  };
  const handleDeactivateAccount = (reason: string) => {
    console.log('Account deactivated:', reason);
    setDeactivateModalOpen(false);
    // trigger backend call to deactivate account.
  };

  useEffect(() => {
    // Logic to fetch data and setUserData
    const fetchUserData = async () => {
      try {
        const userData = await fetchMemberById(id as string);
        if (!userData) {
          navigate("/404")
          return;
        }
        // Temporary injection of placeholder fields as currently the database model doesnt have any
        const userDataModifiedWithPlaceholders = userData ? {
          ...userData,
          skills: ['Placeholder1', 'Placeholder2', 'Placeholder3', 'React', 'C#', 'Git'],
          education: [
            'Major(s): Master of Software Engineering',
            'Expected Graduation Date: 2026',
            'Major(s): Part II Bachelor of Software Engineering',
            'Graduation Date: 2024',
            'Major(s): Bachelor of Science',
            'Graduation Date: 2024 (Honors)', // Added '(Honors)' to temp data to stop key warning
          ],
        } : null
        setUserData(userDataModifiedWithPlaceholders);
        setIsLocalProfile(userData.id == userId);
      } catch (err) {
        // TODO: proper error handling (eg. auth errors/forbidden pages etc.)
        navigate("/404")
      }
    };
    if (id) fetchUserData();
  }, [id]);

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          //onClick={handleBannerChange}
          //style={{ backgroundImage: `url(${userData.banner})` }}
          style={{ backgroundImage: `url(${PLACEHOLDER_BANNER})` }}
        />
        <Box className={styles.name} pl={160} pt={110}>
          <EditableField
            value={userData?.firstName || ''}
            placeholder="First name"
            fieldName="firstName"
            userId={id as string}
            userRole="member"
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
            onEditingChange={setIsFirstNameEditing}
          />
          <EditableField
            value={userData?.lastName || ''}
            placeholder="Last name"
            fieldName="lastName"
            userId={id as string}
            userRole="member"
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
            onEditingChange={setIsLastNameEditing}
          />
        </Box>
        <Box className={`${styles.subgroupContainer} ${isAnyNameEditing ? styles.shifted : ''}`}>
          <EditableField
            value={userData?.subGroup || ''}
            placeholder="FSAE sub-team"
            fieldName="subGroup"
            userId={id as string}
            userRole="member"
            onUpdate={(_, value) => {
              if (userData) {
                setUserData({ ...userData, subGroup: value });
              }
            }}
            editable={isLocalProfile}
          />
        </Box>

        <Avatar
          //src={userData?.avatar}
          src={PLACEHOLDER_AVATAR}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          //onClick={handleAvatarChange}
        />
        {/* TODO: sort out what is going on here as member.jobType doesn't exist in the model currently:*/}
        <Text size="xl" mt={-40} ml={170} pt={10} className={styles.text}>
          Looking for: {"Internship"}
        </Text>
      </Card>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        {/* Conditionally render the edit button based on whether this is the logged in user's profile */}
        {isLocalProfile ? 
        <Button size="md" onClick={handleProfileChange}>
          Edit Profile
        </Button>
        : null}
      </Flex>

      <Grid>
        <Grid.Col span={{ md: 3, xs: 12 }}>
          <Box ml={20} mt={20}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <>
                  <EditableField
                    value={userData.email}
                    label="Email"
                    placeholder="Click to add email"
                    fieldName="email"
                    userId={id as string}
                    userRole="member"
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
                    value={userData.phoneNumber}
                    label="Phone Number"
                    placeholder="Click to add phone number"
                    fieldName="phoneNumber"
                    userId={id as string}
                    userRole="member"
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

          <Box ml={20} mt={30}>
            <Title order={5}>Skills</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData?.skills && (
                <>
                  {showMoreSkills
                    ? userData.skills.map((skill) => (
                        <Text size="md" key={skill}>
                          {skill}
                        </Text>
                      ))
                    : userData.skills.slice(0, 4).map((skill) => (
                        <Text size="md" key={skill}>
                          {skill}
                        </Text>
                      ))}
                  {userData.skills?.length > 5 && (
                    <Button
                      variant="subtle"
                      size="sm"
                      pl={0}
                      pr={0}
                      pt={0}
                      pb={0}
                      onClick={() => setShowMoreSkills(!showMoreSkills)}
                    >
                      {showMoreSkills ? 'Show less' : 'View more'}
                    </Button>
                  )}
                </>
              )}
              {!userData?.skills && <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={20}>
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData ? (
                <EditableField
                  value={userData.desc}
                  label="About Me"
                  placeholder="Click to add a description about yourself..."
                  fieldName="desc"
                  userId={id as string}
                  userRole="member"
                  type="textarea"
                  onUpdate={(_, value) => {
                    setUserData({ ...userData, desc: value });
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
            style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <Box>
              <Title order={5}>Education</Title>

              <Box pl={15} mt={10} className={styles.box}>
                {userData?.education && (
                  <>
                    {showMoreEducation
                      ? userData.education.map((education) => (
                          <Text size="md" key={education}>
                            {education}
                          </Text>
                        ))
                      : userData.education.slice(0, 4).map((education) => (
                          <Text size="md" key={education}>
                            {education}
                          </Text>
                        ))}
                    {userData.education?.length > 4 && (
                      <Button
                        variant="subtle"
                        size="sm"
                        pl={0}
                        pr={0}
                        pt={0}
                        pb={0}
                        onClick={() => setShowMoreEducation(!showMoreEducation)}
                      >
                        {showMoreEducation ? 'Show less' : 'View more'}
                      </Button>
                    )}
                  </>
                )}
                {!userData?.education && <Loader color="blue" />}
              </Box>
            </Box>

            {userData?.hasCV && (
              <ActionIcon variant="transparent" color="#ffffff" size={200} mt={-40}
              onClick={handleOpenCV}
              style={{ cursor: 'pointer' }}>
                <img 
                  src="/cv_white.png" 
                  alt="CV Icon" 
                  width={90} 
                  height={90}
                />
              </ActionIcon>
            )}
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
