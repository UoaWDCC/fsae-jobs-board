import { Checkbox, Title, Button, Stack, Modal, Flex } from '@mantine/core';
import styles from '../Filter/Filter.module.css'
import { FC, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';

interface FilterProps {
  filterRoles: string[];
  setFilterRoles: (filterRoles: string[]) => void;
  filterFields: string[];
  setFilterFields: (filterFields: string[]) => void;
  color?: string;
}

const AlumniFilter: FC<FilterProps> = ({
  filterRoles,
  setFilterRoles,
  filterFields,
  setFilterFields,
  color = '#0091ff',
  useRoles = true,
}) => {
  const fields = [
    { value: 'aero', label: 'Aerospace' },
    { value: 'automation', label: 'Automation' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'mechatronics', label: 'Mechatronics' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
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
              value={filterFields}
              onChange={setFilterFields}
              label= 'Industry'
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
                value={filterFields}
                onChange={setFilterFields}
                label="Industry"
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

export default AlumniFilter;
