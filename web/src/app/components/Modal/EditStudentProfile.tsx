import { Tabs, Box, Button, Select, Divider, Modal } from '@mantine/core';
import { AboutTab } from '../Tabs/AboutTab';
import { EducationTab } from '../Tabs/EducationTab';
import { SkillsTab } from '../Tabs/SkillsTab';
import { CVTab } from '../Tabs/CVTab';
import styles from './Modal.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useValidateEmail } from '@/hooks/useValidateEmail';
import { useEffect, useState } from 'react';
import { Member } from '@/models/member.model';
import { editMemberById } from '@/api/member';
import { sendReverificationEmail } from '@/api/verification';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { RootState } from '@/app/store';
import { send } from 'vite';
import { useNavigate } from 'react-router-dom';
import { PasswordFormModal } from './PasswordFormModal';
import EditModal from './EditModal';
import { verifyPassword } from '@/api/verification';

export const EditStudentProfile = ({
  close,
  userData,
  setUserData,
}: {
  close: () => void;
  userData: Member | null;
  setUserData: React.Dispatch<React.SetStateAction<Member | null>>;
}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<Partial<Member> | null>(null); // partial because the database schema is currently messed up
  const { validate } = useValidateEmail();
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user

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
        return <AboutTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      case 'education':
        return <EducationTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      case 'skills':
        return <SkillsTab newUserData={newUserData} setNewUserData={setNewUserData} />;
      case 'cv':
        return <CVTab />;
      default:
        return null;
    }
  };

  const handlePasswordVerify = async (password: string) => {
    if (!newUserData || !userData) return;
    try {
      // call backend to verify password
      const isValid = await verifyPassword(userData.email, password);
      if (!isValid.data) {
        toast.error('Incorrect password');
        return;
      }
      toast.success('Correct password!');

      // send verification email if password correct
      await sendReverificationEmail(newUserData.email!, 'member', newUserData.firstName!);
      toast.success('Verification email sent!');
      // navigate to verification page with email, password, and new email
      navigate('/verify', { state: { oldEmail: userData.email, password, email: newUserData.email }, replace: true });

      // save changes to other fields except for email
      const partialMember: Partial<Member> = {};
      (Object.keys(newUserData) as (keyof Member)[]).forEach((key) => {
        if (key === 'email') return;
        if (newUserData[key] !== userData[key]) {
          partialMember[key] = newUserData[key] as any;
        }
      });
      await editMemberById(userId, partialMember);
      setUserData(newUserData as Member);
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

    setUserData(newUserData as Member);

    const partialMember: Partial<Member> = {};

    (Object.keys(newUserData) as (keyof Member)[]).forEach((key) => {
      if (newUserData[key] !== userData[key]) {
        partialMember[key] = newUserData[key] as any;
      }
    });
    if (newUserData.email !== userData.email) {
      // if email has changed, we need to reverify
      setPasswordModalOpen(true);
      return;
    }
    console.log('save button ran');
    await editMemberById(userId, partialMember);
    close();
  };

  useEffect(() => {
    console.log(userData);
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
            <AboutTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
          <Tabs.Panel value="education" mt={30}>
            <EducationTab newUserData={newUserData} setNewUserData={setNewUserData} />
          </Tabs.Panel>
          <Tabs.Panel value="skills" mt={30}>
            <SkillsTab newUserData={newUserData} setNewUserData={setNewUserData} />
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
