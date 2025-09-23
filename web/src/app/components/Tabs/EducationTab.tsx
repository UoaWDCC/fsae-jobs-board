import { Box, Button, Flex, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Member } from "@/models/member.model";
import { Education } from "@/models/education.model";
import styles from "../Modal/Modal.module.css";

type Props = {
  newUserData: Partial<Member> | null;
  setNewUserData: React.Dispatch<React.SetStateAction<Partial<Member> | null>>;
};

const emptyEntry = (): Education => ({
  id: "0",
  schoolName: "",
  degreeName: "",
  major: "",
  grade: "",
  startYear: "",
  endYear: "",
});

// Generate the next sequential numeric ID as a string, based on existing IDs in the list
const nextSequentialId = (items: Pick<Education, 'id'>[]): string => {
  const next =
    items.reduce((max, e) => {
      const n = Number(e.id);
      return Number.isFinite(n) && n >= 0 ? Math.max(max, n) : max;
    }, -1) + 1;
  return String(next);
};

// Renumber entries to have sequential IDs starting from 0 (used when hydrating from existing data)
const renumberSequential = (items: Education[]): Education[] =>
  items.map((e, idx) => ({ ...e, id: String(idx) }));

export const EducationTab = ({ newUserData, setNewUserData }: Props) => {
  const [entries, setEntries] = useState<Education[]>([emptyEntry()]);
  const [hydrated, setHydrated] = useState(false);
  const [touched, setTouched] = useState(false);

  // Hydrate local state from incoming userData.education once when it becomes available
  useEffect(() => {
    if (hydrated) return;
    const incoming = newUserData?.education as Education[] | undefined;
    if (incoming) {
      setEntries(incoming.length > 0 ? renumberSequential(incoming) : [emptyEntry()]);
      setHydrated(true);
    }
  }, [newUserData?.education, hydrated]);

  // Sync newUserData.education whenever entries change (only after initial hydration)
  useEffect(() => {
    if (!(hydrated || touched)) return;
    // Filter out any entries that don't have both required fields filled
    const validEntries = entries.filter(isEntryValid);
    setNewUserData((prev) => ({ ...(prev || {}), education: validEntries.length > 0 ? validEntries : [] }));
  }, [entries, setNewUserData, hydrated, touched]);

  const updateField = (
    index: number,
    field: keyof Omit<Education, "id">,
    value: string
  ) => {
    setTouched(true);
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as Education;
      return next;
    });
  };
  
  // Add a new empty entry with the next sequential ID
  const addEntry = () => {
    setTouched(true);
    setEntries((prev) => {
      const id = nextSequentialId(prev);
      return [...prev, { ...emptyEntry(), id }];
    });
  };

  // Remove entry at index, but ensure at least one entry remains
  const removeEntry = (index: number) => {
    setTouched(true);
    setEntries((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Helpers to sanitize and validate year inputs
  const sanitizeYear = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 4);
  const normalizeEndYear = (value: string) => {
    const v = value.trim();
    if (/^p(resent)?$/i.test(v)) return "Present";
    return sanitizeYear(v);
  };

  // Basic validation helpers based on Ticket requirements
  const isValidStartYear = (v: string) => v === "" || /^\d{4}$/.test(v);
  const isValidEndYear = (v: string) => v === "" || /^\d{4}$/.test(v) || /^present$/i.test(v);
  const hasRangeError = (s: string, e?: string) => {
    if (!s || !e) return false; // only validate when both provided
    if (!/^\d{4}$/.test(s)) return false; // start invalid handled elsewhere
    if (!(/^\d{4}$/.test(e) || /^present$/i.test(e))) return false; // end invalid handled elsewhere
    if (/^present$/i.test(e)) return false; // Present is always >= any start
    return Number(s) > Number(e);
  };
  
  // Check if an education entry has all required fields filled
  const isEntryValid = (entry: Education): boolean => {
    return entry.schoolName !== "" && entry.degreeName !== "";
  };

  return (
    <Box>
      {entries.map((entry, index) => (
        <Box key={entry.id} mb="md">
          <Box className={styles.box}>
            <Box style={{ flex: 1 }} className={styles.input}>
              <TextInput
                label="School name"
                size="md"
                value={entry.schoolName}
                onChange={(e) => updateField(index, "schoolName", e.currentTarget.value)}
                placeholder="e.g., The University of Auckland"
                required
                error={entry.schoolName === "" ? "School name is required" : undefined}
              />
              <TextInput
                label="Degree name"
                size="md"
                value={entry.degreeName}
                onChange={(e) => updateField(index, "degreeName", e.currentTarget.value)}
                placeholder="e.g., Bachelor of Engineering (Honours)"
                required
                error={entry.degreeName === "" ? "Degree name is required" : undefined}
              />
              <TextInput
                label="Major"
                size="md"
                value={entry.major}
                onChange={(e) => updateField(index, "major", e.currentTarget.value)}
                placeholder="e.g., Software Engineering"
              />
            </Box>
            <Box style={{ flex: 1 }} className={styles.input}>
              <TextInput
                label="Grade"
                size="md"
                value={entry.grade || ""}
                onChange={(e) => updateField(index, "grade", e.currentTarget.value)}
                placeholder="e.g., 9.0 GPA or First Class Honours"
              />
              <TextInput
                label="Start year"
                size="md"
                value={entry.startYear}
                onChange={(e) => updateField(index, "startYear", sanitizeYear(e.currentTarget.value))}
                placeholder="e.g., 2024"
                maxLength={4}
                error={entry.startYear && !isValidStartYear(entry.startYear) ? "Enter a 4-digit year" : undefined}
              />
              <TextInput
                label="End year"
                size="md"
                value={entry.endYear || ""}
                onChange={(e) => updateField(index, "endYear", normalizeEndYear(e.currentTarget.value))}
                placeholder="e.g., 2027 or Present"
                error={
                  entry.endYear && !isValidEndYear(entry.endYear)
                    ? "Enter a 4-digit year or 'Present'"
                    : hasRangeError(entry.startYear, entry.endYear)
                      ? "End year must be greater than start year"
                      : undefined
                }
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
