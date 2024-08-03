import { FC } from 'react';
import classes from './JobBoard.module.css';
import { Text } from '@mantine/core';

interface JobListingItemProps {
  title: string;
  company: string;
  location: string;
  description: string;
}
const JobListingItem: FC<JobListingItemProps> = ({ title, company, location, description }) => {
  return (
    <div className={classes.listItemContainer}>
      <Text className={classes.listItemTitle}>{title}</Text>
      <div className={classes.listItemCompanyContainer}>
        <Text className={classes.listItemCompanyName}>{company}</Text>
      </div>
      <Text className={classes.listItemLocation}>{location}</Text>
      <Text className={classes.listItemDescription} lineClamp={3}>
        {description}
      </Text>
    </div>
  );
};

export default JobListingItem;
