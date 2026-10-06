import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WordPressSite, UserProfile } from '../types';
import { api } from '../lib/api';
import {
  getCurrentUser,
  signInUser,
  signUpUser,
  signOutUser,
  updateUserProfile,
} from '../lib/supabase';
import { useTheme, Theme } from '../hooks/useTheme';

export type NavigationTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'users'
  | 'sites'
  | 'browser'
  | 'settings';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, phone: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (profile: Partial<UserProfile>) => Promise<void>;

  // Navigation & Sites
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  sites: WordPressSite[];
  isSitesLoading: boolean;
  selectedSiteId: string;
  setSelectedSiteId: (siteId: string) => void;
  currentSite: WordPressSite | null;
  refreshSites: () => Promise<void>;
  addSite: (data: {
    name: string;
    adminUrl: string;
    username: string;
    password: string;
    authType?: 'application_password' | 'standard';
  }) => Promise<WordPressSite>;
  removeSite: (id: string) => Promise<void>;
  testSite: (id: string) => Promise<{ success: boolean; message: string }>;
  syncSite: (id: string) => Promise<void>;

  // UI State
  isAddSiteModalOpen: boolean;
  openAddSiteModal: () => void;
  closeAddSiteModal: () => void;
  isAuditDrawerOpen: boolean;
  toggleAuditDrawer: () => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Toast
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sites & Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [sites, setSites] = useState<WordPressSite[]>([]);
  const [isSitesLoading, setIsSitesLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('wp_master_selected_site') || 'all';
    } catch {
      return 'all';
    }
  });

  // UI modals
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial auth load
  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((u) => {
        if (mounted) {
          setUser(u);
          setIsAuthLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setIsAuthLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Load sites once authenticated
  const refreshSites = async () => {
    try {
      setIsSitesLoading(true);
      const list = await api.getSites();
      setSites(list);
    } catch (err: any) {
      showToast('Failed to load sites', 'error');
    } finally {
      setIsSitesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSites();
    }
  }, [user]);

  const setSelectedSiteId = (id: string) => {
    setSelectedSiteIdState(id);
    try {
      localStorage.setItem('wp_master_selected_site', id);
    } catch {
      // ignore
    }
  };

  const currentSite = sites.find((s) => s.id === selectedSiteId) || null;

  // Auth methods
  const login = async (email: string, pass: string) => {
    const res = await signInUser(email, pass);
    if (res.user) {
      setUser(res.user);
      showToast('Signed in successfully', 'success');
      return { success: true };
    }
    showToast(res.error || 'Login failed', 'error');
    return { success: false, error: res.error || 'Login failed' };
  };

  const signup = async (name: string, phone: string, email: string, pass: string) => {
    const res = await signUpUser({ name, phone, email, password: pass });
    if (res.user) {
      setUser(res.user);
      showToast('Account created successfully', 'success');
      return { success: true };
    }
    showToast(res.error || 'Signup failed', 'error');
    return { success: false, error: res.error || 'Signup failed' };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    showToast('Signed out', 'info');
  };

  const updateUser = async (profile: Partial<UserProfile>) => {
    const res = await updateUserProfile(profile);
    if (res) {
      setUser(res);
      showToast('Profile updated', 'success');
    }
  };

  // Site methods
  const handleAddSite = async (data: {
    name: string;
    adminUrl: string;
    username: string;
    password: string;
    authType?: 'application_password' | 'standard';
  }) => {
    try {
      const newSite = await api.addSite(data);
      setSites((prev) => [...prev, newSite]);
      setSelectedSiteId(newSite.id);
      showToast(`Website "${newSite.name}" connected`, 'success');
      setIsAddSiteModalOpen(false);
      return newSite;
    } catch (err: any) {
      showToast(err.message || 'Failed to add site', 'error');
      throw err;
    }
  };

  const handleRemoveSite = async (id: string) => {
    try {
      await api.removeSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
      if (selectedSiteId === id) {
        setSelectedSiteId('all');
      }
      showToast('Website removed from control panel', 'info');
    } catch (err: any) {
      showToast('Failed to remove website', 'error');
    }
  };

  const handleTestSite = async (id: string) => {
    try {
      const res = await api.testSiteConnection(id);
      await refreshSites();
      showToast(res.message, res.success ? 'success' : 'error');
      return res;
    } catch (err: any) {
      showToast('Connection test failed', 'error');
      return { success: false, message: 'Connection test failed' };
    }
  };

  const handleSyncSite = async (id: string) => {
    try {
      await api.syncSite(id);
      await refreshSites();
      showToast('Website synchronized', 'success');
    } catch (err: any) {
      showToast('Sync failed', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        signup,
        logout,
        updateUser,
        activeTab,
        setActiveTab,
        sites,
        isSitesLoading,
        selectedSiteId,
        setSelectedSiteId,
        currentSite,
        refreshSites,
        addSite: handleAddSite,
        removeSite: handleRemoveSite,
        testSite: handleTestSite,
        syncSite: handleSyncSite,
        isAddSiteModalOpen,
        openAddSiteModal: () => setIsAddSiteModalOpen(true),
        closeAddSiteModal: () => setIsAddSiteModalOpen(false),
        isAuditDrawerOpen,
        toggleAuditDrawer: () => setIsAuditDrawerOpen((prev) => !prev),
        theme,
        toggleTheme,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
