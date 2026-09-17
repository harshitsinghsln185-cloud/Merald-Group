import { useState, useEffect } from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ExecutiveDashboard } from './features/dashboard/ExecutiveDashboard';
import { EmployeeListPage } from './features/employees/EmployeeListPage';
import { EmployeeCreateModal } from './features/employees/EmployeeCreateModal';
import { EmployeeDetailModal } from './features/employees/EmployeeDetailModal';
import { EmployeeEditModal } from './features/employees/EmployeeEditModal';
import { ExcelImportModal } from './features/employees/ExcelImportModal';
import { PaymentSlipModal } from './features/employees/PaymentSlipModal';
import { InvoiceModal } from './features/invoices/InvoiceModal';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { AdminSetupForm } from './features/auth/AdminSetupForm';
import { AdminManagementModal } from './features/admin/AdminManagementModal';
import { ForgotPasswordModal } from './components/Admin/ForgotPasswordModal';
import { WelcomeLoadingScreen } from './components/common/WelcomeLoadingScreen';
import { useAuth } from './hooks/useAuth';
import { useEmployees } from './hooks/useEmployees';
import { employeeService } from './services/employee.service';
import { authService } from './services/auth.service';
import { exportEmployeesToExcel } from './utils/excelExporter';
import type { Employee } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { admin, login, register, logout } = useAuth();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState<boolean | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Check backend setup status on boot
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await authService.getSetupStatus();
        if (res.data) {
          setIsSetupRequired(res.data.setupRequired);
        } else {
          setIsSetupRequired(false);
        }
      } catch (err) {
        setIsSetupRequired(false);
      }
    };
    checkSetup();
  }, []);

  // TanStack Query custom hook for caching & state management
  const {
    employeesQuery,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees({
    page: currentPage,
    search: searchQuery,
    status: statusFilter,
    limit: 10,
  });

  const { data, isLoading, refetch } = employeesQuery;
  const employeesList = data?.data || [];
  const paginationMeta = data?.pagination || { total: 0, page: 1, pages: 1, limit: 10 };
  const stats = data?.stats || { total: 0, active: 0, inactive: 0, leave: 0, totalSalary: 0 };

  // Modals State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [invoiceEmployee, setInvoiceEmployee] = useState<Employee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Payment Slip Modal state
  const [paymentSlipEmployee, setPaymentSlipEmployee] = useState<Employee | null>(null);
  const [paymentSlipMonthYear, setPaymentSlipMonthYear] = useState<{ month?: number; year?: number }>({});

  // Toast Banner State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleCreateSubmit = async (employeeData: Partial<Employee>) => {
    const res = await createEmployee(employeeData);
    if (res.success) {
      showToast('Employee created and invoice generated successfully!');
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateSubmit = async (id: string, updates: Partial<Employee>) => {
    const res = await updateEmployee({ id, updates });
    if (res.success) {
      showToast('Employee record updated successfully!');
    }
  };

  const handleDeleteSubmit = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      const res = await deleteEmployee(id);
      if (res.success) {
        showToast('Employee record deleted');
        if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.employeeId === id)) {
          setSelectedEmployee(null);
        }
      }
    }
  };

  const handleExportExcel = async () => {
    const serverExported = await employeeService.exportExcel();
    if (!serverExported) {
      exportEmployeesToExcel(employeesList);
      showToast('Exported employee records to Excel file');
    } else {
      showToast('Downloaded Excel employee report');
    }
  };

  const handleOpenPaymentSlip = (emp: Employee, month?: number, year?: number) => {
    setPaymentSlipEmployee(emp);
    setPaymentSlipMonthYear({ month, year });
  };

  if (showWelcomeScreen) {
    return <WelcomeLoadingScreen onComplete={() => setShowWelcomeScreen(false)} />;
  }

  // If backend indicates zero admins exist, render initial executive setup form
  if (isSetupRequired === true) {
    return (
      <AdminSetupForm
        onSetupSubmit={async (setupData) => {
          const res = await authService.setupFirstAdmin(setupData);
          if (res.success) {
            setIsSetupRequired(false);
            window.location.reload();
          }
          return res;
        }}
      />
    );
  }

  if (!admin) {
    if (authView === 'register') {
      return (
        <RegisterForm
          onRegisterSubmit={register}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }

    return (
      <>
        <LoginForm
          onLoginSubmit={login}
          onOpenForgotPassword={() => setShowForgotPassword(true)}
        />
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </>
    );
  }

  return (
    <DashboardLayout
      admin={admin}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onLogout={logout}
      onQuickSearch={(q) => {
        setSearchQuery(q);
        setCurrentTab('employees');
      }}
      onOpenCreateModal={() => setIsCreateModalOpen(true)}
      onOpenImportModal={() => setIsImportModalOpen(true)}
      onExportExcel={handleExportExcel}
    >
      {toast && (
        <div className="fixed top-24 right-8 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F1C2E] border border-emerald-500/40 text-white shadow-2xl">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {currentTab === 'dashboard' && (
        <ExecutiveDashboard
          stats={stats}
          recentEmployees={employeesList}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenEmployees={() => setCurrentTab('employees')}
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
        />
      )}

      {(currentTab === 'employees' || currentTab === 'reports') && (
        <EmployeeListPage
          employees={employeesList}
          pagination={paginationMeta}
          loading={isLoading}
          onPageChange={(p) => setCurrentPage(p)}
          onSearchChange={(s) => setSearchQuery(s)}
          onStatusFilterChange={(st) => setStatusFilter(st)}
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onEditEmployee={(emp) => setEditingEmployee(emp)}
          onDeleteEmployee={handleDeleteSubmit}
          onViewInvoice={(emp) => setInvoiceEmployee(emp)}
          onOpenPaymentSlip={handleOpenPaymentSlip}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onExportExcel={handleExportExcel}
        />
      )}

      {/* Admin Management Modal */}
      <AdminManagementModal
        isOpen={currentTab === 'admins'}
        onClose={() => setCurrentTab('dashboard')}
        currentAdmin={admin}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Employee Create Modal Portal */}
      <EmployeeCreateModal
        isOpen={isCreateModalOpen || currentTab === 'create-employee'}
        onClose={() => {
          setIsCreateModalOpen(false);
          if (currentTab === 'create-employee') setCurrentTab('employees');
        }}
        onSubmit={handleCreateSubmit}
        totalCount={stats.total}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          refetch();
        }}
        onImportComplete={() => refetch()}
      />

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(emp) => setEditingEmployee(emp)}
        onDelete={handleDeleteSubmit}
        onOpenPaymentSlip={handleOpenPaymentSlip}
      />

      <EmployeeEditModal
        employee={editingEmployee}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onSubmit={handleUpdateSubmit}
      />

      <PaymentSlipModal
        employee={paymentSlipEmployee}
        isOpen={Boolean(paymentSlipEmployee)}
        onClose={() => setPaymentSlipEmployee(null)}
        initialMonth={paymentSlipMonthYear.month}
        initialYear={paymentSlipMonthYear.year}
      />

      <InvoiceModal
        employee={invoiceEmployee}
        isOpen={Boolean(invoiceEmployee)}
        onClose={() => setInvoiceEmployee(null)}
      />
    </DashboardLayout>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

