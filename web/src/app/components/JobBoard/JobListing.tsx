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
    setItemsPerPage(window.innerWidth > 1080 ? 6 : 4);
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
      setLoading(true);
      try {
        const data = await fetchJobs(search);
        setJobListings(data);
        setError(null);
      } catch (err) {
        console.error('[JobListing] fetch error', err);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  // Carl : Filter job listings based on role type
  // Step 1: apply role/field filters
  const byFilter = jobListings.filter(job =>
    job.roleType &&
    (filterRoles.length === 0 ||
      filterRoles.includes(job.roleType.toLowerCase()))
    || (!job.roleType && filterRoles.length === 0)
  );

  // Client-side text search across title/description/specialisation
  const searchLower = (search || '').trim().toLowerCase();
  const bySearch = searchLower
    ? byFilter.filter(job => {
        const title = (job.title || '').toLowerCase();
        const desc = (job.description || '').toLowerCase();
        const spec = (job.specialisation || '').toLowerCase();
        const match = title.includes(searchLower) || desc.includes(searchLower) || spec.includes(searchLower);
        return match;
      })
    : byFilter;

  const filteredJobListings = bySearch;

  // Reset page to 1 whenever filters or search changes
  useEffect(() => setPage(1), [search, filterRoles, filterFields]);

  useEffect(() => { if (error) console.error('[JobListing] error=', error); }, [error]);

  const chunkedJobListings = chunk(filteredJobListings, itemsPerPage);
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

      {!loading && filteredJobListings.length > 0 && (
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
