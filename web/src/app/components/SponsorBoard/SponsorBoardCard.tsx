import { Text, Button, Paper, Flex, Stack, Container, AspectRatio, rem } from '@mantine/core';
import classes from './SponsorBoard.module.css';
import { Image } from '@mantine/core';

// dummy data -- change later when we have real data
export interface SponsorBoardCardProps {
  companyTitle: string;
  subtitle: string;
  imageLink: string;
  sponsorTitle: string;
  sponsorLink: string;
}

export function SponsorBoardCard({ data }: { data: SponsorBoardCardProps }) {
  console.log(
    'Change this JobCard component to use real userType from Redux store once user integration is implemented'
  );

  const handleSponsorLink = () => {
    console.log('Sponsor Link: ', data.sponsorLink);
  };

  return (
    <Paper p="md" radius="md" w={'95%'} h={'100%'}>
      <Flex direction="column" w={'100%'} h={'100%'}>
        {/* Sponsor Title */}
        <Stack gap="xs" w="100%" h="100%">
          <Container
            w={{ base: '100%', sm: '80%', md: '80%', lg: '100%', xl: '100%' }}
            h="auto"
            style={{ overflow: 'hidden' }}
          >
            <AspectRatio ratio={1}>
              <Image
                src={data.imageLink}
                alt="sponsor image"
                fallbackSrc="/sponsor_placeholder.png"
                radius="md"
                width="100%"
                height="100%"
                fit="cover"
              />
            </AspectRatio>
          </Container>
          <Flex justify={'space-between'}>
            {/* Sponsor Title */}
            <Text fw={500} size={rem(24)} className={classes.text}>
              {data.companyTitle}
            </Text>
          </Flex>

          {/* Sponsor Subtite */}
          <Text fw={500} size={rem(16)} className={classes.text} fs="italic">
            {data.subtitle}
          </Text>

          {/* Button */}
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={handleSponsorLink}
            w="100%"
          >
            {data.sponsorTitle}
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
}

export default SponsorBoardCard;
