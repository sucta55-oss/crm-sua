import { supabase } from './supabaseClient';

export type UserRole = 'Sales' | 'Manager' | 'Admin';
export type CustomerGroup = 'Khách lẻ' | 'Đại lý' | 'VIP';
export type MilkType = 'Sữa tươi' | 'Sữa chua' | 'Sữa bột';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Chưa hoàn thành' | 'Đang làm' | 'Đã hoàn thành';
export type PipelineStage = 'Tiếp cận' | 'Tư vấn mẫu thử' | 'Đàm phán' | 'Thành công' | 'Thất bại';
export type InvoiceStatus = 'Chờ thanh toán' | 'Đã thanh toán một phần' | 'Đã thanh toán' | 'Quá hạn';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  contact_name: string;
  phone: string;
  address: string;
  group_type: CustomerGroup;
  milk_interests: MilkType[];
  assigned_to: string | null; // Profile ID
  lead_list_id?: string | null;
  is_deleted: boolean;
  created_at: string;
  stage: PipelineStage; // Merged from pipeline_stages table for ease
  estimated_revenue: number;
  lost_reason?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  lead_id: string | null;
  assigned_to: string; // Profile ID
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_code: string;
  lead_id: string; // Lead ID
  amount: number;
  payment_method: string;
  status: InvoiceStatus;
  paid_at?: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}

// Initial Mock Data
const MOCK_PROFILES: Profile[] = [
  { id: 'a1111111-1111-1111-1111-111111111111', email: 'admin@vinhhungmilk.vn', full_name: 'Ban Giám Đốc Vĩnh Hưng', role: 'Admin' },
  { id: 'm2222222-2222-2222-2222-222222222222', email: 'manager_mienbac@vinhhungmilk.vn', full_name: 'Trần Minh Hải (Trưởng nhóm MB)', role: 'Manager' },
  { id: 's3333333-3333-3333-3333-333333333333', email: 'sales_haiphong@vinhhungmilk.vn', full_name: 'Nguyễn Văn Đạt (Kinh doanh)', role: 'Sales' },
];

const MOCK_LEADS: Lead[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Chuỗi siêu thị Co.opmart Nguyễn Đình Chiểu',
    contact_name: 'Bà Nguyễn Thục Anh',
    phone: '0901234567',
    address: 'Số 168 Nguyễn Đình Chiểu, Quận 3, TP. HCM',
    group_type: 'VIP',
    milk_interests: ['Sữa tươi', 'Sữa chua'],
    assigned_to: 'm2222222-2222-2222-2222-222222222222',
    is_deleted: false,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Đàm phán',
    estimated_revenue: 120000000,
  },
  {
    id: 'c2000000-0000-0000-0000-000000000002',
    name: 'Công ty Cổ phần Thực phẩm và Nước giải khát Green Foods',
    contact_name: 'Ông Phạm Minh Tuấn',
    phone: '0912345678',
    address: 'KCN Tân Bình, Quận Tân Phú, TP. HCM',
    group_type: 'VIP',
    milk_interests: ['Sữa bột'],
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    is_deleted: false,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Tiếp cận',
    estimated_revenue: 350000000,
  },
  {
    id: 'c3000000-0000-0000-0000-000000000003',
    name: 'Đại lý Sữa và Bỉm Mai Linh (Hà Nội)',
    contact_name: 'Bà Lê Thị Mai',
    phone: '0923456789',
    address: 'Số 45 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    group_type: 'Đại lý',
    milk_interests: ['Sữa tươi', 'Sữa bột'],
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    is_deleted: false,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Tư vấn mẫu thử',
    estimated_revenue: 45000000,
  },
  {
    id: 'c4000000-0000-0000-0000-000000000004',
    name: 'Nhà phân phối Tiêu dùng nhanh Nam Phát (Hải Phòng)',
    contact_name: 'Ông Hoàng Văn Nam',
    phone: '0934567890',
    address: 'Số 12 Lê Hồng Phong, Ngô Quyền, Hải Phòng',
    group_type: 'Đại lý',
    milk_interests: ['Sữa chua'],
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    is_deleted: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Đàm phán',
    estimated_revenue: 65000000,
  },
  {
    id: 'c5000000-0000-0000-0000-000000000005',
    name: 'Trường Mầm non Tư thục Bình Minh Montessori',
    contact_name: 'Bà Vũ Thu Hương',
    phone: '0945678901',
    address: 'KĐT Trung Hòa - Nhân Chính, Thanh Xuân, Hà Nội',
    group_type: 'VIP',
    milk_interests: ['Sữa tươi'],
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    is_deleted: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Thành công',
    estimated_revenue: 85000000,
  },
  {
    id: 'c6000000-0000-0000-0000-000000000006',
    name: 'Cửa hàng Tạp hóa bình ổn Thanh Hải (Quận 7)',
    contact_name: 'Ông Trần Thanh Hải',
    phone: '0956789012',
    address: 'Số 789 Huỳnh Tấn Phát, Quận 7, TP. HCM',
    group_type: 'Khách lẻ',
    milk_interests: ['Sữa tươi', 'Sữa chua'],
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    is_deleted: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Thất bại',
    estimated_revenue: 12000000,
    lost_reason: 'Chê giá cao và chính sách vận chuyển chưa phù hợp',
  },
];

