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
import classes from '../styles/StudentProfile.module.css';
import { useEffect, useState } from 'react';

import { IconCertificate } from '@tabler/icons-react';

export function StudentProfile() {
  // UseState for future modal implementation
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleAvatarChange = () => {
    setModalType('avatar');
    setOpenModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner');
    setOpenModal(true);
  };

  const handleProfileChange = () => {
    setModalType('profile');
    setOpenProfileModal(true);
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
  });
  // Add code to fetch data from our database when it will be connected

  useEffect(() => {
    // Logic to fetch data and setUserData
  }, []);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreEducation, setShowMoreEducation] = useState(false);
  return (
    <Box
      style={{
        backgroundColor: 'var(--mantine-color-background-1)',
        height: '100vh',
        color: 'var(--mantine-color-customWhite-1',
        overflowY: 'auto',
      }}
    >
      <Card h={270} className={classes.card}>
        <Card.Section
          h={200}
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
            cursor: 'pointer',
          }}
          className={classes.banner}
          onClick={handleBannerChange}
        />
        {userData?.firstName && (
          <Text className={classes.name} pl={190} pt={100}>
            {userData.firstName} {userData.lastName}
          </Text>
        )}
        {userData?.subgroup && (
          <Text className={classes.subgroup} pl={190} pt={150}>
            {userData.subgroup} since {userData.dateJoined}
          </Text>
        )}

        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          size={150}
          mt={-80}
          ml={20}
          className={classes.avatar}
          onClick={handleAvatarChange}
          style={{ cursor: 'pointer' }}
        />
        <Text mt={-50} ml={190} className={classes.text}>
          Looking for: {userData.jobType}
        </Text>
      </Card>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        <Button onClick={handleProfileChange}>Edit Profile</Button>
      </Flex>

      <Grid>
        <Grid.Col span={{ md: 3, xs: 12 }}>
          <Box ml={20} mt={20}>
            <Title order={6}>Contact</Title>
            <Box pl={15} mt={10} className={classes.box}>
              {userData?.email && <Text>{userData.email}</Text>}
              {userData?.phone && <Text>{userData.phone}</Text>}
              {!userData && <Loader color="blue" />}
            </Box>
          </Box>

          <Box ml={20} mt={30}>
            <Title order={6}>Skills</Title>
            <Box pl={15} mt={10} className={classes.box}>
              {userData?.skills && (
                <>
                  {showMoreSkills
                    ? userData.skills.map((skill) => <Text key={skill}>{skill}</Text>)
                    : userData.skills.slice(0, 4).map((skill) => <Text key={skill}>{skill}</Text>)}
                  {userData.skills?.length > 5 && (
                    <Button
                      variant="subtle"
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
            <Title order={6}>About Me</Title>
            <Box pl={15} mt={10} className={classes.box}>
              {/* Conditionally render the full description based on showMore state */}
              {userData?.description && (
                <>
                  {showMoreDescription ? (
                    <Text>{userData.description}</Text>
                  ) : (
                    <>
                      <Text>{userData.description.substring(0, 1500)}</Text>
                    </>
                  )}
                  {userData.description?.length > 1500 ? (
                    <Button
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
              <Title order={6}>Education</Title>

              <Box pl={15} mt={10} className={classes.box}>
                {userData?.education && (
                  <>
                    {showMoreEducation
                      ? userData.education.map((education) => (
                          <Text key={education}>{education}</Text>
                        ))
                      : userData.education
                          .slice(0, 4)
                          .map((education) => <Text key={education}>{education}</Text>)}
                    {userData.education?.length > 4 && (
                      <Button
                        variant="subtle"
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

            <ActionIcon variant="transparent" color="#ffffff" size={200} mt={-40}>
              <IconCertificate width={90} height={90} stroke={1.5} />
            </ActionIcon>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
