import { Carousel } from '@mantine/carousel';
import { JobCard, JobCardProps } from './JobCard';
import styles from './JobCarousel.module.css';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { rem } from '@mantine/core';

export interface JobCarouselProps {
  jobs: JobCardProps[];
  onJobDeleted?: () => void;
  onEditJob?: (jobData: JobCardProps) => void;
}

export function JobCarousel(data: JobCarouselProps) {
  // Map over the job data and create a JobCard for each job
  const jobCards = data.jobs.map((job, idx) => (
    <JobCard 
      key={job.id + idx} 
      data={job} 
      onJobDeleted={data.onJobDeleted}
      onEditJob={data.onEditJob}
    />
  ));

  const slides = jobCards.map((jobCard, idx) => (
    <Carousel.Slide key={jobCard.key ?? jobCard.props.data.id + idx}>{jobCard}</Carousel.Slide>
  ));

  return (
    <Carousel
      orientation="horizontal"
      withIndicators
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 'xs', sm: 'md' }}
      controlsOffset="xs"
      nextControlIcon={<IconChevronRight style={{ width: rem(16), height: rem(16) }} />}
      previousControlIcon={<IconChevronLeft style={{ width: rem(16), height: rem(16) }} />}
      align="start"
      w="95%"
      classNames={styles}
    >
      {/* Render each JobCard as a slide */}
      {slides}
    </Carousel>
  );
}
