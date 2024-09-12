import { Tabs, Box, Button, Select, Divider, Modal } from '@mantine/core';
import styles from './Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import AlumniProfileTab from '../Tabs/AlumniProfileTab';
import AlumniAboutTab from '../Tabs/AlumniAboutTab';

const EditAlumniProfile = ({ userData, close }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const tabOptions = [
    { value: 'profile', label: 'Profile' },
    { value: 'about', label: 'About Me' },
  ];

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <AlumniProfileTab userData={userData} />;
      case 'about':
        return <AlumniAboutTab userData={userData} />;
    }
  };

  return (
    <Box>
      {isMobile ? ( //conditionally render mobile tab dropdown
        <>
          <Select
            data={tabOptions}
            value={activeTab}
            onChange={(value) => setActiveTab(value as string)}
            classNames={{
              wrapper: styles.selectWrapper,
              input: styles.selectInput,
              dropdown: styles.selectDropdown,
            }}
          />
          <Divider size="md" mt={20} />
          <Box mt={20}>{renderContent()}</Box>
        </>
      ) : (
        <Tabs
          color="#ff8400"
          defaultValue="profile"
          classNames={{
            root: styles.tabRoot,
            list: styles.list,
            panel: styles.panel,
            tabLabel: styles.tabLabel,
          }}
        >
          <Tabs.List>
            {tabOptions.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel value="profile" mt={30}>
            <AlumniProfileTab userData={userData} />
          </Tabs.Panel>
          <Tabs.Panel value="about" mt={30}>
            <AlumniAboutTab userData={userData} />
          </Tabs.Panel>
        </Tabs>
      )}
      <Box className={styles.buttonContainer}>
        <Button className={styles.button1} onClick={close}>
          Cancel
        </Button>
        <Button>Save</Button>
      </Box>
    </Box>
  );
};

export default EditAlumniProfile;
