import { Text, Button, Paper, Flex, Container, AspectRatio } from '@mantine/core';
import styles from './SponsorBoard.module.css';
import { Image } from '@mantine/core';

// dummy data -- change later when we have real data
export interface SponsorBoardCardProps {
  sponsorTitle: string;
  imageLink: string;
  sponsorIndsutry: string;
  sponsorLink: string;
}

export function SponsorBoardCard({
  data,
  isOneColumn,
}: {
  data: SponsorBoardCardProps;
  isOneColumn?: boolean;
}) {
  const handleSponsorLink = () => {
    console.log('Sponsor Link: ', data.sponsorLink);
  };

  return (
    <Paper p="md" radius="md" w={'95%'} h={'100%'}>
      <Flex
        direction={isOneColumn ? 'row' : 'column'}
        w={'100%'}
        h={'100%'}
        justify={'space-between'}
      >
        {/* Sponsor Title */}
        <Container
          w={{ base: '100%', sm: '80%', md: '80%', lg: '100%', xl: '100%' }}
          h="auto"
          style={{ overflow: 'hidden', flex: isOneColumn ? 1 : 'auto' }}
          pl={isOneColumn ? '0' : 'auto'}
        >
          <AspectRatio ratio={4 / 3}>
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
        {/* Right Container (on one column layout) */}
        <Flex
          direction={'column'}
          justify={isOneColumn ? 'space-evenly' : 'space-between'}
          style={{ flex: isOneColumn ? 2 : 'auto' }}
        >
          <Flex justify={'space-between'}>
            {/* Sponsor Title */}
            <Text fw={500} size="xl" className={styles.text} ml={isOneColumn ? 'auto': 'xs'}>
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
        </Flex>
      </Flex>
    </Paper>
  );
}

export default SponsorBoardCard;
