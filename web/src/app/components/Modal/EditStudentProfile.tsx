import { Tabs, Box, TextInput, Textarea, Button, Select, Divider } from '@mantine/core';
import { AboutTab } from '../Tabs/AboutTab';
import { EducationTab } from '../Tabs/EducationTab';
import { SkillsTab } from '../Tabs/SkillsTab';
import { CVTab } from '../Tabs/CVTab';
import styles from '../../styles/Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import {useState} from 'react'

export const EditStudentProfile = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabOptions = [
    { value: 'about', label: 'About Me' },
    { value: 'education', label: 'Education' },
    { value: 'skills', label: 'Skills' },
    { value: 'cv', label: 'CV' },
  ];

  const isMobile = useMediaQuery('(max-width: 430px)');

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
      {isMobile ? (
        <>
          <Select
            data={tabOptions}
            value={activeTab}
            onChange={(value) => setActiveTab(value)}
            classNames={{
              wrapper: styles.selectWrapper,
              input: styles.selectInput,
              dropdown: styles.selectDropdown,
            }}
          />
          <Divider size="md" mt={20} />
          <Box mt={20}>{renderContent()}</Box>
          <Box className={styles.buttonContainer}>
            <Button className={styles.button1}>Cancel</Button>
            <Button className={styles.button2}>Save</Button>
          </Box>
        </>
      ) : (
        <Tabs
          color="yellow"
          defaultValue="about"
          classNames={{
            root: styles.root,
            list: styles.list,
            panel: styles.panel,
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

          <Box className={styles.buttonContainer}>
            <Button className={styles.button1}>Cancel</Button>
            <Button className={styles.button2}>Save</Button>
          </Box>
        </Tabs>
      )}
    </Box>
  );
};
