import { Tabs, Box, TextInput, Textarea } from '@mantine/core';
import { AboutTab } from '../Tabs/AboutTab';
import { EducationTab } from '../Tabs/EducationTab';
import { SkillsTab } from '../Tabs/SkillsTab'
import { CVTab } from '../Tabs/CVTab'

export const EditStudentProfile = () => {
  return (
    <Tabs color="yellow" defaultValue="about">
      <Tabs.List>
        <Tabs.Tab value="about">About Me</Tabs.Tab>
        <Tabs.Tab value="education">Education</Tabs.Tab>
        <Tabs.Tab value="skills">Skills</Tabs.Tab>
        <Tabs.Tab value="cv">CV</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="about" mt={10}>
        <AboutTab />
      </Tabs.Panel>
      <Tabs.Panel value="education" mt={10}>
        <EducationTab />
      </Tabs.Panel>
      <Tabs.Panel value="skills" mt={10}>
        <SkillsTab />
      </Tabs.Panel>
      <Tabs.Panel value="cv" mt={10}>
        <CVTab />
      </Tabs.Panel>
    </Tabs>
  );
};
