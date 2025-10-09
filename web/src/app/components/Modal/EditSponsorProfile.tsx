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
import EditModal from './EditModal';
import { verifyPassword } from '@/api/verification';
import { PasswordFormModal } from './PasswordFormModal';
import { sendReverificationEmail } from '@/api/verification';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useValidateEmail } from '@/hooks/useValidateEmail';

export const EditSponsorProfile = ({
  close,
  userData,
  setUserData,
}: {
  close: () => void;
  userData: Sponsor | null;
  setUserData: React.Dispatch<React.SetStateAction<Sponsor | null>>;
}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<Partial<Sponsor> | null>(null); // partial because the database schema is currently messed up
  const navigate = useNavigate();
  const { validate } = useValidateEmail();

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

  const handlePasswordVerify = async (password: string) => {
    if (!newUserData || !userData) return;
    try {
      // call backend to verify password
      const isValid = await verifyPassword(userData.email, password, 'sponsor');
      if (!isValid.data) {
        toast.error('Incorrect password');
        return;
      }
      toast.success('Correct password!');

      // send verification email if password correct
      await sendReverificationEmail(newUserData.email!, 'sponsor', newUserData.companyName!);
      toast.success('Verification email sent!');
      // navigate to verification page with email, password, and new email
      navigate('/verify', {
        state: { oldEmail: userData.email, password, email: newUserData.email },
        replace: true,
      });

      // save changes to other fields except for email
      const partialSponsor: Partial<Sponsor> = {};
      (Object.keys(newUserData) as (keyof Sponsor)[]).forEach((key) => {
        if (key === 'email') return;
        if (newUserData[key] !== userData[key]) {
          partialSponsor[key] = newUserData[key] as any;
        }
      });
      console.log(partialSponsor);
      if (Object.keys(partialSponsor).length !== 0) {
        await editSponsorById(userId, partialSponsor);
        setUserData(newUserData as Sponsor);
      }
      close();
    } catch (err) {
      toast.error('Failed to verify password or send email');
      console.error(err);
    }
  };

  const saveFields = async () => {
    if (!newUserData) return;
    if (!userData) return;

    const { valid, message } = validate(newUserData);
    if (!valid) {
      toast.error(message);
      console.error(message);
      return;
    }

    setUserData(newUserData as Sponsor);

    const partialSponsor: Partial<Sponsor> = {};

    (Object.keys(newUserData) as (keyof Sponsor)[]).forEach((key) => {
      if (newUserData[key] !== userData[key]) {
        partialSponsor[key] = newUserData[key] as any;
      }
    });

    if (newUserData.email !== userData.email) {
      // if email has changed, we need to reverify the password
      setPasswordModalOpen(true);
      return;
    }
    await editSponsorById(userId, partialSponsor);
    close();
  };

  useEffect(() => {
    setNewUserData(userData);
  }, [userData]);

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
            <SponsorProfileTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
          <Tabs.Panel value="about" mt={30}>
            <SponsorAboutTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
        </Tabs>
      )}
      <Box className={styles.buttonContainer}>
        <Button onClick={saveFields}>Save</Button>
      </Box>
      <PasswordFormModal
        opened={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onVerify={handlePasswordVerify}
      />
    </Box>
  );
};
