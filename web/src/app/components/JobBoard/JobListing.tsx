import { Pagination, Container, Flex, Loader, Text } from '@mantine/core';
import styles from './JobBoard.module.css';
import JobListingItem from './JobListingItem';
import { FC, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import { fetchJobs } from '@/api/job';
import { Job } from '@/models/job.model';
interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
  search: string;
}

const JobListing: FC<JobListingProps> = ({ filterRoles, filterFields, search }) => {
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [jobListings, setJobListings] = useState<Job[]>([]);
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
    // Set initial items per page based on window size
    updateItemsPerPage();
    // Add event listener to update items per page on resize
    window.addEventListener('resize', updateItemsPerPage);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJobs();
        setJobListings(data);
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage); // chunk all listings into four for per page display
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Filter jobs by search term (case-insensitive, matches title or description)
  console.log("JobListing search prop:", search);
  const filteredJobListings = jobListings.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.description.toLowerCase().includes(search.toLowerCase())
  );
  console.log("Filtered jobs:", filteredJobListings);

  const chunkedJobListings = chunk(filteredJobListings, itemsPerPage); // chunk all listings into four for per page display
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
