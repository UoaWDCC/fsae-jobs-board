import { Tabs, Box, Button, Select, Divider, Modal } from '@mantine/core';
import { AboutTab } from '../Tabs/AboutTab';
import { EducationTab } from '../Tabs/EducationTab';
import { SkillsTab } from '../Tabs/SkillsTab';
import { CVTab } from '../Tabs/CVTab';
import styles from './Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { SponsorAboutTab } from '../Tabs/SponsorAboutTab';
import { SponsorProfileTab } from '../Tabs/SponsorProfileTab';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Sponsor } from '@/models/sponsor.model';
import { editSponsorById } from '@/api/sponsor';
import { useEffect } from 'react';

export const EditSponsorProfile = ({ close, userData, setUserData }: { close: () => void, userData: Sponsor | null, setUserData: React.Dispatch<React.SetStateAction<Sponsor | null>>}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [newUserData, setNewUserData] = useState<Partial<Sponsor> | null>(null); // partial because the database schema is currently messed up

  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user
  const tabOptions = [
    { value: 'profile', label: 'Profile' },
    { value: 'about', label: 'About Me' },
  ];

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <SponsorProfileTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      case 'about':
        return <SponsorAboutTab newUserData={newUserData} setNewUserData={setNewUserData} />;
    }
  };

  const saveFields = async () => {
      if (!newUserData) return;
      if (!userData) return;
  
      setUserData(newUserData as Sponsor);
  
      const partialSponsor: Partial<Sponsor> = {};
  
      (Object.keys(newUserData) as (keyof Sponsor)[]).forEach((key) => {
        if (newUserData[key] !== userData[key]) {
          partialSponsor[key] = newUserData[key] as any;
        }
      });
  
      close();
      await editSponsorById(userId, partialSponsor);
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
            <SponsorProfileTab newUserData={newUserData} setNewUserData={setNewUserData}/>
          </Tabs.Panel>
          <Tabs.Panel value="about" mt={30}>
            <SponsorAboutTab newUserData={newUserData} setNewUserData={setNewUserData}/>
          </Tabs.Panel>
        </Tabs>
      )}
      <Box className={styles.buttonContainer}>
        <Button onClick={saveFields}>Save</Button>
      </Box>
    </Box>
  );
};
