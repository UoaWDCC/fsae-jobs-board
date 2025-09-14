// jobListing.ts
import { Pagination, Container, Flex, Loader, Text } from '@mantine/core';
import styles from './JobBoard.module.css';
import JobListingItem from './JobListingItem';
import { FC, useEffect, useState } from 'react';
import { fetchJobs } from '@/api/job';
import { Job } from '@/models/job.model';
import { usePagination } from '@/hooks/usePagination';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
  search: string;
}

const JobListing: FC<JobListingProps> = ({ filterRoles, filterFields, search }) => {
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchJobs(search); 
        setJobListings(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  // Filter job listings based on role type
  const filteredJobListings = jobListings.filter(job =>
    job.roleType &&
    (filterRoles.length === 0 ||
      filterRoles.includes(job.roleType.toLowerCase()))
    || (!job.roleType && filterRoles.length === 0)
  );

  const {
    activePage,
    setActivePage,
    paginatedData,
    chunkedData,
    totalPages
  } = usePagination(filteredJobListings, 6); // Default to 6 items per page

  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md">
      <Container className={styles.listingInnerContainer} fluid>
        {loading && <Loader />}
        {error && <Text color="red">{error}</Text>}
        {!loading && !error && paginatedData.length === 0 && (
          <Text>No jobs available.</Text>
        )}
        {!loading && !error && paginatedData.map((job) => (
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

      {!loading && filteredJobListings.length > 0 && (
        <Container className={styles.paginationContainer}>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            size="lg"
            mb="md"
          />
        </Container>
      )}
    </Flex>
  );
};

export default JobListing;