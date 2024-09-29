import { Tabs, Box, Button, Select, Divider, Modal, Text, useMantineTheme } from '@mantine/core';
import styles from './Modal.module.css';
import settingStyles from '../Tabs/Settings.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import PasswordTab from '../Tabs/PasswordTab';
import EmailTab from '../Tabs/EmailTab';
import DeleteTab from '../Tabs/DeleteTab';

export const EditSetting = ({ close }: { close: () => void }) => {
  const [activeTab, setActiveTab] = useState('password');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const theme = useMantineTheme();

  const tabOptions = [
    { value: 'password', label: 'Change Password' },
    { value: 'email', label: 'Change Email' },
    { value: 'delete', label: 'Delete Account' },
  ];

  const [userData, setUserData] = useState({
    password: 'abcd1234',
    email: 'user@fsae.com',
  });

  const isMobile = useMediaQuery('(max-width: 430px)'); //mobile screen

  const renderContent = () => {
    switch (activeTab) {
      case 'password':
        return <PasswordTab password={userData.password} />;
      case 'email':
        return <EmailTab email={userData.email} />;
      case 'delete':
        return <DeleteTab />;
      default:
        return null;
    }
  };

  const handleTabChange = (value: string | null) => {
    if (value !== null) {
      setActiveTab(value);
    }
  };

  return (
    <Box>
      {isMobile ? ( //conditionally render mobile tab dropdown
        <>
          <Select
            data={tabOptions}
            value={activeTab}
            onChange={handleTabChange}
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
          value={activeTab}
          onChange={handleTabChange}
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

          <Tabs.Panel value="password" mt={30}>
            <PasswordTab password={userData.password} />
          </Tabs.Panel>
          <Tabs.Panel value="email" mt={30}>
            <EmailTab email={userData.email} />
          </Tabs.Panel>
          <Tabs.Panel value="delete" mt={30}>
            <DeleteTab />
          </Tabs.Panel>
        </Tabs>
      )}
      <Box className={settingStyles.buttonContainer} mb={20} mt={40}>
        <Button className={settingStyles.button1} onClick={close}>
          Cancel
        </Button>
        <Button
          style={{
            backgroundColor:
              activeTab === 'delete' ? theme.colors.customRed[0] : theme.colors.customButtonBlue[0],
          }}
          className={settingStyles.button2}
        >
          {activeTab === 'delete' ? 'Delete' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};
