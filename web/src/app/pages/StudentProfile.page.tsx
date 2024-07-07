import {
  Card,
  Avatar,
  Text,
  UnstyledButton,
  Box,
  Title,
  Button,
  Grid,
  GridCol,
} from '@mantine/core';
import classes from '../styles/StudentProfile.module.css';

export function StudentProfile() {
  return (
    <div style={{ backgroundColor: 'var(--mantine-color-background-1)', height: '100vh' }}>
      <Card h={270} className={classes.card}>
        <Card.Section
          h={200}
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
          }}
          className={classes.banner}
        />
        <Text className={classes.name}>John Doe</Text>
        <Text className={classes.member}>2024 Composite Members</Text>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          size={150}
          mt={-80}
          ml={30}
          className={classes.avatar}
        />
        <Text mt={-50} ml={200} className={classes.text}>
          Looking for: Internship
        </Text>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        <Button>Edit Profile</Button>
      </div>

      <Grid>
        <Grid.Col span={3}>
          <Box ml={20} mt={20}>
            <Title order={6}>Contact</Title>
            <Box pl={15} mt={10} className={classes.box}>
              <Text>john.doe@fsae.co.nz</Text>
              <Text>+12345678890</Text>
            </Box>
          </Box>

          <Box ml={20} mt={30}>
            <Title order={6}>Skills</Title>
            <Box pl={15} mt={10} className={classes.box}>
              <Text>HTML/CSS</Text>
              <UnstyledButton>View more</UnstyledButton>
            </Box>
          </Box>
        </Grid.Col>

        <Grid.Col span={9}>
          <Box ml={20} mt={20}>
            <Title order={6}>About Me</Title>
            <Box pl={15} mt={10} className={classes.box}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tellus sed
                purus facilisis, imperdiet tempus metus fermentum. Proin semper augue ac dolor
                facilisis rutrum molestie a enim. Praesent cursus nisl quis tincidunt sodales. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                himenaeos. Etiam aliquet pulvinar nibh, id interdum nunc pulvinar finibus. Donec
                risus eros, euismod posuere malesuada eget, sodales eget metus. Sed faucibus a erat
                vitae feugiat. Quisque vestibulum dolor eu ligula venenatis, sed placerat nisi
                interdum. Sed ullamcorper bibendum accumsan. In hac habitasse platea dictumst.
                Mauris sit amet arcu ligula. Aenean ullamcorper euismod tempor. Fusce non varius
                sapien. Quisque venenatis a nulla a sagittis. Phasellus cursus libero ut elit
                fringilla, vel feugiat quam viverra. Etiam a risus vitae ante feugiat scelerisque.
              </Text>
              <UnstyledButton>View more</UnstyledButton>
            </Box>
          </Box>
          <Box ml={20} mt={30}>
            <Title order={6}>Education</Title>
            <Box pl={15} mt={10} className={classes.box}>
              <Text>Major(s): Part II Bachelor of Software Engineer</Text>
              <Text>Expected Graduation Date: 2026</Text>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </div>
  );
}
