import { Pagination, Container, Flex, Loader, Text } from '@mantine/core';
import styles from './JobBoard.module.css';
import JobListingItem from './JobListingItem';
import { FC, useEffect, useState } from 'react';
import { chunk } from 'lodash';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
}

interface JobAd {
  id: string;
  title: string;
  description: string;
  applicationLink: string;
  applicationDeadline: string;
  datePosted: string;
  specialisation: string;
  salary: string;
  publisherID: string;
}

const JobListing: FC<JobListingProps> = ({ filterRoles, filterFields }) => {
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [jobListings, setJobListings] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setItemsPerPage(6);
    } else {
      setItemsPerPage(4);
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/job');
        const data = await res.json();
        setJobListings(data);
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const chunkedJobListings = chunk(jobListings, itemsPerPage);
  const currentPageItems = chunkedJobListings[activePage - 1] || [];

  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md">
      <Container className={styles.listingInnerContainer} fluid>
        {loading && <Loader />}
        {error && <Text color="red">{error}</Text>}
        {!loading && !error && currentPageItems.length === 0 && (
          <Text>No jobs available.</Text>
        )}
        {!loading && !error && currentPageItems.map((job) => (
          <JobListingItem
            key={job.id}
            id={job.id}
            title={job.title}
            description={job.description}
            location={job.specialisation}
            company={""}
            logo={""} 
          />
        ))}
      </Container>

      {!loading && jobListings.length > 0 && (
        <Container className={styles.paginationContainer}>
          <Pagination
            total={chunkedJobListings.length}
            value={activePage}
            onChange={setPage}
            size="lg"
            mb="md"
          />
        </Container>
      )}
    </Flex>
  );
};

export default JobListing;
