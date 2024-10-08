import { Checkbox, Title, Button, Stack, Modal, Flex } from '@mantine/core';
import styles from './Filter.module.css';
import { FC, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';

interface FilterProps {
  filterRoles: string[];
  setFilterRoles: (filterRoles: string[]) => void;
  filterFields: string[];
  setFilterFields: (filterFields: string[]) => void;
  color?: string;
  useRoles?: boolean;
}

const Filter: FC<FilterProps> = ({
  filterRoles,
  setFilterRoles,
  filterFields,
  setFilterFields,
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
  const [useRolesFilter, setUseRolesFilter] = useState(useRoles);

  return (
    <>
      {!isPortrait && (
        <Stack mt={70} pl={30}>
          <Title fs="italic" className={styles.filterHeading}>
            Filters
          </Title>
          {useRolesFilter ? (
            <Stack>
              <Checkbox.Group
                value={filterRoles}
                onChange={setFilterRoles}
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
              onChange={setFilterFields}
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

export default Filter;
