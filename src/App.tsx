import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AddSiteModal } from './components/AddSiteModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';

// Views
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { OrdersView } from './views/OrdersView';
import { UsersView } from './views/UsersView';
import { SitesView } from './views/SitesView';
import { BrowserView } from './views/BrowserView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { Loader2, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isAuthLoading, activeTab, toasts, dismissToast } = useApp();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-2" />
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Initializing WP Master
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'users':
        return <UsersView />;
      case 'sites':
        return <SitesView />;
      case 'browser':
        return <BrowserView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-neutral-100 dark:bg-black light:bg-neutral-50 light:text-neutral-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
        <Header />

        <main className="flex-1 p-3.5 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <AddSiteModal />
      <AuditLogDrawer />
      <OfflineIndicator />

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-lg border shadow-xl flex items-center justify-between text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all animate-in slide-in-from-top-2 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
