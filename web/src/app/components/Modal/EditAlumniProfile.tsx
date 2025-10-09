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
import EditModal from './EditModal';
import { verifyPassword } from '@/api/verification';
import { PasswordFormModal } from './PasswordFormModal';
import { sendReverificationEmail } from '@/api/verification';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useValidateEmail } from '@/hooks/useValidateEmail';

const EditAlumniProfile = ({
  close,
  userData,
  setUserData,
}: {
  close: () => void;
  userData: Alumni | null;
  setUserData: React.Dispatch<React.SetStateAction<Alumni | null>>;
}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<Partial<Alumni> | null>(null); // partial because the database schema is currently messed up
  const tabOptions = [
    { value: 'profile', label: 'Profile' },
    { value: 'about', label: 'About Me' },
  ];
  const isMobile = useMediaQuery('(max-width: 430px)'); // mobile screen
  const userId = useSelector((state: RootState) => state.user.id); // the id of the local user
  const navigate = useNavigate();
  const { validate } = useValidateEmail();

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

  const handlePasswordVerify = async (password: string) => {
    if (!newUserData || !userData) return;
    try {
      // call backend to verify password
      const isValid = await verifyPassword(userData.email, password, 'alumni');
      if (!isValid.data) {
        toast.error('Incorrect password');
        return;
      }
      toast.success('Correct password!');

      // send verification email if password correct
      await sendReverificationEmail(newUserData.email!, 'alumni', newUserData.companyName!);
      toast.success('Verification email sent!');
      // navigate to verification page with email, password, and new email
      navigate('/verify', {
        state: { oldEmail: userData.email, password, email: newUserData.email },
        replace: true,
      });

      // save changes to other fields except for email
      const partialAlumni: Partial<Alumni> = {};
      (Object.keys(newUserData) as (keyof Alumni)[]).forEach((key) => {
        if (key === 'email') return;
        if (newUserData[key] !== userData[key]) {
          partialAlumni[key] = newUserData[key] as any;
        }
      });
      console.log(partialAlumni);
      if (Object.keys(partialAlumni).length !== 0) {
        await editAlumniById(userId, partialAlumni);
        setUserData(newUserData as Alumni);
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

    setUserData(newUserData as Alumni);

    const partialAlumni: Partial<Alumni> = {};

    (Object.keys(newUserData) as (keyof Alumni)[]).forEach((key) => {
      if (newUserData[key] !== userData[key]) {
        partialAlumni[key] = newUserData[key] as any;
      }
    });

    if (newUserData.email !== userData.email) {
      // if email has changed, we need to reverify the password
      setPasswordModalOpen(true);
      return;
    }
    await editAlumniById(userId, partialAlumni);
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
      <PasswordFormModal
        opened={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onVerify={handlePasswordVerify}
      />
    </Box>
  );
};

export default EditAlumniProfile;
