import { Stack, Text, Checkbox, Title, Divider } from '@mantine/core';

interface Option {
  value: string;
  label: string;
}

interface AdminAuditLogFiltersProps {
  logTypeOptions: Option[];
  statusOptions: Option[];
  filterLogTypes: string[];
  setFilterLogTypes: (fn: (val: string[]) => string[]) => void;
  filterStatuses: string[];
  setFilterStatuses: (fn: (val: string[]) => string[]) => void;
  isPortrait: boolean;
}

export default function AdminAuditLogFilters({
  logTypeOptions,
  statusOptions,
  filterLogTypes,
  setFilterLogTypes,
  filterStatuses,
  setFilterStatuses,
  isPortrait,
}: AdminAuditLogFiltersProps) {
  if (!isPortrait) {
    return (
      <Stack>
        <Title fs="italic" c="white" fz="lg"> Filters</Title>
        <Text fw={700} size="lg" mb={4} c="blue.6">Log Type</Text>
        {logTypeOptions.map(opt => (
          <Checkbox
            key={opt.value}
            label={<Text size="md" fw={500} c="white">{opt.label}</Text>}
            checked={filterLogTypes.includes(opt.value)}
            onChange={e => {
              setFilterLogTypes(val =>
                e.target.checked
                  ? [...val, opt.value]
                  : val.filter(v => v !== opt.value)
              );
            }}
            size="md"
            color="blue"
            radius="md"
            mb={8}
          />
        ))}
        <Text fw={700} size="lg" mb={4} mt={16} c="blue.6">Request Status</Text>
        {statusOptions.map(opt => (
          <Checkbox
            key={opt.value}
            label={<Text size="md" fw={500} c="white">{opt.label}</Text>}
            checked={filterStatuses.includes(opt.value)}
            onChange={e => {
              setFilterStatuses(val =>
                e.target.checked
                  ? [...val, opt.value]
                  : val.filter(v => v !== opt.value)
              );
            }}
            size="md"
            color="blue"
            radius="md"
            mb={8}
          />
        ))}
      </Stack>
    );
  }
  return (
    <Stack>
      <Text fw={700} size="lg" mb={12} c="white" style={{ letterSpacing: 1 }}>Filter</Text>
      <Text fw={700} size="sm" mb={4} c="blue.6">Log Type</Text>
      {logTypeOptions.map(opt => (
        <Checkbox
          key={opt.value}
          label={<Text size="sm" fw={500} c="gray.8">{opt.label}</Text>}
          checked={filterLogTypes.includes(opt.value)}
          onChange={e => {
            setFilterLogTypes(val =>
              e.target.checked
                ? [...val, opt.value]
                : val.filter(v => v !== opt.value)
            );
          }}
          size="md"
          color="blue"
          radius="md"
          mb={8}
        />
      ))}
      <Text fw={700} size="sm" mb={4} mt={16} c="blue.6">Request Status</Text>
      {statusOptions.map(opt => (
        <Checkbox
          key={opt.value}
          label={<Text size="sm" fw={500} c="gray.8">{opt.label}</Text>}
          checked={filterStatuses.includes(opt.value)}
          onChange={e => {
            setFilterStatuses(val =>
              e.target.checked
                ? [...val, opt.value]
                : val.filter(v => v !== opt.value)
            );
          }}
          size="md"
          color="blue"
          radius="md"
          mb={8}
        />
      ))}
    </Stack>
  );
}
