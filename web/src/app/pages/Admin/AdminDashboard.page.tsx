import {useState, useEffect} from 'react';
import {Divider, Grid} from '@mantine/core';
import {Role}   from '@/app/type/role';
import {Status} from '@/app/type/status';
import {AdminReview} from '@/models/adminReview.model';
import {adminApi} from '@/api/admin';                        // ← grouped API hub
import AdminFilter        from '@/app/components/Filter/AdminFilter';
import SearchBar          from '@/app/components/SearchBar/SearchBar';
import AdminDashboardTable from '@/app/components/AdminDashboard/AdminDashboardTable';

export function AdminDashboard() {
  const [allReviews, setAllReviews] = useState<AdminReview[]>([]);
  const [filteredReview, setFilteredReview] = useState<AdminReview[]>([]);

  const [filterRoles, setfilterRoles] = useState<Role[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status[]>([]);
  const [search, setSearch] = useState('');

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminApi.getDashboardRequests();
        const hydrated = data.map(d => ({...d, date: new Date(d.date)}));
        setAllReviews(hydrated);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      }
    })();
  }, []);

  useEffect(() => {
    const f = allReviews.filter(r => {
      const okRole   = filterRoles.length  === 0 || filterRoles.includes(r.role);
      const okStatus = filterStatus.length === 0 || filterStatus.includes(r.status);
      const okSearch = search.trim() === '' || r.name.toLowerCase().includes(search.toLowerCase());
      return okRole && okStatus && okSearch;
    });
    setFilteredReview(f);
  }, [allReviews, filterRoles, filterStatus, search]);

  return (
    <Grid justify="center" align="flex-start">
      {!isPortrait ? (
        <>
          <Grid.Col span={2} mt={120} pl={10}>
            <AdminFilter
              filterRoles={filterRoles}
              setfilterRoles={setfilterRoles}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </Grid.Col>

          <Grid.Col span={0.5} pl={40}>
            <Divider orientation="vertical" size="sm" style={{height: '80%'}} mt={160}/>
          </Grid.Col>

          <Grid.Col span={9}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              title="REQUESTS"
              placeholder="Search Requests"
            />
            <AdminDashboardTable data={filteredReview}/>
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            title="REQUESTS"
            placeholder="Search Requests"
          />
          <AdminFilter
            filterRoles={filterRoles}
            setfilterRoles={setfilterRoles}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <AdminDashboardTable data={filteredReview}/>
        </Grid.Col>
      )}
    </Grid>
  );
}
