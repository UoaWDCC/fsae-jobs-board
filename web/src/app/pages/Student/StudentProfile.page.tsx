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
import styles from '../../styles/StudentProfile.module.css';
import { useEffect, useState } from 'react';
import { IconCertificate } from '@tabler/icons-react';
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
  const { id } = useParams();
  const navigate = useNavigate();

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
  
  const userRole = useSelector((state: RootState) => state.user.role); // the id of the local user
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

  // TODO: avatar and banner doesnt exist in the member model yet

  const handleAvatarChange = () => {
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

  const handleProfileChange = () => {
    setModalType('profile');
    setModalContent(<EditStudentProfile userData={userData} setUserData={setUserData} close={() => setOpenProfileModal(false)} />);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
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
            'Graduation Date: 2024',
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
        {(userData?.firstName && userData?.lastName) && (
          <Text className={styles.name} pl={170} pt={110}>
            {userData.firstName} {userData.lastName}
          </Text>
        )}
        {userData?.subGroup && (
          <Text size="xl" className={styles.subgroup} pl={170} pt={160}>
            {userData.subGroup}
          </Text>
        )}

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
              {userData?.email && <Text size="lg">{userData.email}</Text>}
              {userData?.phoneNumber && <Text size="lg">{userData.phoneNumber}</Text>}
              {!userData && <Loader color="blue" />}
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
                      size="sm"
                      variant="subtle"
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

            <ActionIcon variant="transparent" color="#ffffff" size={200} mt={-40}>
              <IconCertificate width={90} height={90} stroke={1.5} />
            </ActionIcon>
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
