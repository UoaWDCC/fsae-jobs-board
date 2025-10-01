import React, { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import {
  Grid,
  Card,
  Modal,
  Button,
  Textarea,
  Group,
  Stack,
  Loader,
  Center,
  SimpleGrid,
  Divider,
  Text,
  TextInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { IconUser, IconMail, IconPhone, IconCalendar, IconShield, IconTrash, IconPlus } from '@tabler/icons-react';
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
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create admin form state
  const [createForm, setCreateForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: ''
  });

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

  const handleCreateAdmin = async () => {
    if (!createForm.email || !createForm.firstName || !createForm.lastName || !createForm.phoneNumber || !createForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      await adminApi.createAdmin(createForm);
      
      toast.success('Admin account created successfully');
      
      // Reset form and refresh list
      setCreateForm({ email: '', firstName: '', lastName: '', phoneNumber: '', password: '' });
      await fetchAdmins();
      closeCreate();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create admin account';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
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

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
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
          <Group justify="space-between" mb="md">
            <div style={{ flex: 1 }}>
              <SearchBar
                search={search}
                setSearch={setSearch}
                title="Admin Account Management"
                placeholder="Search Admin Accounts"
              />
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreate}
              mt="xl"
            >
              Create Admin
            </Button>
          </Group>

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

      {/* Create Admin Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title={
          <Group gap="xs">
            <IconPlus size={20} />
            <Text fw={600}>Create Admin Account</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              value={createForm.firstName}
              onChange={(e) => handleCreateFormChange('firstName', e.currentTarget.value)}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              value={createForm.lastName}
              onChange={(e) => handleCreateFormChange('lastName', e.currentTarget.value)}
              required
            />
          </SimpleGrid>

          <TextInput
            label="Email"
            placeholder="Enter email address"
            type="email"
            value={createForm.email}
            onChange={(e) => handleCreateFormChange('email', e.currentTarget.value)}
            required
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={createForm.phoneNumber}
            onChange={(e) => handleCreateFormChange('phoneNumber', e.currentTarget.value)}
            required
          />

          <TextInput
            label="Password"
            placeholder="Enter password"
            type="password"
            value={createForm.password}
            onChange={(e) => handleCreateFormChange('password', e.currentTarget.value)}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={closeCreate}>
              Cancel
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateAdmin}
              disabled={isCreating}
              loading={isCreating}
            >
              Create Admin
            </Button>
          </Group>
        </Stack>
      </Modal>

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