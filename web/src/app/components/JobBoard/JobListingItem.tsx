import { FC } from 'react';
import classes from './JobBoard.module.css';

interface JobListingItemProps {
  title: string;
  company: string;
  location: string;
  description: string;
}
const JobListingItem: FC<JobListingItemProps> = ({ title, company, location, description }) => {
  return (
    <div className={classes.listItemContainer}>
      <p className={classes.listItemTitle}>{title}</p>
      <div className={classes.listItemCompanyContainer}>
        <p className={classes.listItemCompanyName}>{company}</p>
      </div>
      <p className={classes.listItemLocation}>{location}</p>
      <p className={classes.listItemDescription}>{description}</p>
    </div>
  );
};

export default JobListingItem;
