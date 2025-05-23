
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import CompanyManagement from './admin/CompanyManagement';
import UserManagement from './admin/UserManagement';
import CouponManagement from './settings/CouponManagement';

const AdminTab = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("companies");
  
  // Check if user is admin
  const isAdmin = user?.email === 'dustin.althaus@me.com';

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Zugriff verweigert. Nur Administratoren können auf diesen Bereich zugreifen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Administration</h2>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="companies">Unternehmen</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies" className="mt-6">
          <CompanyManagement />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="coupons" className="mt-6">
          <CouponManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTab;
