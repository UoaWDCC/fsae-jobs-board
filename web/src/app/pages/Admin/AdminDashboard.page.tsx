import { Status } from '@/app/type/status';
import { AdminReview } from '@/app/models/adminReview';
import BlackNavbarPlaceholder from '@/app/components/BlackNavbarPlaceholder';
import AdminDashboardTable from '@/app/components/AdminDashboard/AdminDashboardTable';
import Filter from '@/app/components/Filter/Filter';
import { useState, FormEvent, useEffect } from 'react';
import { Role } from '@/app/type/role';
import AdminFilter from '@/app/components/Filter/AdminFilter';
import { Divider, Flex, Grid, Stack } from '@mantine/core';

const mockReview: AdminReview[] = [
  {
    id: '1',
    name: 'Google',
    userType: Role.Alumni,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12',
    name: 'Google',
    userType: Role.Alumni,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123',
    name: 'Google',
    userType: Role.Alumni,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234',
    name: 'Google',
    userType: Role.Student,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123456',
    name: 'Google',
    userType: Role.Student,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234567',
    name: 'Google',
    userType: Role.Sponsor,
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12345678',
    name: 'Google',
    userType: Role.Sponsor,
    date: new Date(),
    status: Status.Approved,
  },
];

export function AdminDashboard() {
  const [filterUserTypes, setFilterUserTypes] = useState<Role[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status[]>([]);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [filteredReview, setFilteredReview] = useState<AdminReview[]>(mockReview);
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const filtered = mockReview.filter((review) => {
      const matchesUserType =
        filterUserTypes.length === 0 || filterUserTypes.includes(review.userType as Role);
      const matchesStatus = filterStatus.length === 0 || filterStatus.includes(review.status);

      return matchesUserType && matchesStatus;
    });
    console.log('Review:', filtered, filterUserTypes);

    setFilteredReview([...filtered]);
  }, [filterStatus, filterUserTypes]);

  return (
    <>
      <BlackNavbarPlaceholder />
      <Grid justify="center" align="flex-start">
        {!isPortrait ? (
          <>
            <Grid.Col span={2} mt={120} pl={10}>
              <AdminFilter
                filterUserTypes={filterUserTypes}
                setFilterUserTypes={setFilterUserTypes}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </Grid.Col>
            <Grid.Col span={0.5} pl={40} style={{ alignSelf: 'stretch' }}>
              <Divider orientation="vertical" size="sm" style={{ height: '80%' }} mt={160} />
            </Grid.Col>
            <Grid.Col span={9}>
              <AdminDashboardTable data={filteredReview} />
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={12}>
            <AdminFilter
              filterUserTypes={filterUserTypes}
              setFilterUserTypes={setFilterUserTypes}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            <AdminDashboardTable data={filteredReview} />
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}
