import { Flex, Title } from '@mantine/core';
import SponsorBoardCard from '../components/SponsorBoard/SponsorBoardCard';
import { SponsorBoardCardProps }  from '../components/SponsorBoard/SponsorBoardCard';

export function SponsorsBoard() {
  
  const testSponsorBoardCardProps: SponsorBoardCardProps = {
    title: 'Company Name',
    subtitle: 'industry',
    imageLink: 'https://picsum.photos/200/300',
    roleTitle: 'Sponsor Role Title',
    roleLink: 'http://localhost:5173/',
  };

  return (
    <>
      <Flex justify="center" gap="md" mt="md" mr="md" direction="column">
        <Title order={1}>Sponsors Board</Title>
        <SponsorBoardCard data={testSponsorBoardCardProps} />
      </Flex>
    </>
  );
}
