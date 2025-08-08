import React, { useState } from 'react';
import { Box, Button, Flex, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';

export const SkillsTab: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');

  const handleUpperCase = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleAddSkill = (): void => {
    const trimmedSkill = newSkill.trim();
    const upperCaseSkill = handleUpperCase(trimmedSkill);
    if (upperCaseSkill && !skills.includes(upperCaseSkill)) {
      setSkills((current) => [...current, upperCaseSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveValue = (skillToRemove: string): void => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Box>
      <Flex
        align="flex-end"
        gap="sm"
        justify="center"
        classNames={{
          root: styles.skillRoot,
        }}
      >
        <TextInput
          name="skills"
          value={newSkill}
          onChange={(event) => setNewSkill(event.currentTarget.value)}
          placeholder="Add a skill"
          label="Your Skills"
          size="md"
          classNames={{ wrapper: styles.wrapper }}
        />
        <Button name="addSkill" onClick={handleAddSkill} className={styles.addButton}>
          Add
        </Button>
      </Flex>
      <Flex
        mt="md"
        gap="sm"
        wrap="wrap"
        classNames={{
          root: styles.skillContainer,
        }}
      >
        {skills.map((skill) => (
          <Button
            key={skill}
            variant="default"
            onClick={() => handleRemoveValue(skill)}
            className={styles.skillButton}
          >
            {skill} <span style={{ marginLeft: '8px', cursor: 'pointer' }}>x</span>
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
