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
import classes from '../styles/SponsorProfile.module.css';
import { useEffect, useState } from 'react';

import { IconCertificate } from '@tabler/icons-react';
import { JobCarousel, JobCarouselProps } from '../components/JobCardCarousel/JobCarousel';
import { JobCardProps } from '../components/JobCardCarousel/JobCard';

export function SponsorProfile() {
  // UseState for future modal implementation
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);

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

  // Dummy data for company userData
  const [userData, setUserData] = useState({
    companyName: 'Company Name',
    companyField: 'Field of Specialization',
    subgroup: 'Subgroup',
    dateJoined: '2024',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    description:
      ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tristique lacus, eget euismod enim. Fusce suscipit at tortor sed pretium. Integer et pretium orci. Integer velit purus, gravida quis tincidunt ac, pretium sed lorem. Sed sagittis neque tincidunt, auctor ante vitae, ultricies risus. Aenean quis sem sed dolor feugiat tincidunt. Etiam purus justo, ullamcorper in cursus volutpat, luctus in dolor. Donec sed purus tristique, rhoncus erat ut, ullamcorper dolor. Pellentesque tincidunt eros id neque egestas, sed luctus sapien elementum. Etiam bibendum ex est, ac consequat turpis facilisis id. Mauris scelerisque purus quis leo fermentum, at semper nisl mattis. Vivamus vel ornare lectus. Nullam dictum felis et commodo lacinia. Etiam tempor placerat sapien quis maximus. Ut pellentesque libero ac sollicitudin accumsan. Sed vel dolor bibendum, egestas metus nec, eleifend mauris. Integer imperdiet eros vitae nibh interdum volutpat. Etiam et ultrices massa. Cras gravida facilisis sapien. Ut eleifend varius risus, eget bibendum dui blandit ac. Vivamus tempor varius massa, sed suscipit mauris interdum eu. Proin sed commodo ex, ac cursus nisl. Integer ut tincidunt augue. Cras molestie libero erat. Nunc justo felis, sodales auctor dapibus sit amet, dapibus ut turpis. Sed nec sagittis nisl. Cras eget condimentum est. Cras nulla lorem, venenatis euismod gravida quis, fermentum vel mauris. Fusce et ipsum et lorem egestas volutpat. Duis nec imperdiet ante. Quisque et ligula accumsan, eleifend urna sit amet, cursus dolor. Nullam ut erat diam. Ut non lacinia erat, eu pretium nisl. Vestibulum mattis sapien in tristique commodo. Integer faucibus leo at turpis rhoncus, eu hendrerit ex dignissim. Nulla facilisi. Donec eget turpis ac odio pretium iaculis. Sed imperdiet sollicitudin viverra. In consequat justo velit, aliquet ultricies leo efficitur laoreet. Nullam quis elementum diam. Sed in sodales est. Integer malesuada semper tortor eu feugiat. Morbi tincidunt turpis bibendum consequat cursus. Aenean faucibus felis sit amet porta interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dui magna, lobortis quis quam non, dictum bibendum libero. ',
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

  return (
    <Box className={classes.container}>
      {/* PICTURE AND COMPANY DETAILS */}
      <Card h={280} className={classes.card}>
        <Card.Section h={250} className={classes.banner} onClick={handleBannerChange} />
        {userData?.companyName && (
          <Text className={classes.name} pl={170} pt={130}>
            {userData.companyName}
          </Text>
        )}
        {userData?.subgroup && (
          <Text className={classes.subgroup} pl={170} pt={185}>
            {userData.subgroup}
          </Text>
        )}

        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          size={150}
          mt={-100}
          ml={10}
          className={classes.avatar}
          onClick={handleAvatarChange}
        />
        <Text mt={-40} ml={170} className={classes.text}>
          {userData.companyField}
        </Text>
      </Card>

      <Grid>
        <Grid.Col span={{ md: 3, xs: 12 }}>
          {/* CONTACT */}
          <Box ml={20} mt={20}>
            <Title order={6}>Contact</Title>
            <Box pl={15} mt={10} className={classes.box}>
              {userData?.email && <Text>{userData.email}</Text>}
              {userData?.phone && <Text>{userData.phone}</Text>}
              {!userData && <Loader color="blue" />}
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ md: 9, xs: 12 }}>
          <Box mx={20} mt={20}>
            {/* ABOUT ME SECTION */}
            <Title order={6}>About Me</Title>
            <Box pl={15} mt={10} className={classes.box}>
              {/* Conditionally render the full description based on showMore state */}
              {userData?.description && (
                <>
                  {showMoreDescription ? (
                    <Text>{userData.description}</Text>
                  ) : (
                    <>
                      <Text>{userData.description.substring(0, 1200)}</Text>
                    </>
                  )}
                  {userData.description?.length > 1200 ? (
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
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {/* JOB OPPORTUNITIES CAROUSEL */}
            <Box>
              <Title order={6}>Job Opportunities</Title>
              <Flex mt={10} justify={'center'} align={'center'}>
                {/* Add JobCarousel component here */}
                <JobCarousel jobs={jobData} />
              </Flex>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
