import { Card, Avatar, Text, Box, Title, Button, Grid, Flex, Loader } from '@mantine/core';
import styles from '../../styles/SponsorProfile.module.css';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { JobCarousel } from '../../components/JobCardCarousel/JobCarousel';
import { JobCardProps } from '../../components/JobCardCarousel/JobCard';
import { UserType } from '../../features/user/userSlice';
import { EditAvatar } from '@/app/components/Modal/EditAvatar';
import { EditBannerModal } from '@/app/components/Modal/EditBannerModal';
import { EditSponsorProfile } from '@/app/components/Modal/EditSponsorProfile';
import EditModal from '@/app/components/Modal/EditModal';

export function SponsorProfile() {
  // UseState for future modal implementation
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const [showMoreDescription, setShowMoreDescription] = useState(false);
  // const userType = useSelector((state: RootState) => state.user.userType);
  const [userType, setUserType] = useState<UserType>('sponsor');

  console.log(
    'Change this SponsorPage component to use real userType from Redux store once user integration is implemented'
  );

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
    setModalContent(<EditSponsorProfile />);
    setModalTitle('Edit Profile');
    setOpenProfileModal(true);
  };

  const handleJobOpportunitiesChange = () => {
    setModalType('jobOpportunities');
    setOpenModal(true);
  };

  const handleDeactivateUserChange = () => {
    setModalType('deactivateUser');
    setOpenModal(true);
  };

  // Dummy data for company userData
  const [userData, setUserData] = useState({
    sponsorName: 'Sponsor Name',
    sponsorField: 'Field of Specialization',
    subgroup: 'Subgroup',
    dateJoined: '2024',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    description:
      ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    banner: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png',
  });
  // Add code to fetch data from our database when it will be connected

  const [jobData, setJobData] = useState<JobCardProps[]>([
    {
      title: 'Job Title',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
      subtitle: 'Subtitle',
      jobLink: 'test',
      jobID: '1234567',
    },
    {
      title: 'Job Title',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
      subtitle: 'Subtitle',
      jobLink: 'test',
      jobID: '1234567',
    },
    {
      title: 'Job Title',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
      subtitle: 'Subtitle',
      jobLink: 'test',
      jobID: '1234567',
    },
    {
      title: 'Job Title',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
      subtitle: 'Subtitle',
      jobLink: 'test',
      jobID: '1234567',
    },
  ]);
  // dummy data for job opportunities

  useEffect(() => {
    // Logic to fetch data and setUserData
  }, []);

  // methods to get elements based on user type
  const getElementBasedOnUserType = (element: string) => {
    switch (userType) {
      case 'sponsor':
        return getSponsorElements(element);
      case 'student':
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
      <Card h={280} className={styles.card}>
        <Card.Section
          h={250}
          className={styles.banner}
          onClick={handleBannerChange}
          style={{ backgroundImage: `url(${userData.banner})` }}
        />
        {userData?.sponsorName && (
          <Text className={styles.name} pl={170} pt={140}>
            {userData.sponsorName}
          </Text>
        )}

        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          size={150}
          mt={-100}
          ml={10}
          className={styles.avatar}
          onClick={handleAvatarChange}
        />
        <Text size="lg" mt={-30} ml={170} className={styles.text}>
          {userData.sponsorField}
        </Text>
      </Card>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        {getElementBasedOnUserType('profileBtn')}
      </Flex>

      <Grid>
        <Grid.Col span={{ md: 2.5, xs: 12 }}>
          {/* CONTACT */}
          <Box ml={20} mt={15}>
            <Title order={5}>Contact</Title>
            <Box pl={15} mt={10} className={styles.box}>
              {userData?.email && <Text size="md">{userData.email}</Text>}
              {userData?.phone && <Text size="lg">{userData.phone}</Text>}
              {!userData && <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={10}>
            {/* ABOUT ME SECTION */}
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
                      variant="subtle"
                      size="sm"
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
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {/* JOB OPPORTUNITIES CAROUSEL */}
            <Box miw="100%">
              <Flex
                style={{ display: 'flex', justifyContent: 'space-between', marginRight: '20px' }}
              >
                <Title order={5}>Job Opportunities</Title>
                {getElementBasedOnUserType('addNewBtn')}
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
    </Box>
  );
}
