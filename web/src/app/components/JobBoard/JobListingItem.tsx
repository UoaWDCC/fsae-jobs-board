import { FC } from 'react';
import styles from './JobBoard.module.css';
import { Flex, Text, Image } from '@mantine/core';

interface JobListingItemProps {
  title: string;
  company: string;
  logo: string;
  location: string;
  description: string;
}
const JobListingItem: FC<JobListingItemProps> = ({
  title,
  company,
  location,
  description,
  logo,
}) => {
  return (
    <Flex
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      className={styles.jobCard}
    >
      <Text className={styles.listItemTitle}>{title}</Text>
      <Image src={logo} alt={company} h={60} w={60}></Image>
      <Text className={styles.listItemLocation}>{location}</Text>
      <Text className={styles.listItemDescription} lineClamp={3}>
        {description}
      </Text>
    </Flex>
  );
};

export default JobListingItem;
