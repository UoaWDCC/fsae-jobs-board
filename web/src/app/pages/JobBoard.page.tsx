import { Divider, Modal } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import classes from '../styles/JobBoardPage.module.css';
import { useEffect, useState } from 'react';
import { model } from '@loopback/repository';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [modalOpened, setModalOpened] = useState(false);

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={classes.jobBoardContainer}>
      {!isPortrait && (
        <div className={classes.leftContainer}>
          <JobFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
          />
        </div>
      )}

      {!isPortrait && <Divider orientation="vertical" />}

      <JobListing filterRoles={filterRoles} filterFields={filterFields} openModal={openModal} />
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        centered
        classNames={{ content: classes.modal, header: classes.modalHeader }}
      >
        <JobFilter
          filterRoles={filterRoles}
          setFilterRoles={setFilterRoles}
          filterFields={filterFields}
          setFilterFields={setFilterFields}
        />
      </Modal>
    </div>
  );
}
