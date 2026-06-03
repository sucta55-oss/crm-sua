import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, UserRole } from '../lib/dbService';


interface SettingsProps {
  user: Profile;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [activeSettingSection, setActiveSettingSection] = useState<'profile' | 'users'>('profile');

  // Staff creation form state
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Sales');
  const [creating, setCreating] = useState(false);
  
  // Profile editing role state
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserRole>('Sales');
  const [editingName, setEditingName] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadProfiles = async () => {
    if (user.role !== 'Admin') return;
    setLoadingProfiles(true);
    try {
      const fetched = await dbService.getProfiles();
      setProfiles(fetched);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newFullName.trim()) {
      alert('Vui lòng điền email và tên nhân viên.');
      return;
    }

    setCreating(true);
    try {
      const result = await dbService.signUp(newEmail, newFullName, newRole);
      if (result.error) {
        alert(result.error.message);
      } else if (result.user) {
        alert('Tạo nhân viên mới thành công!');
        setNewEmail('');
        setNewFullName('');
        setNewRole('Sales');
        loadProfiles();
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo nhân sự.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEditRole = (p: Profile) => {
    setEditingProfileId(p.id);
    setEditingRole(p.role);
    setEditingName(p.full_name);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileId) return;

    setUpdating(true);
    try {
      await dbService.updateProfileRole(editingProfileId, editingRole, editingName);
      alert('Cập nhật tài khoản nhân viên thành công.');
      setEditingProfileId(null);
      loadProfiles();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật chức vụ.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-container-padding gap-stack-lg overflow-y-auto lg:overflow-hidden">
      
      {/* Sidebar - Left side 30% */}
      <div className="w-full lg:w-[30%] bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col space-y-2 flex-shrink-0">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 px-2">Cài đặt hệ thống</h3>
        
        <button
          onClick={() => setActiveSettingSection('profile')}
          className={`w-full text-left p-3 rounded-lg font-body-md text-body-md transition-colors flex items-center space-x-3 ${
            activeSettingSection === 'profile'
              ? 'bg-primary-container text-white'
              : 'hover:bg-surface-container text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">account_box</span>
          <span>Thông tin cá nhân</span>
        </button>

        {user.role === 'Admin' && (
          <button
            onClick={() => setActiveSettingSection('users')}
            className={`w-full text-left p-3 rounded-lg font-body-md text-body-md transition-colors flex items-center space-x-3 ${
              activeSettingSection === 'users'
                ? 'bg-primary-container text-white'
                : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            <span>Quản lý nhân sự</span>
          </button>
        )}
      </div>

      {/* Main Content - Right side 70% */}
      <div className="w-full lg:w-[70%] bg-surface-container-lowest border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col overflow-y-auto custom-scrollbar">
        
        {activeSettingSection === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Thông tin cá nhân</h2>
              <p className="text-body-md text-on-surface-variant">Chi tiết hồ sơ nhân sự của bạn trong Vĩnh Hưng CRM.</p>
            </div>
            
            <div className="border-t border-outline-variant/30 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block mb-1">
                    Địa chỉ Email
                  </label>
                  <p className="w-full bg-surface-container-low p-3 rounded-lg font-body-md text-body-md text-on-surface border border-outline-variant/30 select-all">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block mb-1">
                    Chức vụ phân quyền
                  </label>
                  <p className="w-full bg-surface-container-low p-3 rounded-lg font-body-md text-body-md text-on-surface border border-outline-variant/30">
                    {user.role === 'Admin' ? 'Quản trị viên (Admin)' : user.role === 'Manager' ? 'Trưởng nhóm' : 'Nhân viên kinh doanh (Sales)'}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block mb-1">
                  Họ và tên đầy đủ
                  </label>
                <p className="w-full bg-surface-container-low p-3 rounded-lg font-body-md text-body-md text-on-surface border border-outline-variant/30">
                  {user.full_name}
                </p>
              </div>

              {/* Decorative note */}
              <div className="bg-[#F7F5F0] p-4 rounded-lg flex items-center space-x-3 text-[12px] text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
                <p className="leading-snug">
                  Vai trò của bạn được đồng bộ hóa an toàn. Để thay đổi chức danh, liên hệ Ban Giám Đốc.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSettingSection === 'users' && user.role === 'Admin' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Quản lý nhân viên</h2>
              <p className="text-body-md text-on-surface-variant">Phân quyền, cấp tài khoản và cấu hình chức danh cho nhân sự.</p>
            </div>

            {/* Layout divided into Staff list & Add Form */}
            <div className="grid grid-cols-12 gap-6 border-t border-outline-variant/30 pt-4">
              
              {/* Left inside: List of staff accounts (7 cols) */}
              <div className="col-span-12 xl:col-span-7 space-y-3">
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Danh sách tài khoản ({profiles.length})</h4>
                
                {loadingProfiles ? (
                  <p className="text-body-md text-on-surface-variant py-4 text-center">Đang tải...</p>
                ) : (
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {profiles.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 bg-surface-container-low border border-outline-variant/35 rounded-lg">
                        <div>
                          <p className="font-body-md text-body-md font-semibold">{p.full_name}</p>
                          <p className="text-[12px] text-on-surface-variant">{p.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            p.role === 'Manager' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {p.role}
                          </span>
                          <button
                            onClick={() => handleOpenEditRole(p)}
                            className="p-1 hover:bg-surface-container-high rounded text-primary"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_note</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right inside: Forms (5 cols) */}
              <div className="col-span-12 xl:col-span-5 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-4">
                
                {!editingProfileId ? (
                  /* Create form */
                  <form onSubmit={handleCreateStaff} className="space-y-3">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cấp tài khoản mới</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="staff-name">Tên nhân viên</label>
                      <input
                        id="staff-name"
                        type="text"
                        required
                        className="w-full h-9 px-3 bg-white border border-outline-variant rounded text-body-md custom-input"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="staff-email">Địa chỉ Email</label>
                      <input
                        id="staff-email"
                        type="email"
                        required
                        className="w-full h-9 px-3 bg-white border border-outline-variant rounded text-body-md custom-input"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="staff-role">Chức vụ</label>
                      <select
                        id="staff-role"
                        className="w-full h-9 px-3 bg-white border border-outline-variant rounded text-body-md custom-input"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                      >
                        <option value="Sales">Sales</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={creating}
                      className="w-full h-9 bg-primary-container text-white font-label-md text-[12px] rounded hover:opacity-90 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {creating ? (
                        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      ) : (
                        <span>Tạo nhân viên</span>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Edit form */
                  <form onSubmit={handleUpdateRole} className="space-y-3">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cập nhật tài khoản</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="edit-name">Họ tên nhân viên</label>
                      <input
                        id="edit-name"
                        type="text"
                        required
                        className="w-full h-9 px-3 bg-white border border-outline-variant rounded text-body-md custom-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="edit-role">Chức vụ mới</label>
                      <select
                        id="edit-role"
                        className="w-full h-9 px-3 bg-white border border-outline-variant rounded text-body-md custom-input"
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value as UserRole)}
                      >
                        <option value="Sales">Sales</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProfileId(null)}
                        className="flex-1 h-9 border border-[#EFEFEA] bg-white text-on-surface font-label-md text-[12px] rounded hover:bg-surface-container-high transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 h-9 bg-primary-container text-white font-label-md text-[12px] rounded hover:opacity-90 transition-all flex items-center justify-center cursor-pointer"
                      >
                        {updating ? (
                          <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        ) : (
                          <span>Cập nhật</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
