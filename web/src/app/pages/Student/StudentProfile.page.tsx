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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import EditModal from '../../components/Modal/EditModal';
import { EditStudentProfile } from '../../components/Modal/EditStudentProfile';
import { EditAvatar } from '../../components/Modal/EditAvatar';
import { EditBannerModal } from '../../components/Modal/EditBannerModal';

export function StudentProfile() {
  const user = useSelector((state: RootState) => state.user);
  console.log('[StudentProfile] Redux user:', user);
  const memberID = user.id;

  // UseState for future modal implementation
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreEducation, setShowMoreEducation] = useState(false);

  const handleAvatarChange = () => {
    setModalType('avatar');
    setModalContent(<EditAvatar avatar={userData?.avatar} />);
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
    setModalContent(<EditStudentProfile close={() => setOpenProfileModal(false)} />);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleOpenCV = async () => {
    if (!memberID) {
      alert('Member ID invalid');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/member/${memberID}/cv`, {
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

  // Dummy data for userData
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    jobType: 'Internship',
    subgroup: 'Composite',
    dateJoined: '2024',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'C#', 'Git'],
    description:
      ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
    education: [
      'Major(s): Master of Software Engineering',
      'Expected Graduation Date: 2026',
      'Major(s): Part II Bachelor of Software Engineering',
      'Graduation Date: 2024',
      'Major(s): Bachelor of Science',
      'Graduation Date: 2024',
    ],
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    banner: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png',
  });
  // Add code to fetch data from our database when it will be connected

  useEffect(() => {
  const fetchUserData = async () => {
    if (!memberID) {
      console.log('User not authenticated or no member ID');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token available yet');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/member/${memberID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const memberData = await response.json();
        setUserData(memberData);
      } else {
        console.error('Failed to fetch member data');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  // fetchUserData();
}, [memberID]);

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          style={{ backgroundImage: `url(${userData.banner})` }}
        />
        {userData?.firstName && (
          <Text className={styles.name}>
            {userData.firstName} {userData.lastName}
          </Text>
        )}
        {userData?.subgroup && (
          <Text size="xl" className={styles.subgroup}>
            {userData.subgroup} since {userData.dateJoined}
          </Text>
        )}

        <Avatar
          src={userData?.avatar}
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />
        <Text size="xl" className={styles.text}>
          Looking for: {userData.jobType}
        </Text>
      </Card>

      <Flex className={styles.profileBtn}>
        <Button size="md" onClick={handleProfileChange}>
          Edit Profile
        </Button>
      </Flex>

      <Grid>
        <Grid.Col span={{ md: 3, xs: 12 }}>
          <Box ml={20} mt={20}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData?.email && <Text size="lg">{userData.email}</Text>}
              {userData?.phone && <Text size="lg">{userData.phone}</Text>}
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
              {!userData.skills && <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={20}>
            <Title order={5}>About Me</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {/* Conditionally render the full description based on showMore state */}
              {userData?.description && (
                <>
                  {showMoreDescription ? (
                    <Text size="md">{userData.description}</Text>
                  ) : (
                    <>
                      <Text size="md">{userData.description.substring(0, 1200)}</Text>
                    </>
                  )}
                  {userData.description?.length > 1200 ? (
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
              {!userData.description && <Loader color="blue" />}
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
                {!userData.education && <Loader color="blue" />}
              </Box>
            </Box>

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
