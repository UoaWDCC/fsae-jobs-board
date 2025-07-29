import { Tabs, Box, Button, Select, Divider } from '@mantine/core';
import styles from './Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import AlumniProfileTab from '../Tabs/AlumniProfileTab';
import AlumniAboutTab from '../Tabs/AlumniAboutTab';
import { Alumni } from '@/models/alumni.model';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { useEffect } from 'react';
import { editAlumniById } from '@/api/alumni';

const EditAlumniProfile = ({ close, userData, setUserData }: { close: () => void , userData: Alumni | null, setUserData: React.Dispatch<React.SetStateAction<Alumni | null>>}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [newUserData, setNewUserData] = useState<Partial<Alumni> | null>(null); // partial because the database schema is currently messed up
  const tabOptions = [
    { value: 'profile', label: 'Profile' },
    { value: 'about', label: 'About Me' },
  ];
  const isMobile = useMediaQuery('(max-width: 430px)'); // mobile screen
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <AlumniProfileTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      case 'about':
        return <AlumniAboutTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      default:
        return null;
    }
  };

  const saveFields = async () => {
    if (!newUserData) return;
    if (!userData) return;

    setUserData(newUserData as Alumni);

    const partialAlumni: Partial<Alumni> = {};

    (Object.keys(newUserData) as (keyof Alumni)[]).forEach((key) => {
      if (newUserData[key] !== userData[key]) {
        partialAlumni[key] = newUserData[key] as any;
      }
    });

    close();
    await editAlumniById(userId, partialAlumni);
  }

  useEffect(() => {
    setNewUserData(userData);
  }, [userData])

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
            <AlumniProfileTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
          <Tabs.Panel value="about" mt={30}>
            <AlumniAboutTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
        </Tabs>
      )}
      <Box className={styles.buttonContainer}>
        <Button className={styles.button1} onClick={close}>
          Cancel
        </Button>
        <Button onClick={saveFields}>Save</Button>
      </Box>
    </Box>
  );
};

export default EditAlumniProfile;
