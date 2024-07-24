import React, { useState } from 'react';
import { Box, Button, Flex, TextInput } from '@mantine/core';

export const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const handleUpperCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    const upperCaseSkill = handleUpperCase(trimmedSkill)
    if (upperCaseSkill && !skills.includes(upperCaseSkill)) {
      setSkills((current) => [...current, upperCaseSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveValue = (skillToRemove) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Box>
      <Flex align="center" gap="sm">
        <TextInput
          value={newSkill}
          onChange={(event) => setNewSkill(event.currentTarget.value)}
          placeholder="Add a skill"
          label="Your favorite libraries"
        />
        <Button onClick={handleAddSkill}>Add</Button>
      </Flex>
      <Flex mt="md" gap="sm" wrap="wrap">
        {skills.map((skill) => (
          <Button key={skill} variant="default" onClick={() => handleRemoveValue(skill)}>
            {skill} <span style={{ marginLeft: '8px', cursor: 'pointer' }}>x</span>
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
