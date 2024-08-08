import { ActionIcon, Text, Button, Paper, Flex, Stack } from '@mantine/core';
import classes from './SponsorBoardCard.module.css';
import { useState } from 'react';
import { UserType } from '@/app/features/user/userSlice';
import { IconTrash } from '@tabler/icons-react';
import { Image } from '@mantine/core';

// dummy data -- change later when we have real data
export interface SponsorBoardCardProps {
  title: string;
  subtitle: string;
  imageLink: string;
  roleTitle: string;
  roleLink: string;
}

export function SponsorBoardCard({ data }: { data: SponsorBoardCardProps }) {
  // const userType = useSelector((state: RootState) => state.user.userType);
  const [userType, setUserType] = useState<UserType>('sponsor');

  console.log(
    'Change this JobCard component to use real userType from Redux store once user integration is implemented'
  );

  const handleRoleLink = () => {
    console.log('Edit job with ID: ', data.roleLink);
  };

  return (
    <Paper p="md" radius="md">
      <Flex direction="column">
        {/* Job Title */}
        <Stack gap="xs">
          <Image src={data.imageLink} alt="Company Logo" width={200} height={200} />

          <Flex justify={'space-between'}>
            <Text fw={500} size="xl" className={classes.text}>
              {data.title}
            </Text>
          </Flex>

          {/* Job Subtite */}
          <Text fw={500} size="md" className={classes.text}>
            {data.subtitle}
          </Text>

          {/* Button */}
          <Button
            color="blue"
            mt="xs"
            mr="md"
            radius="lg"
            size="compact-md"
            onClick={handleRoleLink}
          >
            {data.roleTitle}
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
}

export default SponsorBoardCard;
