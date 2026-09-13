import { useState, useEffect, useCallback } from 'react';
import { Divider, Grid, Button, Box, Group } from '@mantine/core';
import { Status } from '@/app/type/status';
import { AdminReview } from '@/models/adminReview.model';
import { adminApi } from '@/api/admin';
import AdminFilter from '@/app/components/Filter/AdminFilter';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import AdminInviteCodesDashboard from '@/app/components/AdminDashboard/AdminInviteCodesDashboard';
import AdminReviewModal from '@/app/components/Modal/AdminReviewModal';
import Filter from '@/app/components/Filter/Filter';
import { FsaeRole } from '@/models/roles';
import { Role } from '@/app/type/role';
import { InviteCodeModal } from '@/app/components/Modal/InviteCodeModal';
import { API_BASE_URL } from '@/api/ApiInstance';

interface InviteCode {
  id: string;
  code: string;
  isActive: boolean;
  useCount: number;
  maxUses: number;
  createdAt: Date;
}

export function AdminInviteCodes() {
  const [search, setSearch] = useState('');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<InviteCode[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const refresh = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/admin/invite-codes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch invite codes');
    }

    const codes = await response.json();
    const codesWithDates = codes.map((code: InviteCode) => ({
      ...code,
      createdAt: new Date(code.createdAt),
    }));

    setInviteCodes(codesWithDates);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const code = inviteCodes.filter((code) => {
      const codeSearch =
        search.trim() === '' || code.code.toLowerCase().includes(search.toLowerCase());
      return codeSearch;
    });
    setFilteredCodes(code);
  }, [inviteCodes, search]);

  console.log('Filtered Codes:', filteredCodes);

  const table = <AdminInviteCodesDashboard data={filteredCodes} />;
  return (
    <>
      <Grid justify="center" align="flex-start">
        {!isPortrait ? (
          <>
            <Grid.Col span={0.5} pl={40}>
              <Divider orientation="vertical" size="sm" style={{ height: '80%' }} mt={160} />
            </Grid.Col>
            <Grid.Col span={9}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchBar
                    search={search}
                    setSearch={setSearch}
                    title="Invite Codes"
                    placeholder="Search Invite Codes"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    height: '100%',
                    padding: '10px'
                  }}
                >
                  <Button style={{ flex: '0 0 160px' }} onClick={() => setModalOpen(true)}>
                    Create New Code
                  </Button>
                </div>
              </div>

              {table}
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={12}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              title="Invite Codes"
              placeholder="Search Invite Codes"
            />
            {table}
          </Grid.Col>
        )}
        {modalOpen && <InviteCodeModal opened={modalOpen} onClose={() => setModalOpen(false)} />}
      </Grid>
    </>
  );
}
