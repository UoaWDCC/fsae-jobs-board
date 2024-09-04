import { Checkbox, Title, Button, Stack, Modal, Flex } from '@mantine/core';
import styles from './Filter.module.css';
import { FC, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import { Role } from '@/app/type/role';
import { Status } from '@/app/type/status';
import { UserType } from '../../features/user/userSlice';

interface Props {
  filterUserTypes: Role[];
  setFilterUserTypes: (filterRoles: Role[]) => void;
  filterStatus: Status[];
  setFilterStatus: (filterFields: Status[]) => void;
}

const AdminFilter: FC<Props> = ({
  filterUserTypes,
  setFilterUserTypes,
  filterStatus,
  setFilterStatus,
}) => {
  const roles = [
    { label: 'Sponsor', value: Role.Sponsor },
    { label: 'Student', value: Role.Student },
    { label: 'Alumni', value: Role.Alumni },
    // Add other roles as needed
  ];

  const statusOptions = [
    { value: Status.Pending, label: 'Pending' },
    { value: Status.Approved, label: 'Approved' },
    { value: Status.Rejected, label: 'Rejected' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  return (
    <>
      {!isPortrait && (
        <Stack mt={70} pl={30}>
          <Title fs="italic" className={styles.filterHeading}>
            Filters
          </Title>

          <Stack>
            <Checkbox.Group
              value={filterUserTypes.map((role) => role as unknown as string)} // Convert enums to strings
              onChange={(selectedValues: string[]) => {
                setFilterUserTypes(selectedValues.map((value) => value as Role)); // Convert strings back to RoleType
              }}
              label="User Type"
              labelProps={{ style: { color: 'customAzureBlue.1' } }}
              classNames={{ label: styles.filterSubheading }}
            >
              {roles.map((role) => (
                <Checkbox
                  key={role.value}
                  value={role.value as unknown as string}
                  label={role.label}
                  color="customAzureBlue.1"
                  className={styles.checkbox}
                  size="md"
                />
              ))}
            </Checkbox.Group>
          </Stack>

          <Stack>
            <Checkbox.Group
              value={filterStatus.map((status) => status as unknown as string)} // Convert enums to strings
              onChange={(selectedValues: string[]) => {
                setFilterStatus(selectedValues.map((value) => value as Status)); // Convert strings back to Status enums
              }}
              label="Status"
              labelProps={{ style: { color: 'customAzureBlue.1' } }}
              classNames={{ label: styles.filterSubheading }}
            >
              {statusOptions.map((status) => (
                <Checkbox
                  key={status.value}
                  value={status.value as unknown as string} // Cast enum values to strings
                  label={status.label}
                  color="customAzureBlue.1"
                  className={styles.checkbox}
                  size="md"
                />
              ))}
            </Checkbox.Group>
          </Stack>
        </Stack>
      )}
      {isPortrait && (
        <>
          <Flex justify="flex-end">
            <Button
              rightSection={<IconArrowDown size={14} />}
              variant="transparent"
              size="lg"
              onClick={openModal}
            >
              Filter
            </Button>
          </Flex>
          <Modal
            opened={isModalOpen}
            onClose={closeModal}
            centered
            classNames={{ content: styles.modal, header: styles.modalHeader }}
          >
            <Stack>
              <Checkbox.Group
                value={filterRoles}
                onChange={setFilterRoles}
                label="Role Type"
                classNames={{ label: styles.filterSubheading }}
              >
                {roles.map((role) => (
                  <Checkbox
                    key={role.value}
                    value={role.value}
                    label={role.label}
                    color={color}
                    className={styles.checkbox}
                    size="md"
                  />
                ))}
              </Checkbox.Group>
            </Stack>
            <Stack>
              <Checkbox.Group
                value={filterFields}
                onChange={setFilterFields}
                label="Fields"
                classNames={{ label: styles.filterSubheading }}
              >
                {fields.map((role) => (
                  <Checkbox
                    key={role.value}
                    value={role.value}
                    label={role.label}
                    color={color}
                    className={styles.checkbox}
                    size="md"
                  />
                ))}
              </Checkbox.Group>
            </Stack>
          </Modal>
        </>
      )}
    </>
  );
};

export default AdminFilter;
