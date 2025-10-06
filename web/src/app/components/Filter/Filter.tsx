import { Checkbox, Title, Button, Stack, Modal, Flex } from '@mantine/core';
import styles from './Filter.module.css';
import { FC, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import PostedByFilter from './PostedByFilter';

interface FilterProps {
  filterRoles: string[];
  setFilterRoles: (filterRoles: string[]) => void;
  filterFields: string[];
  setFilterFields: (filterFields: string[]) => void;
  postedByFilter: 'all' | 'alumni' | 'sponsors';
  setPostedByFilter: (filter: 'all' | 'alumni' | 'sponsors') => void;
  color?: string;
  useRoles?: boolean;
}

const Filter: FC<FilterProps> = ({
  filterRoles,
  setFilterRoles,
  filterFields,
  setFilterFields,
  postedByFilter,
  setPostedByFilter,
  color = '#0091ff',
  useRoles = true,
}) => {
  const roles = [
    { value: 'internship', label: 'Internship' },
    { value: 'graduate', label: 'Graduate Roles' },
    { value: 'junior', label: 'Junior Roles' },
  ];

  const fields = [
    { value: 'auto', label: 'Automation' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'mechatronics', label: 'Mechatronics' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const openModalWithLog = () => openModal();
  const closeModalWithLog = () => closeModal();
  const handleRolesChange = (values: string[]) => setFilterRoles(values);
  const handleFieldsChange = (values: string[]) => setFilterFields(values);

  return (
    <>
      {!isPortrait && (
        <Stack mt={70} pl={30}>
          <Title fs="italic" className={styles.filterHeading}>
            Filters
          </Title>
          {useRoles ? (
            <Stack>
              <Checkbox.Group
                value={filterRoles}
                onChange={handleRolesChange}
                label="Role Type"
                labelProps={{ style: { color: color } }}
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
          ) : null}
          <Stack>
            <Checkbox.Group
              value={filterFields}
              onChange={handleFieldsChange}
              label={useRoles ? 'Fields' : 'Industry'}
              labelProps={{ style: { color: color } }}
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
          { useRoles ? (
            <Stack>
              <PostedByFilter 
                value={postedByFilter} 
                onChange={setPostedByFilter}
                color={color}
              />
            </Stack>
          ) : null }
        </Stack>
      )}
      {isPortrait && (
        <>
          <Flex justify="flex-end">
            <Button
              rightSection={<IconArrowDown size={14} />}
              variant="transparent"
              size="lg"
              onClick={openModalWithLog}
            >
              Filter
            </Button>
          </Flex>
            <Modal
            opened={isModalOpen}
            onClose={closeModalWithLog}
            centered
            classNames={{ content: styles.modal, header: styles.modalHeader }}
          >
            <Stack>
              <Checkbox.Group
                  value={filterRoles}
                  onChange={handleRolesChange}
                  label="Role Type"
                  labelProps={{ style: { color: color } }}
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
                onChange={handleFieldsChange}
                label="Fields"
                labelProps={{ style: { color: color } }}
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
            { useRoles ? (
              <Stack>
                <PostedByFilter 
                  value={postedByFilter} 
                  onChange={setPostedByFilter}
                  color={color}
                />
              </Stack>
            ) : null }
          </Modal>
        </>
      )}
    </>
  );
};

export default Filter;
