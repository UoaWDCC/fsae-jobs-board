import { Container, Flex, Group, Stack, Table, Text } from '@mantine/core';
import { Status } from '@/app/type/status';
import { AdminReview } from '@/app/models/adminReview';
import { date2string } from '@/app/features/date/dateConverter';

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
];

export function AdminDashboard() {
  const rows = mockReview.map((review) => (
    <Table.Tr key={review.id}>
      <Table.Td>{review.name}</Table.Td>
      <Table.Td>{review.userType}</Table.Td>
      <Table.Td>{date2string(review.date)}</Table.Td>
      <Table.Td>{review.status}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack justify="center" gap="md" mt="md" mr="md">
      <Text mt={120}>Welcome to the admin dashboard. You have 12 requests pending review</Text>
      <div c>
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>User Type</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </Stack>
  );
}
