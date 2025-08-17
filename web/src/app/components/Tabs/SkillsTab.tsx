import React, { useState } from 'react';
import { Box, Button, Flex, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';
import { Member } from '@/models/member.model';

export const SkillsTab = ({
  newUserData,
  setNewUserData,
}: {
  newUserData: Partial<Member> | null;
  setNewUserData: React.Dispatch<React.SetStateAction<Partial<Member> | null>>;
}) => {
  const [newSkill, setNewSkill] = useState<string>("");

  const skills = newUserData?.skills ?? [];

  const toTitleCase = (s: string): string =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const handleAddSkill = (): void => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    const normalized = toTitleCase(trimmed);

    setNewUserData((prev) => {
      const prevSkills = prev?.skills ?? [];
      if (prevSkills.includes(normalized)) return prev ?? {};
      return { ...(prev ?? {}), skills: [...prevSkills, normalized] };
    });

    setNewSkill("");
  };

  const handleRemoveValue = (skillToRemove: string): void => {
    setNewUserData((prev) => {
      const prevSkills = prev?.skills ?? [];
      const nextSkills = prevSkills.filter((s) => s !== skillToRemove);
      return { ...(prev ?? {}), skills: nextSkills };
    });
  };

  return (
    <Box>
      <Flex
        align="flex-end"
        gap="sm"
        justify="center"
        classNames={{ root: styles.skillRoot }}
      >
        <TextInput
          value={newSkill}
          onChange={(e) => setNewSkill(e.currentTarget.value)}
          placeholder="Add a skill"
          label="Your Skills"
          size="md"
          classNames={{ wrapper: styles.wrapper }}
        />
        <Button onClick={handleAddSkill} className={styles.addButton}>
          Add
        </Button>
      </Flex>

      <Flex
        mt="md"
        gap="sm"
        wrap="wrap"
        classNames={{ root: styles.skillContainer }}
      >
        {(skills as string[]).map((skill) => (
          <Button
            key={skill}
            variant="default"
            onClick={() => handleRemoveValue(skill)}
            className={styles.skillButton}
          >
            {skill}
            <span style={{ marginLeft: 8, cursor: "pointer" }}>x</span>
          </Button>
        ))}
      </Flex>
    </Box>
  );
};