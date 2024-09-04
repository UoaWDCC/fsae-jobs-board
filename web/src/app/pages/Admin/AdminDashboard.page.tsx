import { Stack, Text } from '@mantine/core';
import { Status } from '@/app/type/status';
import { AdminReview } from '@/app/models/adminReview';
import BlackNavbarPlaceholder from '@/app/components/BlackNavbarPlaceholder';
import AdminDashboardTable from '@/app/components/AdminDashboard/AdminDashboardTable';

const mockReview: AdminReview[] = [
  {
    id: '1',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123456',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234567',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12345678',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123456',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234567',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12345678',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
];

export function AdminDashboard() {
  return (
    <>
      <BlackNavbarPlaceholder />
      <Stack justify="center" align="center" gap="md" mt="md" mr="md">
        <Text mt={120}>Welcome to the admin dashboard. You have 12 requests pending review</Text>
        <AdminDashboardTable data={mockReview} />
      </Stack>
    </>
  );
}
