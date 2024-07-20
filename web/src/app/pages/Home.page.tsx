import { BackgroundImage, Box, Title, Flex } from '@mantine/core';
import classes from '../styles/HomePage.module.css';
import { Guide } from '../components/Guides/Guide';

export function HomePage() {
  return (
    <>
      <Box mx="auto" className={classes.HomePage}>
        <BackgroundImage src="home_background.jpg" className={classes.BackgroundImage}>
          <Flex justify="center" align="flex-end" style={{ height: '100vh' }}>
            <Title size="2rem" textWrap="wrap" style={{ color: 'white', fontStyle: 'italic' }}>
              Welcome to the University of Auckland F:SAE:47 Job Board
            </Title>
          </Flex>
        </BackgroundImage>
      </Box>
      <Guide
        title="Students"
        subtitle1="Sign-up"
        description1="Sign up using your uni email"
        subtitle2="Get Started"
        description2="Create your Profile"
        subtitle3="Find a Job"
        description3="Browse and Apply to Jobs"
        buttonText="Register as a Student"
        useRef="/signup/student"
      />
      <Guide
        title="Sponsors"
        subtitle1="Sign-up"
        description1="Sign up using your company email"
        subtitle2="Get Started"
        description2="Create a Profile and post your job ads"
        subtitle3="Find Students"
        description3="Browse our talents pool"
        buttonText="Register as a Sponsor"
        useRef="/signup/sponsor"
      />
      <Guide
        title="Alumni"
        subtitle1="Get Started"
        description1="Sign up using your company email"
        subtitle2="Get Started"
        description2="Create your Profile"
        subtitle3="Find Students"
        description3="Browse our talents pool"
        buttonText="Register as an Alumni"
        useRef="/signup/alumni"
      />
    </>
  );
}
