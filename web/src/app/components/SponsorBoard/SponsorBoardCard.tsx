import { Text, Avatar } from '@mantine/core';
import styles from './SponsorBoard.module.css';

// dummy data -- change later when we have real data
export interface SponsorBoardCardProps {
  id: string;
  companyName: string;
  avatarURL: string;
  industry: string;
  websiteURL: string;
}

export function SponsorBoardCard({
  data,
}: {
  data: SponsorBoardCardProps;
}) {
  return (
    <div className={styles.singleSponsor}>
      <Avatar src={data.avatarURL} alt={data.companyName} className={styles.avatar} />
      <div className={styles.sponsorTextContainer}>
        <Text className={styles.sponsorName}>{data.companyName}</Text>
        <Text className={styles.sponsorIndustry}>
          {data.industry}
        </Text>
      </div>
    </div>
  );
}

export default SponsorBoardCard;