const MOCK_TASKS = (): Task[] => [
  {
    id: 't1',
    title: 'Chuyển giao 3 thùng sữa chua mẫu vị dâu mới',
    description: 'Mang qua trực tiếp cho đại lý kiểm tra hương vị và phản hồi.',
    lead_id: 'c3000000-0000-0000-0000-000000000003',
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    priority: 'High',
    status: 'Chưa hoàn thành',
    deadline: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Gọi điện thương thảo lại tỷ lệ chiết khấu',
    description: 'Thảo luận đơn hàng sữa tươi học đường cho mầm non Bình Minh.',
    lead_id: 'c5000000-0000-0000-0000-000000000005',
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    priority: 'High',
    status: 'Chưa hoàn thành',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000).toISOString(), // Tomorrow 11:30
    created_at: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Kiểm tra thời hạn sử dụng lô sữa bột tồn kho',
    description: 'Đến tận kho rà soát hạn sử dụng, lên kế hoạch đổi trả hàng cận date.',
    lead_id: 'c4000000-0000-0000-0000-000000000004',
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    priority: 'Medium',
    status: 'Đang làm',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Gửi email bảng báo giá chi tiết sữa bột',
    description: 'Báo giá dòng sản phẩm sữa bột nguyên kem cho đối tác Green Foods.',
    lead_id: 'c2000000-0000-0000-0000-000000000002',
    assigned_to: 's3333333-3333-3333-3333-333333333333',
    priority: 'Low',
    status: 'Chưa hoàn thành',
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Gặp trực tiếp thu hồi biên bản ký kết hợp đồng',
    description: 'Thu hồi biên bản hợp đồng phân phối sữa tươi năm 2026.',
    lead_id: 'c1000000-0000-0000-0000-000000000001',
    assigned_to: 'm2222222-2222-2222-2222-222222222222',
    priority: 'High',
    status: 'Chưa hoàn thành',
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'i1',
    invoice_code: 'HD-001',
    lead_id: 'c1000000-0000-0000-0000-000000000001',
    amount: 120000000,
    payment_method: 'Chuyển khoản',
    status: 'Chờ thanh toán',
    created_at: new Date().toISOString(),
  },
  {
    id: 'i2',
    invoice_code: 'HD-002',
    lead_id: 'c2000000-0000-0000-0000-000000000002',
    amount: 350000000,
    payment_method: 'Chuyển khoản',
    status: 'Chờ thanh toán',
    created_at: new Date().toISOString(),
  },
  {
    id: 'i3',
    invoice_code: 'HD-003',
    lead_id: 'c3000000-0000-0000-0000-000000000003',
    amount: 45000000,
    payment_method: 'Tiền mặt',
    status: 'Đã thanh toán',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'i4',
    invoice_code: 'HD-004',
    lead_id: 'c4000000-0000-0000-0000-000000000004',
    amount: 65000000,
    payment_method: 'Chuyển khoản',
    status: 'Đã thanh toán một phần',
    created_at: new Date().toISOString(),
  },
  {
    id: 'i5',
    invoice_code: 'HD-005',
    lead_id: 'c5000000-0000-0000-0000-000000000005',
    amount: 85000000,
    payment_method: 'Chuyển khoản',
    status: 'Đã thanh toán',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'i6',
    invoice_code: 'HD-006',
    lead_id: 'c6000000-0000-0000-0000-000000000006',
    amount: 12000000,
    payment_method: 'Tiền mặt',
    status: 'Quá hạn',
    created_at: new Date().toISOString(),
  },
];

