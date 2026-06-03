import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, Lead, CustomerGroup, MilkType } from '../lib/dbService';


interface CustomersProps {
  user: Profile;
}

const Customers: React.FC<CustomersProps> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<'All' | CustomerGroup>('All');


  // Customer Form state
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [groupType, setGroupType] = useState<CustomerGroup | ''>('');
  const [milkInterests, setMilkInterests] = useState<MilkType[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(0);
  const [stage, setStage] = useState<any>('Tiếp cận');
  const [submitting, setSubmitting] = useState(false);

  // CSV State
  const [csvFileError, setCsvFileError] = useState<string | null>(null);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedLeads = await dbService.getLeads();
      const fetchedProfiles = await dbService.getProfiles();
      setLeads(fetchedLeads);
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddForm = () => {
    setEditingLead(null);
    setName('');
    setContactName('');
    setPhone('');
    setAddress('');
    setGroupType('');
    setMilkInterests([]);
    setAssignedTo(user.role === 'Sales' ? user.id : '');
    setEstimatedRevenue(0);
    setStage('Tiếp cận');
    setShowForm(true);
  };

  const handleOpenEditForm = (lead: Lead) => {
    setEditingLead(lead);
    setName(lead.name);
    setContactName(lead.contact_name);
    setPhone(lead.phone);
    setAddress(lead.address);
    setGroupType(lead.group_type);
    setMilkInterests(lead.milk_interests);
    setAssignedTo(lead.assigned_to || '');
    setEstimatedRevenue(lead.estimated_revenue || 0);
    setStage(lead.stage || 'Tiếp cận');
    setShowForm(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!name.trim()) {
      alert('Vui lòng điền tên khách hàng.');
      return;
    }
    if (!groupType) {
      alert('Vui lòng chọn nhóm khách hàng.');
      return;
    }
    if (milkInterests.length === 0) {
      alert('Vui lòng chọn loại sữa quan tâm.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Lead> = {
        name,
        contact_name: contactName,
        phone,
        address,
        group_type: groupType,
        milk_interests: milkInterests,
        assigned_to: assignedTo ? assignedTo : null,
        stage: stage,
        estimated_revenue: estimatedRevenue,
      };

      if (editingLead) {
        payload.id = editingLead.id;
      }

      await dbService.saveLead(payload);
      await loadData();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Không thể lưu thông tin khách hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (leadId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này? (Dữ liệu sẽ được ẩn đối với Sales/Manager)')) return;

    try {
      if (user.role === 'Admin') {
        // Admins delete physically
        await dbService.deleteLeadPhysical(leadId);
      } else {
        // Sales / Managers hide logically
        await dbService.deleteLeadLogical(leadId);
      }
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Không thể xóa khách hàng.');
    }
  };

  const handleMilkInterestChange = (milk: MilkType) => {
    if (milkInterests.includes(milk)) {
      setMilkInterests(prev => prev.filter(m => m !== milk));
    } else {
      setMilkInterests(prev => [...prev, milk]);
    }
  };

  // CSV Import parser with syntax validation
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileError(null);
    setCsvUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) {
        setCsvFileError('File CSV trống hoặc không đúng định dạng.');
        return;
      }

      lines[0].split(',').map(h => h.trim());
      // Expecting columns: Tên đại lý, Người liên hệ, Số điện thoại, Địa chỉ, Phân khúc, Loại sữa, Số tiền
      const validLeadsToInsert: Partial<Lead>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());
        if (row.length < 5) continue; // Skip incomplete lines

        const [cName, cContact, cPhone, cAddress, cGroup, cMilk, cRev] = row;

        // Check Phân khúc (customer_group)
        const groupNormalized = cGroup as CustomerGroup;
        if (!['Khách lẻ', 'Đại lý', 'VIP'].includes(groupNormalized)) {
          setCsvFileError(`Dòng số ${i + 1} bị sai chữ, vui lòng sửa chữ "${cGroup}" thành "Khách lẻ", "Đại lý" hoặc "VIP".`);
          return;
        }

        // Check Loại sữa (milk_type)
        // Milk interest could be separated by semicolons or vertical bars, e.g. "Sữa tươi; Sữa chua"
        const milkRawList = cMilk.split(/[;|]/).map(m => m.trim());
        const parsedMilkInterests: MilkType[] = [];

        for (const milk of milkRawList) {
          const cleanMilk = milk as MilkType;
          if (!['Sữa tươi', 'Sữa chua', 'Sữa bột'].includes(cleanMilk)) {
            setCsvFileError(`Dòng số ${i + 1} có loại sữa "${milk}" không hợp lệ, vui lòng dùng "Sữa tươi", "Sữa chua" hoặc "Sữa bột".`);
            return;
          }
          parsedMilkInterests.push(cleanMilk);
        }

        const parsedRevenue = Number(cRev) || 0;

        validLeadsToInsert.push({
          name: cName,
          contact_name: cContact,
          phone: cPhone,
          address: cAddress,
          group_type: groupNormalized,
          milk_interests: parsedMilkInterests,
          stage: 'Tiếp cận',
          estimated_revenue: parsedRevenue,
          assigned_to: user.id // Default assign to uploader
        });
      }

      // If everything passes, save them!
      try {
        for (const item of validLeadsToInsert) {
          await dbService.saveLead(item);
        }
        setCsvUploadSuccess(`Đã đưa thành công ${validLeadsToInsert.length} khách hàng vào hệ thống.`);
        loadData();
      } catch (err) {
        console.error('Error importing CSV:', err);
        setCsvFileError('Lỗi trong quá trình lưu dữ liệu từ file CSV.');
      }
    };

    reader.readAsText(file);
    // Reset file input value to allow upload again
    e.target.value = '';
  };

  // CSV Export writer
  const handleCsvExport = () => {
    if (user.role === 'Sales') return; // Chặn ở giao diện

    const headers = ['Tên đại lý/Đơn vị', 'Người liên hệ', 'Số điện thoại', 'Địa chỉ', 'Phân khúc', 'Loại sữa quan tâm', 'Số tiền dự kiến', 'Tiến độ'];
    const rows = filteredLeads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.contact_name.replace(/"/g, '""')}"`,
      l.phone,
      `"${l.address.replace(/"/g, '""')}"`,
      l.group_type,
      `"${l.milk_interests.join('; ')}"`,
      l.estimated_revenue,
      l.stage
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VH_CRM_Danh_Sach_Khach_Hang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAssigneeName = (id: string | null) => {
    if (!id) return 'Chưa phân phối';
    const found = profiles.find(p => p.id === id);
    return found ? found.full_name : 'Không rõ';
  };

  // Search & filter leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = groupFilter === 'All' || l.group_type === groupFilter;

    return matchesSearch && matchesGroup;
  });


  return (
    <div className="h-full flex flex-col p-container-padding pb-8 overflow-hidden">
      
      {/* Header section */}
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Danh sách khách hàng</h2>
          <p className="text-body-md text-on-surface-variant">
            Nơi lưu trữ, quản trị thông tin đại lý, trường học, chuỗi siêu thị đối tác sữa Vĩnh Hưng.
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Export button - Admin/Manager only */}
          {user.role !== 'Sales' && (
            <button
              onClick={handleCsvExport}
              className="flex items-center space-x-2 border border-outline-variant bg-white text-on-surface px-5 py-2.5 rounded-lg font-label-md hover:bg-surface-container-low transition-all cursor-pointer active:scale-95 duration-100"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Xuất CSV</span>
            </button>
          )}

          {/* Import file button */}
          <label className="flex items-center space-x-2 border border-outline-variant bg-white text-on-surface px-5 py-2.5 rounded-lg font-label-md hover:bg-surface-container-low transition-all cursor-pointer active:scale-95 duration-100">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>Nhập CSV</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCsvUpload}
            />
          </label>

          {/* Add customer button */}
          <button
            onClick={handleOpenAddForm}
            className="flex items-center space-x-2 bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </div>

      {/* CSV Status Messages */}
      {csvFileError && (
        <div className="flex-shrink-0 p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl text-body-md flex items-center space-x-2 mb-4">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{csvFileError}</span>
        </div>
      )}
      {csvUploadSuccess && (
        <div className="flex-shrink-0 p-4 bg-primary-container/10 text-primary-container border border-primary/20 rounded-xl text-body-md flex items-center space-x-2 mb-4">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{csvUploadSuccess}</span>
        </div>
      )}

      {/* Filter and search control bar */}
      <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 mb-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
          <input
            type="text"
            className="w-full h-10 pl-10 pr-4 bg-white border border-outline-variant rounded-lg text-body-md custom-input"
            placeholder="Tìm theo tên đại lý, chủ hộ, điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Segment Filter buttons */}
        <div className="flex items-center space-x-2">
          {(['All', 'Khách lẻ', 'Đại lý', 'VIP'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setGroupFilter(tab)}
              className={`px-4 py-1.5 rounded-full font-body-md text-body-md cursor-pointer transition-all ${
                groupFilter === tab
                  ? 'bg-primary-container text-white'
                  : 'bg-white border border-[#EFEFEA] text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab === 'All' ? 'Tất cả' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* DataTable Container */}
      <div className="flex-1 overflow-auto border border-outline-variant/30 rounded-xl bg-surface-container-lowest custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider sticky top-0 z-10">
              <th className="px-6 py-4">Tên đại lý / Khách hàng</th>
              <th className="px-6 py-4">Người liên hệ</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Địa chỉ giao sữa</th>
              <th className="px-6 py-4">Nhóm khách</th>
              <th className="px-6 py-4">Sữa quan tâm</th>
              <th className="px-6 py-4">Nhân viên phụ trách</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 font-body-md text-body-md">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container mb-2 block">progress_activity</span>
                  Đang tải danh sách...
                </td>
              </tr>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="px-6 py-5 font-semibold text-on-surface">{lead.name}</td>
                  <td className="px-6 py-5">{lead.contact_name || '-'}</td>
                  <td className="px-6 py-5">{lead.phone || '-'}</td>
                  <td className="px-6 py-5 max-w-[200px] truncate" title={lead.address}>{lead.address || '-'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      lead.group_type === 'VIP' ? 'bg-amber-100 text-amber-800' :
                      lead.group_type === 'Đại lý' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.group_type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {lead.milk_interests.map(interest => (
                        <span key={interest} className="text-[10px] bg-primary/10 text-primary-container px-2 py-0.5 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">{getAssigneeName(lead.assigned_to)}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEditForm(lead)}
                        className="text-primary hover:text-primary-container p-1"
                        title="Sửa thông tin"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(lead.id)}
                        className="text-on-surface-variant hover:text-error p-1"
                        title="Xóa khách hàng"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-16 text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined text-[48px] mb-2 block">person_search</span>
                  Chưa tìm thấy khách hàng nào khớp với điều kiện.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay">
          <div className="modal-container w-full max-w-lg rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-container-padding pt-container-padding pb-stack-md flex justify-between items-center border-b border-outline-variant/20">
              <h2 className="text-[18px] font-medium text-[#1A1A17]">
                {editingLead ? 'Sửa thông tin khách hàng' : 'Thêm mới khách hàng tiềm năng'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCustomer} className="px-container-padding py-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-name">
                  Tên Đại lý / Trường học / Khách lẻ
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Đại lý Mai Linh, Trường Mầm Non Hoa Hồng..."
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Contact Name & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-contact">
                    Người liên hệ đại diện
                  </label>
                  <input
                    id="lead-contact"
                    type="text"
                    placeholder="Chủ đại lý hoặc kế toán mua"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-phone">
                    Số điện thoại
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    placeholder="Dùng để giao hàng/nhắc nợ"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-address">
                  Địa chỉ chi tiết
                </label>
                <input
                  id="lead-address"
                  type="text"
                  placeholder="Số nhà, ngõ phố, quận huyện, tỉnh thành..."
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Segment Selection - Mandatory */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">
                    Nhóm khách hàng (Phân khúc)
                  </label>
                  <select
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as CustomerGroup)}
                  >
                    <option value="">-- Chọn phân khúc --</option>
                    <option value="Khách lẻ">Khách lẻ</option>
                    <option value="Đại lý">Đại lý</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                {/* Assigned Salesperson */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-assignee">
                    Nhân viên phụ trách
                  </label>
                  <select
                    id="lead-assignee"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Chưa phân phối</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Milk Interests Checkbox - Mandatory */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">
                  Ngành sữa quan tâm (Có thể chọn nhiều)
                </label>
                <div className="flex space-x-6 py-2">
                  {(['Sữa tươi', 'Sữa chua', 'Sữa bột'] as MilkType[]).map(milk => {
                    const isChecked = milkInterests.includes(milk);
                    return (
                      <label key={milk} className="flex items-center space-x-2 cursor-pointer text-body-md">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
                          checked={isChecked}
                          onChange={() => handleMilkInterestChange(milk)}
                        />
                        <span>{milk}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pipeline details if adding details */}
              <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-rev">
                    Doanh thu dự kiến (VND)
                  </label>
                  <input
                    id="lead-rev"
                    type="number"
                    placeholder="Số tiền ước tính"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={estimatedRevenue || ''}
                    onChange={(e) => setEstimatedRevenue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="lead-stage">
                    Giai đoạn kinh doanh
                  </label>
                  <select
                    id="lead-stage"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="Tiếp cận">Tiếp cận</option>
                    <option value="Tư vấn mẫu thử">Tư vấn mẫu thử</option>
                    <option value="Đàm phán">Đàm phán</option>
                    <option value="Thành công">Thành công</option>
                    <option value="Thất bại">Thất bại</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 flex justify-end items-center gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-[#EFEFEA] bg-white text-[#1A1A17] font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2 bg-[#1E5E3A] text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer flex items-center justify-center"
                >
                  {submitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span>Lưu khách hàng</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
