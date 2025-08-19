import { Box, Button, Flex, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Member } from "@/models/member.model";
import styles from "../Modal/Modal.module.css";

type Props = {
  newUserData: Partial<Member> | null;
  setNewUserData: React.Dispatch<React.SetStateAction<Partial<Member> | null>>;
};

type EducationEntry = {
  id: string;
  university: string;
  degree: string;
  majors: string;
  graduationYear: string;
};

// Parse the flat string[] (used by StudentProfile) into structured entries we can edit here
const parseEducation = (items: string[] | null | undefined): EducationEntry[] => {
  if (!items || items.length === 0) {
    return [emptyEntry()];
  }

  const entries: EducationEntry[] = [];
  let current: EducationEntry = emptyEntry();

  const pushIfFilled = () => {
    const hasContent = [
      current.university,
      current.degree,
      current.majors,
      current.graduationYear,
    ].some((v) => v && v.trim().length > 0);
    if (hasContent) entries.push({ ...current, id: cryptoId() });
    current = emptyEntry();
  };

  items.forEach((line) => {
    const normalized = line.trim();
    if (/^University\s*:/i.test(normalized)) {
      current.university = normalized.split(":").slice(1).join(":").trim();
    } else if (/^Degree\s*:/i.test(normalized)) {
      current.degree = normalized.split(":").slice(1).join(":").trim();
    } else if (/^Majors?\s*:/i.test(normalized)) {
      current.majors = normalized.split(":").slice(1).join(":").trim();
    } else if (/^(Graduation Year|Expected Graduation Date)\s*:/i.test(normalized)) {
      current.graduationYear = normalized.split(":").slice(1).join(":").trim();
      // Heuristic: when we encounter a graduation year/date, consider one block complete
      pushIfFilled();
    } else {
      // If the format is unknown (legacy placeholder), append into majors as a fallback so it still shows up
      current.majors = current.majors
        ? `${current.majors}; ${normalized}`
        : normalized;
    }
  });

  // Push any trailing partially filled block
  pushIfFilled();

  return entries.length > 0 ? entries : [emptyEntry()];
};

const flattenEducation = (entries: EducationEntry[]): string[] => {
  const result: string[] = [];
  entries.forEach((e) => {
    if (e.university) result.push(`University: ${e.university}`);
    if (e.degree) result.push(`Degree: ${e.degree}`);
    if (e.majors) result.push(`Majors: ${e.majors}`);
    if (e.graduationYear) result.push(`Graduation Year: ${e.graduationYear}`);
  });
  return result;
};

const emptyEntry = (): EducationEntry => ({
  id: cryptoId(),
  university: "",
  degree: "",
  majors: "",
  graduationYear: "",
});

const cryptoId = () => Math.random().toString(36).slice(2, 10);

export const EducationTab = ({ newUserData, setNewUserData }: Props) => {
  const [entries, setEntries] = useState<EducationEntry[]>([emptyEntry()]);
  const initializedRef = useRef(false);

  // Initialize local state from incoming userData.education once
  useEffect(() => {
    if (initializedRef.current) return;
    const parsed = parseEducation(newUserData?.education ?? null);
    setEntries(parsed);
    initializedRef.current = true;
  }, [newUserData?.education]);

  // Sync newUserData.education whenever entries change
  useEffect(() => {
    const flat = flattenEducation(entries);
    setNewUserData((prev) => ({ ...(prev || {}), education: flat }));
  }, [entries, setNewUserData]);

  const updateField = (
    index: number,
    field: keyof Omit<EducationEntry, "id">,
    value: string
  ) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as EducationEntry;
      return next;
    });
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, emptyEntry()]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  return (
    <Box>
      {entries.map((entry, index) => (
        <Box key={entry.id} mb="md">
          <Box className={styles.box}>
            <Box style={{ flex: 1 }} className={styles.input}>
              <TextInput
                label="University"
                size="md"
                value={entry.university}
                onChange={(e) => updateField(index, "university", e.currentTarget.value)}
                placeholder="e.g., University of Auckland"
              />
              <TextInput
                label="Majors"
                size="md"
                value={entry.majors}
                onChange={(e) => updateField(index, "majors", e.currentTarget.value)}
                placeholder="e.g., Software Engineering"
              />
            </Box>
            <Box style={{ flex: 1 }} className={styles.input}>
              <TextInput
                label="Degree"
                size="md"
                value={entry.degree}
                onChange={(e) => updateField(index, "degree", e.currentTarget.value)}
                placeholder="e.g., BE(Hons)"
              />
              <TextInput
                label="Graduation Year"
                size="md"
                value={entry.graduationYear}
                onChange={(e) => updateField(index, "graduationYear", e.currentTarget.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g., 2026"
                maxLength={4}
              />
            </Box>
          </Box>
          <Flex justify="flex-end" gap="sm">
            {entries.length > 1 && (
              <Button variant="default" color="red" onClick={() => removeEntry(index)}>
                Remove
              </Button>
            )}
          </Flex>
        </Box>
      ))}
      <Flex justify="flex-end">
        <Button onClick={addEntry}>Add another</Button>
      </Flex>
    </Box>
  );
}