// Helper to determine if we should fall back
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!url && url !== 'https://your-project-id.supabase.co' && !!key && key.length > 20;
};

// State Store for Local Storage Fallback
const initializeLocalStorage = () => {
  if (!localStorage.getItem('vh_profiles')) {
    localStorage.setItem('vh_profiles', JSON.stringify(MOCK_PROFILES));
  }
  if (!localStorage.getItem('vh_leads')) {
    localStorage.setItem('vh_leads', JSON.stringify(MOCK_LEADS));
  }
  if (!localStorage.getItem('vh_tasks')) {
    localStorage.setItem('vh_tasks', JSON.stringify(MOCK_TASKS()));
  }
  if (!localStorage.getItem('vh_invoices')) {
    localStorage.setItem('vh_invoices', JSON.stringify(MOCK_INVOICES));
  }
  if (!localStorage.getItem('vh_logs')) {
    localStorage.setItem('vh_logs', JSON.stringify([]));
  }
};

if (!isSupabaseConfigured()) {
  initializeLocalStorage();
}

// User state helper
export const getLoggedInUser = (): Profile | null => {
  const stored = localStorage.getItem('vh_current_user');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export const setLoggedInUser = (user: Profile | null) => {
  if (user) {
    localStorage.setItem('vh_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('vh_current_user');
  }
};

// Database Service API
export const dbService = {
  // --- AUTH SERVICES ---
  async signIn(email: string, password: string): Promise<{ user: Profile | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          // Fetch profile details
          const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (pError) throw pError;
          return { user: profile as Profile, error: null };
        }
      } catch (err: any) {
        return { user: null, error: err };
      }
    }

    // Fallback Mock Auth
    const profiles: Profile[] = JSON.parse(localStorage.getItem('vh_profiles') || '[]');
    const user = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setLoggedInUser(user);
      return { user, error: null };
    } else {
      // Mock signup automatically
      const newUser: Profile = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        full_name: email.split('@')[0],
        role: 'Sales'
      };
      profiles.push(newUser);
      localStorage.setItem('vh_profiles', JSON.stringify(profiles));
      setLoggedInUser(newUser);
      return { user: newUser, error: null };
    }
  },

  async signInWithGoogle(): Promise<{ user: Profile | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return { user: null, error: null }; // Will redirect
      } catch (err: any) {
        return { user: null, error: err };
      }
    }

    // Fallback: Login with first user
    const profiles: Profile[] = JSON.parse(localStorage.getItem('vh_profiles') || '[]');
    const user = profiles[2]; // Default Sales user for quick testing
    setLoggedInUser(user);
    return { user, error: null };
  },

  async signUp(email: string, fullName: string, role: UserRole = 'Sales'): Promise<{ user: Profile | null; error: Error | null }> {
    if (isSupabaseConfigured()) {
      try {
        // Sign up through auth.
        // Direct profile creation will happen via trigger.
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'Password123!', // Temporary password
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          // If we are admin, we can set the role explicitly via profiles update
          const { error: roleErr } = await supabase
            .from('profiles')
            .update({ role, full_name: fullName })
            .eq('id', data.user.id);
          if (roleErr) console.warn('Could not set custom role in signup:', roleErr);
          
          return {
            user: { id: data.user.id, email, full_name: fullName, role },
            error: null
          };
        }
      } catch (err: any) {
        return { user: null, error: err };
      }
    }

    // Fallback Mock
    const profiles: Profile[] = JSON.parse(localStorage.getItem('vh_profiles') || '[]');
    if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: new Error('Email đã tồn tại trên hệ thống!') };
    }
    const newUser: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      full_name: fullName,
      role
    };
    profiles.push(newUser);
    localStorage.setItem('vh_profiles', JSON.stringify(profiles));
    return { user: newUser, error: null };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setLoggedInUser(null);
  },

  // --- LEADS / CUSTOMERS SERVICES ---
  async getLeads(): Promise<Lead[]> {
    const currentUser = getLoggedInUser();
    if (!currentUser) return [];

    if (isSupabaseConfigured()) {
      try {
        // Query database. RLS policies will filter automatically.
        const { data: leads, error: lError } = await supabase
          .from('leads')
          .select(`
            *,
            pipeline_stages (
              stage,
              estimated_revenue,
              lost_reason
            )
          `)
          .eq('is_deleted', false);
        
        if (lError) throw lError;
        return (leads || []).map((l: any) => {
          const stageRecord = l.pipeline_stages?.[0] || {};
          return {
            ...l,
            stage: stageRecord.stage || 'Tiếp cận',
            estimated_revenue: Number(stageRecord.estimated_revenue || 0),
            lost_reason: stageRecord.lost_reason
          };
        });
      } catch (err) {
        console.error('Error fetching leads from Supabase, falling back to local:', err);
      }
    }

    // Fallback Mock RLS Filtering
    const allLeads: Lead[] = JSON.parse(localStorage.getItem('vh_leads') || '[]');
    const activeLeads = allLeads.filter(l => !l.is_deleted);

    if (currentUser.role === 'Admin') {
      return activeLeads;
    } else if (currentUser.role === 'Manager') {
      // In mock data, manager can see leads assigned to anyone or specific IDs in team.
      // We'll let manager see all leads in mock data to make testing easier.
      return activeLeads;
    } else {
      // Sales only see their assigned leads
      return activeLeads.filter(l => l.assigned_to === currentUser.id);
    }
  },

  async saveLead(lead: Partial<Lead>): Promise<Lead> {
    const currentUser = getLoggedInUser();
    if (!currentUser) throw new Error('Chưa đăng nhập');

    if (isSupabaseConfigured()) {
      try {
        const isNew = !lead.id;
        const leadPayload = {
          name: lead.name,
          contact_name: lead.contact_name,
          phone: lead.phone,
          address: lead.address,
          group_type: lead.group_type,
          milk_interests: lead.milk_interests,
          assigned_to: lead.assigned_to || (isNew ? currentUser.id : undefined),
          is_deleted: lead.is_deleted ?? false,
        };

        let leadResult;
        if (isNew) {
          const { data, error } = await supabase.from('leads').insert([leadPayload]).select().single();
          if (error) throw error;
          leadResult = data;
        } else {
          const { data, error } = await supabase.from('leads').update(leadPayload).eq('id', lead.id).select().single();
          if (error) throw error;
          leadResult = data;
        }

        // Save stage details in pipeline_stages
        const stagePayload = {
          lead_id: leadResult.id,
          deal_name: `Cơ hội - ${leadResult.name}`,
          stage: lead.stage || 'Tiếp cận',
          estimated_revenue: lead.estimated_revenue || 0,
          lost_reason: lead.lost_reason || null,
        };

        const { data: currentStage } = await supabase
          .from('pipeline_stages')
          .select('id')
          .eq('lead_id', leadResult.id)
          .single();

        if (currentStage) {
          await supabase.from('pipeline_stages').update(stagePayload).eq('id', currentStage.id);
        } else {
          await supabase.from('pipeline_stages').insert([stagePayload]);
        }

        this.addActivityLog(
          isNew ? 'Thêm mới khách hàng' : 'Cập nhật khách hàng',
          `Khách hàng: ${leadResult.name}. Trạng thái: ${lead.stage || 'Tiếp cận'}`
        );

        return {
          ...leadResult,
          stage: lead.stage || 'Tiếp cận',
          estimated_revenue: lead.estimated_revenue || 0,
          lost_reason: lead.lost_reason
        };
      } catch (err) {
        console.error('Error saving lead to Supabase:', err);
        throw err;
      }
    }

    // Fallback Mock Save
    const allLeads: Lead[] = JSON.parse(localStorage.getItem('vh_leads') || '[]');
    let result: Lead;
    if (lead.id) {
      const idx = allLeads.findIndex(l => l.id === lead.id);
      if (idx === -1) throw new Error('Không tìm thấy khách hàng');
      
      // If moving to Success and it's retail client, upgrade to Agent
      let groupType = lead.group_type || allLeads[idx].group_type;
      if (lead.stage === 'Thành công' && groupType === 'Khách lẻ') {
        groupType = 'Đại lý';
      }

      result = {
        ...allLeads[idx],
        ...lead,
        group_type: groupType,
      } as Lead;
      allLeads[idx] = result;
      this.addActivityLog('Cập nhật khách hàng (Local)', `Khách hàng: ${result.name}. Tiến độ: ${result.stage}`);
    } else {
      result = {
        id: 'c_' + Math.random().toString(36).substr(2, 9),
        name: lead.name || '',
        contact_name: lead.contact_name || '',
        phone: lead.phone || '',
        address: lead.address || '',
        group_type: lead.group_type || 'Khách lẻ',
        milk_interests: lead.milk_interests || [],
        assigned_to: lead.assigned_to || currentUser.id,
        is_deleted: false,
        created_at: new Date().toISOString(),
        stage: lead.stage || 'Tiếp cận',
        estimated_revenue: lead.estimated_revenue || 0,
        lost_reason: lead.lost_reason || null
      };
      allLeads.push(result);
      this.addActivityLog('Thêm mới khách hàng (Local)', `Khách hàng: ${result.name}. Tiến độ: ${result.stage}`);
    }
    localStorage.setItem('vh_leads', JSON.stringify(allLeads));
    return result;
  },

  async deleteLeadLogical(leadId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('leads').update({ is_deleted: true }).eq('id', leadId);
      if (error) throw error;
      this.addActivityLog('Ẩn khách hàng', `Đã chuyển vào thùng rác ID: ${leadId}`);
      return;
    }

    const allLeads: Lead[] = JSON.parse(localStorage.getItem('vh_leads') || '[]');
    const idx = allLeads.findIndex(l => l.id === leadId);
    if (idx !== -1) {
      allLeads[idx].is_deleted = true;
      localStorage.setItem('vh_leads', JSON.stringify(allLeads));
      this.addActivityLog('Ẩn khách hàng (Local)', `Đã ẩn ID: ${leadId}`);
    }
  },

  async deleteLeadPhysical(leadId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('leads').delete().eq('id', leadId);
      if (error) throw error;
      return;
    }

    const allLeads: Lead[] = JSON.parse(localStorage.getItem('vh_leads') || '[]');
    const filtered = allLeads.filter(l => l.id !== leadId);
    localStorage.setItem('vh_leads', JSON.stringify(filtered));
  },

  // --- TASKS SERVICES ---
  async getTasks(): Promise<Task[]> {
    const currentUser = getLoggedInUser();
    if (!currentUser) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('tasks').select('*');
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching tasks from Supabase:', err);
      }
    }

    const allTasks: Task[] = JSON.parse(localStorage.getItem('vh_tasks') || '[]');
    if (currentUser.role === 'Admin') {
      return allTasks;
    } else if (currentUser.role === 'Manager') {
      return allTasks;
    } else {
      return allTasks.filter(t => t.assigned_to === currentUser.id);
    }
  },

  async saveTask(task: Partial<Task>): Promise<Task> {
    const currentUser = getLoggedInUser();
    if (!currentUser) throw new Error('Chưa đăng nhập');

    if (isSupabaseConfigured()) {
      try {
        const isNew = !task.id;
        const payload = {
          title: task.title,
          description: task.description,
          lead_id: task.lead_id || null,
          assigned_to: task.assigned_to || currentUser.id,
          priority: task.priority || 'Medium',
          status: task.status || 'Chưa hoàn thành',
          deadline: task.deadline,
        };

        if (isNew) {
          const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabase.from('tasks').update(payload).eq('id', task.id).select().single();
          if (error) throw error;
          return data;
        }
      } catch (err) {
        console.error('Error saving task to Supabase:', err);
        throw err;
      }
    }

    // LocalStorage fallback
    const allTasks: Task[] = JSON.parse(localStorage.getItem('vh_tasks') || '[]');
    let result: Task;
    if (task.id) {
      const idx = allTasks.findIndex(t => t.id === task.id);
      if (idx === -1) throw new Error('Không tìm thấy đầu việc');
      result = {
        ...allTasks[idx],
        ...task,
      } as Task;
      allTasks[idx] = result;
    } else {
      result = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        title: task.title || '',
        description: task.description || '',
        lead_id: task.lead_id || null,
        assigned_to: task.assigned_to || currentUser.id,
        priority: task.priority || 'Medium',
        status: task.status || 'Chưa hoàn thành',
        deadline: task.deadline || new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      allTasks.push(result);
    }
    localStorage.setItem('vh_tasks', JSON.stringify(allTasks));
    return result;
  },

  async deleteTask(taskId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return;
    }

    const allTasks: Task[] = JSON.parse(localStorage.getItem('vh_tasks') || '[]');
    const filtered = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem('vh_tasks', JSON.stringify(filtered));
  },

  // --- INVOICES / PAYMENTS SERVICES ---
  async getInvoices(): Promise<Invoice[]> {
    const currentUser = getLoggedInUser();
    if (!currentUser) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('subscriptions').select('*');
        if (error) throw error;
        return (data || []).map((i: any) => ({
          id: i.id,
          invoice_code: i.invoice_code,
          lead_id: i.lead_id,
          amount: Number(i.amount),
          payment_method: i.payment_method,
          status: i.status,
          paid_at: i.paid_at,
          created_at: i.created_at,
        }));
      } catch (err) {
        console.error('Error fetching invoices from Supabase:', err);
      }
    }

    // Fallback Mock RLS Filtering
    const allInvoices: Invoice[] = JSON.parse(localStorage.getItem('vh_invoices') || '[]');
    const leads = await this.getLeads(); // get leads user is allowed to see
    const allowedLeadIds = new Set(leads.map(l => l.id));

    return allInvoices.filter(inv => allowedLeadIds.has(inv.lead_id));
  },

  async saveInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    if (isSupabaseConfigured()) {
      try {
        const isNew = !invoice.id;
        const payload = {
          invoice_code: invoice.invoice_code,
          lead_id: invoice.lead_id,
          amount: invoice.amount,
          payment_method: invoice.payment_method,
          status: invoice.status,
          paid_at: invoice.status === 'Đã thanh toán' ? new Date().toISOString() : invoice.paid_at,
        };

        let result;
        if (isNew) {
          const { data, error } = await supabase.from('subscriptions').insert([payload]).select().single();
          if (error) throw error;
          result = data;
        } else {
          const { data, error } = await supabase.from('subscriptions').update(payload).eq('id', invoice.id).select().single();
          if (error) throw error;
          result = data;
        }
        return {
          ...result,
          amount: Number(result.amount)
        };
      } catch (err) {
        console.error('Error saving invoice to Supabase:', err);
        throw err;
      }
    }

    const allInvoices: Invoice[] = JSON.parse(localStorage.getItem('vh_invoices') || '[]');
    let result: Invoice;
    if (invoice.id) {
      const idx = allInvoices.findIndex(i => i.id === invoice.id);
      if (idx === -1) throw new Error('Không tìm thấy hóa đơn');
      result = {
        ...allInvoices[idx],
        ...invoice,
        paid_at: invoice.status === 'Đã thanh toán' ? new Date().toISOString() : invoice.paid_at,
      } as Invoice;
      allInvoices[idx] = result;
    } else {
      result = {
        id: 'i_' + Math.random().toString(36).substr(2, 9),
        invoice_code: invoice.invoice_code || 'HD-' + Math.floor(100 + Math.random() * 900),
        lead_id: invoice.lead_id || '',
        amount: invoice.amount || 0,
        payment_method: invoice.payment_method || 'Chuyển khoản',
        status: invoice.status || 'Chờ thanh toán',
        paid_at: invoice.status === 'Đã thanh toán' ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      };
      allInvoices.push(result);
    }
    localStorage.setItem('vh_invoices', JSON.stringify(allInvoices));
    return result;
  },

  // --- STAFF PROFILES SERVICES (ADMIN ONLY) ---
  async getProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching profiles from Supabase:', err);
      }
    }
    return JSON.parse(localStorage.getItem('vh_profiles') || '[]');
  },

  async updateProfileRole(profileId: string, role: UserRole, fullName?: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const payload: any = { role };
      if (fullName) payload.full_name = fullName;
      const { error } = await supabase.from('profiles').update(payload).eq('id', profileId);
      if (error) throw error;
      return;
    }

    const profiles: Profile[] = JSON.parse(localStorage.getItem('vh_profiles') || '[]');
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      profiles[idx].role = role;
      if (fullName) profiles[idx].full_name = fullName;
      localStorage.setItem('vh_profiles', JSON.stringify(profiles));
    }
  },

  // --- ACTIVITY LOGS SERVICES ---
  async getActivityLogs(): Promise<ActivityLog[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching logs from Supabase:', err);
      }
    }
    return JSON.parse(localStorage.getItem('vh_logs') || '[]');
  },

  async addActivityLog(action: string, details: string): Promise<void> {
    const currentUser = getLoggedInUser();
    const userId = currentUser ? currentUser.id : 'system';

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('activity_logs').insert([{
          user_id: userId === 'system' ? null : userId,
          action,
          details
        }]);
        return;
      } catch (err) {
        console.warn('Could not add activity log to Supabase:', err);
      }
    }

    const logs: ActivityLog[] = JSON.parse(localStorage.getItem('vh_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      action,
      details,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('vh_logs', JSON.stringify(logs.slice(0, 50))); // Keep last 50 logs
  }
};
