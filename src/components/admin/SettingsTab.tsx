
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySettings from './settings/CompanySettings';
import UserManagement from './settings/UserManagement';

const SettingsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("company");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Einstellungen</h2>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="company">Unternehmen</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="mt-6">
          <CompanySettings />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
