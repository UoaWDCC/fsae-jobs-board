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

export const EditSponsorProfile = () => {
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
        return <SponsorProfileTab />;
      case 'about':
        return <SponsorAboutTab />;
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
            <SponsorProfileTab />
          </Tabs.Panel>
          <Tabs.Panel value="about" mt={30}>
            <SponsorAboutTab />
          </Tabs.Panel>
        </Tabs>
      )}
    </Box>
  );
};
