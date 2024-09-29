import { Tabs, Box, Button, Select, Divider, Modal } from '@mantine/core';
import { AboutTab } from '../Tabs/AboutTab';
import { EducationTab } from '../Tabs/EducationTab';
import { SkillsTab } from '../Tabs/SkillsTab';
import { CVTab } from '../Tabs/CVTab';
import styles from './Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

export const EditStudentProfile = ({ close }: { close: () => void }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const tabOptions = [
    { value: 'about', label: 'About Me' },
    { value: 'education', label: 'Education' },
    { value: 'skills', label: 'Skills' },
    { value: 'cv', label: 'CV' },
  ];

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTab />;
      case 'education':
        return <EducationTab />;
      case 'skills':
        return <SkillsTab />;
      case 'cv':
        return <CVTab />;
      default:
        return null;
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
          defaultValue="about"
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

          <Tabs.Panel value="about" mt={30}>
            <AboutTab />
          </Tabs.Panel>
          <Tabs.Panel value="education" mt={30}>
            <EducationTab />
          </Tabs.Panel>
          <Tabs.Panel value="skills" mt={30}>
            <SkillsTab />
          </Tabs.Panel>
          <Tabs.Panel value="cv" mt={30}>
            <CVTab />
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
