import {Title, Text, Center, Space, Button, Box, Flex} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useScrollIntoView } from '@mantine/hooks';

export function StudentGuide() {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

    return (
        <>
        <Center className='student-guide' style={{ backgroundColor: "black", height: "100vh", display: "flex", flexDirection: "column"}}>
            <Title ref={targetRef}>Students</Title>
            <Space h="xl" /><Space h="xl" /><Space h="xl" />
            <Flex gap={30}>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Sign Up</Text>
                <Text>Sign up using your university email</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Get Started</Text>
                <Text>Create your profile</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Find a Job</Text>
                <Text>Browse and apply for jobs</Text>
            </Box>
            </Flex>
            <Space h="xl" /><Space h="xl" /><Space h="xl" />
            <Button size="lg" radius={100} fw={0} onLoad={scrollIntoView()}>Register as a student <IconArrowRight></IconArrowRight></Button>
        </Center>
        </>
    );
}

export function SponsorGuide() {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();
    
    const handleClick = () => {
      console.log(targetRef);
      scrollIntoView();
    };
  
    return (
      <>
        <Center className='sponsor-guide' style={{ backgroundColor: "black", height: "100vh", display: "flex", flexDirection: "column"}}>
          <Title ref={targetRef}>Sponsors</Title>
          <Space h="xl" /><Space h="xl" /><Space h="xl" />
          <Flex gap={30}>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Sign Up</Text>
                <Text>Sign up using your company email</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Get Started</Text>
                <Text>Create a profile and advertise jobs</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Find New Talent</Text>
                <Text>Browse student profiles</Text>
            </Box>
          </Flex>
          <Space h="xl" /><Space h="xl" /><Space h="xl" />
          <Button size="lg" radius={100} fw={0} onLoad={scrollIntoView()}>Register as a sponsor <IconArrowRight></IconArrowRight></Button>
          </Center>
      </>
    );
}

export function AlumniGuide() {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();
    
    return (
      <>
        <Center className='alumni-guide' style={{ backgroundColor: "black", height: "100vh", display: "flex", flexDirection: "column"}}>
          <Title ref={targetRef}>Alumni</Title>
          <Space h="xl" /><Space h="xl" /><Space h="xl" />
          <Flex gap={30}>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Sign Up</Text>
                <Text>Sign up and wait for verification</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Get Started</Text>
                <Text>Create a profile and advertise jobs</Text>
            </Box>
            <Box style={{borderRadius: "10px", height: "100px", width: "250px", border: "4px solid white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Text size="xl" fw={700}>Find New Talent</Text>
                <Text>Browse student profiles</Text>
            </Box>
          </Flex>
          <Space h="xl" /><Space h="xl" /><Space h="xl" />
          <Button size="lg" radius={100} fw={0} onLoad={scrollIntoView()}>Register as an alumni <IconArrowRight></IconArrowRight></Button>
        </Center>
      </>
    );
}