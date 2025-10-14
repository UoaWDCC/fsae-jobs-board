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
  postedByFilter?: 'all' | 'alumni' | 'sponsors';
  setPostedByFilter?: (filter: 'all' | 'alumni' | 'sponsors') => void;
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
    { value: 'NOT_FOR_HIRE', label: 'None' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'GRAD_ROLE', label: 'Graduate Roles' },
  ];

  const fields = [
    { value: 'BUSINESS', label: 'Business' },
    { value: 'COMPOSITES', label: 'Composites' },
    { value: 'MECHANICAL', label: 'Mechanical' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'AUTONOMOUS', label: 'Autonomous' },
    { value: 'RACE_TEAM', label: 'Race Team' },
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
          { useRoles && postedByFilter && setPostedByFilter ? (
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
            { useRoles && postedByFilter && setPostedByFilter ? (
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
