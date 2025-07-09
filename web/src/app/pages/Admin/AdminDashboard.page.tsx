import {useState, useEffect, useCallback} from 'react';
import {Divider, Grid} from '@mantine/core';
import {Role} from '@/app/type/role';
import {Status} from '@/app/type/status';
import {AdminReview} from '@/models/adminReview.model';
import {adminApi} from '@/api/admin';
import AdminFilter from '@/app/components/Filter/AdminFilter';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import AdminDashboardTable from '@/app/components/AdminDashboard/AdminDashboardTable';
import AdminReviewModal from '@/app/components/Modal/AdminReviewModal';
import Filter from '@/app/components/Filter/Filter';

export function AdminDashboard() {
  const [allReviews, setAllReviews] = useState<AdminReview[]>([]);
  const [filteredReview, setFilteredReview] = useState<AdminReview[]>([]);
  const [filterRoles, setfilterRoles] = useState<Role[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status[]>([]);
  const [search, setSearch] = useState('');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<AdminReview | null>(null);

  const refresh = useCallback(async () => {
    const raw = await adminApi.getDashboardRequests();
    console.log('Raw Reviews:', raw);
    setAllReviews(raw.map(r => ({...r, date: new Date(r.date)})));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const f = allReviews.filter(r => {
      const okRole = filterRoles.length === 0 || filterRoles.includes(r.role);
      const okStatus = filterStatus.length === 0 || filterStatus.includes(r.status);
      const okSearch = search.trim() === '' || r.name.toLowerCase().includes(search.toLowerCase());
      return okRole && okStatus && okSearch;
    });
    setFilteredReview(f);
  }, [allReviews, filterRoles, filterStatus, search]);

  console.log('Filtered Reviews:', filteredReview);
  const selectRow = (review: AdminReview) => {
    setDetail(review);
    setModalOpen(true);
  };

  const approve = async (id: string, role: Role) => {
    const d = detail;
    if (!d) return;
    await adminApi.updateStatus(id, role, Status.APPROVED);
    setModalOpen(false);
    refresh();
  };

  const reject = async (id: string, role: Role) => {
    const d = detail;
    if (!d) return;
    await adminApi.updateStatus(id, role, Status.REJECTED);
    setModalOpen(false);
    refresh();
  };

  const table = <AdminDashboardTable data={filteredReview} onSelect={selectRow} />;
  return (
    <>
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
              <Divider orientation="vertical" size="sm" style={{height: '80%'}} mt={160} />
            </Grid.Col>
            <Grid.Col span={9}>
              <SearchBar search={search} setSearch={setSearch} title="REQUESTS" placeholder="Search Requests" />
              {table}
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={12}>
            <SearchBar search={search} setSearch={setSearch} title="REQUESTS" placeholder="Search Requests" />
            <AdminFilter
              filterRoles={filterRoles}
              setfilterRoles={setfilterRoles}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            {table}
          </Grid.Col>
        )}
      </Grid>

      {detail && (
        <AdminReviewModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          detail={detail}
          onApprove={approve}
          onReject={reject}
        />
      )}
    </>
  );
}
