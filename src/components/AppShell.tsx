import React, { useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile } from '../lib/dbService';

import Dashboard from '../pages/Dashboard';
import Pipeline from '../pages/Pipeline';
import Tasks from '../pages/Tasks';
import Customers from '../pages/Customers';
import Payments from '../pages/Payments';
import Settings from '../pages/Settings';

interface AppShellProps {
  user: Profile;
  onLogout: () => void;
}

export type TabType = 'dashboard' | 'pipeline' | 'tasks' | 'customers' | 'payments' | 'settings';

const AppShell: React.FC<AppShellProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await dbService.signOut();
    onLogout();
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setActiveTab} />;
      case 'pipeline':
        return <Pipeline user={user} />;
      case 'tasks':
        return <Tasks user={user} />;
      case 'customers':
        return <Customers user={user} />;
      case 'payments':
        return <Payments user={user} onInvoicePaid={() => {
          // If invoice paid, we might want to refresh state in other tabs
          // Since it's state-based and queries on load, it'll refresh on dashboard visit
        }} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Dashboard user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="bg-surface-container-lowest overflow-hidden flex h-screen w-screen text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="w-[260px] sidebar-glass border-r border-outline-variant flex-shrink-0 flex flex-col z-20">
        {/* Sidebar Header / Logo */}
        <div className="px-8 py-10 flex flex-col items-center">
          <img
            alt="Vĩnh Hưng Milk Logo"
            className="h-24 w-auto object-contain mb-2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALck2vPufROAPStk22P2ENI-dS0PIK-gaYtrROmrvI13uH3d_obbMRtMi_KjLnBj9GcRCh9xxyQdhLNqaG4KLby6ggYNFwSVi8VFBV9guOH0ndBpjg90cPwARmCJV45qtySsdi_rR7gp3jHM4YLM3ay_VgMb_OOtFxe-hk8VAoKHluqsdGUqMVgalfrdjhOqPnwwBd3mS90yZ_fbsE9U6F4mZ7LSdApjJ9_34SnSLs2uFlruj9cCcVUTB-q1y2pLIhm6846P832DtH"
          />
          <h1 className="font-headline-sm text-headline-sm text-primary-container tracking-tight text-center">
            Vĩnh Hưng Milk
          </h1>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase opacity-60">
            Cổng Quản Trị
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-0 py-4 space-y-1 custom-scrollbar overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'dashboard' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'dashboard' ? 1 : 0}` }}
            >
              dashboard
            </span>
            <span className="font-body-md text-body-md text-left">Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'pipeline' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'pipeline' ? 1 : 0}` }}
            >
              rocket_launch
            </span>
            <span className="font-body-md text-body-md text-left">Cơ hội bán hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'tasks' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'tasks' ? 1 : 0}` }}
            >
              event_note
            </span>
            <span className="font-body-md text-body-md text-left">Công việc</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'customers' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'customers' ? 1 : 0}` }}
            >
              groups
            </span>
            <span className="font-body-md text-body-md text-left">Danh sách khách hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'payments' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'payments' ? 1 : 0}` }}
            >
              payments
            </span>
            <span className="font-body-md text-body-md text-left">Thanh toán</span>
          </button>

          <div className="pt-8 pb-4">
            <div className="h-[1px] bg-outline-variant mx-8 opacity-40"></div>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-8 py-3.5 group transition-all duration-200 ${
              activeTab === 'settings' ? 'nav-item-active' : 'text-[#7C7C75] hover:bg-surface-container-low hover:text-on-background border-l-3 border-transparent'
            }`}
          >
            <span
              className="material-symbols-outlined mr-4 text-[22px]"
              style={{ fontVariationSettings: `'FILL' ${activeTab === 'settings' ? 1 : 0}` }}
            >
              settings
            </span>
            <span className="font-body-md text-body-md text-left">Cài đặt</span>
          </button>
        </nav>

        {/* User Profile Footer */}
        <div className="p-6 border-t border-outline-variant/50 relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center mr-3 border border-primary-container/20 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Headshot user"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7P8hxwE3vIbf-VziHsfYE39mtdhZRkZ2RpkqEbRc8MUe_k-iLbnZ7r5BfwvG9lbO3lEAxASo53HrK6LAMCykkTRyM51wS_YbJH-Qyuj_RTrePMCGq2t9WdOrTgmF2nHXE0hXeojgXh_nZ6xbSY6XfC53USbmVgaJqU2dGo6kFvIn61MREVodV1kbYVe-ln9lA3t2-56483lB5-wKOv4ygVyfS7p2-qUkaWi3a2ONhO5wTILUrZj7mQ2m9favNOEfRv2EvtFylASpt"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-label-md text-on-background truncate">{user.full_name}</p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                {user.role === 'Admin' ? 'Ban Giám Đốc' : user.role === 'Manager' ? 'Trưởng Nhóm' : 'Nhân Viên Sales'}
              </p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">unfold_more</span>
          </div>

          {showUserMenu && (
            <div className="absolute bottom-20 left-6 right-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-2 z-30">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left font-body-md text-body-md p-2 rounded-lg hover:bg-surface-container transition-colors flex items-center space-x-2 text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                <span>Hồ sơ cá nhân</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left font-body-md text-body-md p-2 rounded-lg hover:bg-error-container hover:text-on-error-container transition-colors flex items-center space-x-2 text-error"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#FDFDFB] relative overflow-hidden">
        {/* Top App Bar */}
        <header className="h-20 flex items-center justify-between px-container-padding z-10 border-b border-outline-variant/30 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Chào buổi sáng, {user.full_name.split(' ').pop()}
            </h2>
            <span className="px-3 py-1 bg-primary/10 text-primary font-label-md text-[11px] rounded-full uppercase tracking-widest">
              Hôm nay: {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center space-x-stack-lg">
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
              </button>
            </div>
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Sub page rendering */}
        <div className="flex-1 overflow-hidden relative">
          {renderActivePage()}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
