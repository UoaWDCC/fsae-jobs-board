import {
  Card,
  Avatar,
  Text,
  UnstyledButton,
  Box,
  Title,
  Button,
  Grid,
  Modal,
  Image,
  ActionIcon,
  Flex,
  Center,
} from '@mantine/core';
import classes from '../styles/StudentProfile.module.css';
import { useState } from 'react';
import { IconXboxX } from '@tabler/icons-react';
import { IconPencil, IconCamera, IconTrash } from '@tabler/icons-react';

export function StudentProfile() {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('')

  const handleAvatarChange = () => {
    setModalType('avatar')
    setOpenModal(true);
  };

  const handleBannerChange = () => {
    setModalType('banner')
    setOpenModal(true)
  }

  return (
    <div style={{ backgroundColor: 'var(--mantine-color-background-1)', height: '100vh' }}>
      <Card h={270} className={classes.card}>
        <Card.Section
          h={200}
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
            cursor: 'pointer'
          }}
          className={classes.banner}
          onClick={handleBannerChange}
        />
        <Text className={classes.name}>John Doe</Text>
        <Text className={classes.member}>2024 Composite Members</Text>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          size={150}
          mt={-80}
          ml={30}
          className={classes.avatar}
          onClick={handleAvatarChange}
          style={{ cursor: 'pointer' }}
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
          <Box mx={20} mt={20}>
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

{/* Modal - Profile photo or banner */}
<Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title={modalType === 'avatar' ? 'Profile Photo' : 'Banner Photo'}
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
        centered
        className={classes.modal}
        radius={20}
      >
        {modalType === 'avatar' ? (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              borderBottom: '3px solid var(--mantine-color-customGrey-1)',
            }}
            p={10}
          >
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
              size={150}
            />
          </Box>
        ) : (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              borderBottom: '3px solid var(--mantine-color-customGrey-1)',
              '.mantine-Modal-body': {
                width: '100%'
              }
            }}
          >
            <Image src= 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'/>
          </Box>
        )}
        <Box display="flex" style={{ justifyContent: 'space-between' }}>
          <Box display="flex" style={{ justifyContent: 'flex-start', gap: '20px' }}>
            <Box mt={10} display='flex' style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
              <IconPencil />
              <Text>Edit</Text>
            </Box>
            <Box mt={10} display='flex' style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
              <IconCamera />
              <Text>Add Photo</Text>
            </Box>
          </Box>
          <Box mt={10} display='flex' style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <IconTrash />
            <Text>Delete</Text>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
