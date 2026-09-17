import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import type { Admin } from '../types';

interface DashboardLayoutProps {
  admin: Admin | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  onQuickSearch: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  admin,
  currentTab,
  setCurrentTab,
  onLogout,
  onQuickSearch,
  onOpenCreateModal,
  onOpenImportModal,
  onExportExcel,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Executive Analytics Dashboard';
      case 'employees':
        return 'Employee Directory & Records';
      case 'create-employee':
        return 'Onboard New Employee';
      case 'reports':
        return 'Payroll Invoices & Reports';
      case 'admins':
        return 'Authenticated Admin Management';
      default:
        return 'Enterprise Management System';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070F1E] text-slate-100">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        admin={admin}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          admin={admin}
          currentPathName={getTitle()}
          onQuickSearch={onQuickSearch}
          onOpenCreateModal={onOpenCreateModal}
          onOpenImportModal={onOpenImportModal}
          onExportExcel={onExportExcel}
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        />
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
