import { useState } from "react";
import { Tabs } from '@mantine/core';
import { AdminApplications } from "./AdminApplications.page";
import { AdminAuditLog } from "./AdminAuditLog.page";
import { AdminAccountManagement } from "./AdminAccountManagement.page";

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<string | null>('requests');
    
    return (
        <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List justify="center">
                <Tabs.Tab value="requests">
                    Requests
                </Tabs.Tab>
                <Tabs.Tab value="audit">
                    Audit Log
                </Tabs.Tab>
                <Tabs.Tab value="account">
                    Admin Accounts
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="requests">
                <AdminApplications />
            </Tabs.Panel>

            <Tabs.Panel value="audit">
                <AdminAuditLog />
            </Tabs.Panel>

            <Tabs.Panel value="account">
                <AdminAccountManagement />
            </Tabs.Panel>
        </Tabs>
    );
}