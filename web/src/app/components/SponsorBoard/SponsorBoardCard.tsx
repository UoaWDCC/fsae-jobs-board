import { Text, Button, Paper, Flex, Stack, Container, AspectRatio, rem } from '@mantine/core';
import classes from './SponsorBoard.module.css';
import { Image } from '@mantine/core';

// dummy data -- change later when we have real data
export interface SponsorBoardCardProps {
  sponsorTitle: string;
  imageLink: string;
  sponsorIndsutry: string;
  sponsorLink: string;
}

export function SponsorBoardCard({ data }: { data: SponsorBoardCardProps }) {
  const handleSponsorLink = () => {
    console.log('Sponsor Link: ', data.sponsorLink);
  };

  return (
    <Paper p="md" radius="md" w={'95%'} h={'100%'}>
      <Flex direction="column" w={'100%'} h={'100%'}>
        {/* Sponsor Title */}
        <Stack gap="xs" w="100%" h="100%" justify="space-between">
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
                fit="contain"
              />
            </AspectRatio>
          </Container>
          <Flex justify={'space-between'}>
            {/* Sponsor Title */}
            <Text fw={500} size={rem(24)} className={classes.text}>
              {data.sponsorTitle}
            </Text>
          </Flex>

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
            {data.sponsorIndsutry}
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
}

export default SponsorBoardCard;
