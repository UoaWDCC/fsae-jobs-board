import React, { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import {
  Grid,
  Card,
  Badge,
  Modal,
  Button,
  Textarea,
  Group,
  Stack,
  Loader,
  Center,
  SimpleGrid,
  Divider,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { IconUser, IconMail, IconPhone, IconCalendar, IconShield, IconTrash } from '@tabler/icons-react';
import SearchBar from '@/app/components/SearchBar/SearchBar';

interface AdminAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  activated: boolean;
  adminStatus: string;
  createdAt: string;
}

export function AdminAccountManagement() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminAccount[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    let f = admins;
    if (search.trim() !== '') {
      f = f.filter(admin => 
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredAdmins(f);
  }, [admins, search]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const adminList = await adminApi.getAdmins();
      setAdmins(adminList);
    } catch (error) {
      toast.error('Failed to fetch admin accounts');
      console.error('Failed to fetch admin accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin || !deleteReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      await adminApi.deleteAdmin(selectedAdmin.id, deleteReason.trim());
      
      toast.success('Admin account deleted successfully');
      
      // Refresh the admin list
      await fetchAdmins();
      handleCloseModal();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete admin account';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    close();
    setSelectedAdmin(null);
    setDeleteReason('');
  };

  const handleAdminClick = (admin: AdminAccount) => {
    setSelectedAdmin(admin);
    open();
    setDeleteReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string, activated: boolean) => {
    if (!activated) return 'red';
    
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string, activated: boolean) => {
    if (!activated) return 'Deactivated';
    
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Grid justify="center" align="flex-start">
        <Grid.Col span={12} px={40}>
          <Center h={300}>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text size="lg">Loading admin accounts...</Text>
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    );
  }

  return (
    <>
      <Grid justify="center" align="flex-start">
        <Grid.Col span={12} px={40}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            title="Admin Account Management"
            placeholder="Search Admin Accounts"
          />

          {filteredAdmins.length === 0 ? (
            <Center py={80}>
              <Stack align="center" gap="md">
                <IconShield size={64} color="var(--mantine-color-gray-5)" />
                <Text size="xl" fw={600}>No Admin Accounts Found</Text>
                <Text c="dimmed">There are no admin accounts to display.</Text>
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" mt="md">
              {filteredAdmins.map((admin) => (
                <Card
                  key={admin.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAdminClick(admin)}
                >
                  <Group justify="space-between" mb="md">
                    <Group gap="xs">
                      <IconUser size={20} />
                      <Text fw={600} size="lg">
                        {admin.firstName} {admin.lastName}
                      </Text>
                    </Group>
                    <Badge
                      color={getStatusColor(admin.adminStatus, admin.activated)}
                      variant="light"
                    >
                      {getStatusLabel(admin.adminStatus, admin.activated)}
                    </Badge>
                  </Group>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm" c="dimmed">
                        {admin.email}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm" c="dimmed">
                        {admin.phoneNumber}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm" c="dimmed">
                        {formatDate(admin.createdAt)}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Grid.Col>
      </Grid>

      {/* Admin Details Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          <Group gap="xs">
            <IconUser size={20} />
            <Text fw={600}>Admin Account Details</Text>
          </Group>
        }
        size="md"
        centered
      >
        {selectedAdmin && (
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              <div>
                <Text size="sm" fw={500} mb={4}>
                  First Name
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedAdmin.firstName}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500} mb={4}>
                  Last Name
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedAdmin.lastName}
                </Text>
              </div>
            </SimpleGrid>

            <div>
              <Text size="sm" fw={500} mb={4}>
                Email
              </Text>
              <Text size="sm" c="dimmed">
                {selectedAdmin.email}
              </Text>
            </div>

            <div>
              <Text size="sm" fw={500} mb={4}>
                Phone Number
              </Text>
              <Text size="sm" c="dimmed">
                {selectedAdmin.phoneNumber}
              </Text>
            </div>

            <div>
              <Text size="sm" fw={500} mb={4}>
                Status
              </Text>
              <Badge
                color={getStatusColor(selectedAdmin.adminStatus, selectedAdmin.activated)}
                variant="light"
              >
                {getStatusLabel(selectedAdmin.adminStatus, selectedAdmin.activated)}
              </Badge>
            </div>

            <div>
              <Text size="sm" fw={500} mb={4}>
                Created At
              </Text>
              <Text size="sm" c="dimmed">
                {formatDate(selectedAdmin.createdAt)}
              </Text>
            </div>

            <Divider />

            <div>
              <Text size="sm" fw={500} mb="xs">
                Deletion Reason
              </Text>
              <Textarea
                placeholder="Provide a reason for deleting this admin account..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.currentTarget.value)}
                rows={3}
                autosize
                minRows={3}
                maxRows={6}
              />
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleDeleteAdmin}
                disabled={isDeleting || !deleteReason.trim()}
                loading={isDeleting}
              >
                Delete Admin
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}