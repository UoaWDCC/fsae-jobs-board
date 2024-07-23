import { Carousel } from '@mantine/carousel';
import { JobCard, JobCardProps } from './JobCard';

export interface JobCarouselProps {
  jobs: JobCardProps[];
}

export function JobCarousel(data: JobCarouselProps) {
  // Map over the job data and create a JobCard for each job
  const jobCards = data.jobs.map((job) => <JobCard data={job} />);

  const slides = jobCards.map((jobCard) => <Carousel.Slide>{jobCard}</Carousel.Slide>);

  return (
    <Carousel
      withIndicators
      orientation="horizontal"
      height={200}
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }}
      loop
      align="start"
    >
      {/* Render each JobCard as a slide */}
      {slides}
    </Carousel>
  );
}
