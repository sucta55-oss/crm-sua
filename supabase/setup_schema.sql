-- KÍCH HOẠT EXTENSION PHỤC VỤ TÌM KIẾM HOẶC UUID (NẾU CẦN)
create extension if not exists "uuid-ossp";

-- 1. BẢNG NHÓM / ĐỘI NGŨ KINH DOANH (TEAMS)
create table if not exists public.teams (
    id uuid default gen_random_uuid() primary key,
    name varchar(255) not null, -- Ví dụ: "Đội Kinh doanh Miền Bắc", "Nhóm Học đường & Siêu thị"
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TẠO CHẠY TRƯỚC ENUM CHO CÁC PHÂN LOẠI QUYỀN VÀ TRẠNG THÁI NGÀNH SỮA
do $$
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type user_role as enum ('Sales', 'Manager', 'Admin');
    end if;
    if not exists (select 1 from pg_type where typname = 'customer_group') then
        create type customer_group as enum ('Khách lẻ', 'Đại lý', 'VIP');
    end if;
    if not exists (select 1 from pg_type where typname = 'milk_type') then
        create type milk_type as enum ('Sữa tươi', 'Sữa chua', 'Sữa bột');
    end if;
    if not exists (select 1 from pg_type where typname = 'task_priority') then
        create type task_priority as enum ('Low', 'Medium', 'High');
    end if;
    if not exists (select 1 from pg_type where typname = 'task_status') then
        create type task_status as enum ('Chưa hoàn thành', 'Đang làm', 'Đã hoàn thành');
    end if;
    if not exists (select 1 from pg_type where typname = 'pipeline_stage_enum') then
        create type pipeline_stage_enum as enum ('Tiếp cận', 'Tư vấn mẫu thử', 'Đàm phán', 'Thành công', 'Thất bại');
    end if;
    if not exists (select 1 from pg_type where typname = 'invoice_status') then
        create type invoice_status as enum ('Chờ thanh toán', 'Đã thanh toán một phần', 'Đã thanh toán', 'Quá hạn');
    end if;
end$$;

-- 2. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES) - Liên kết 1:1 với auth.users
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email varchar(255) unique not null,
    full_name varchar(255),
    role user_role default 'Sales'::user_role not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BẢNG THÀNH VIÊN NHÓM (TEAM_MEMBERS)
create table if not exists public.team_members (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references public.teams(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade unique not null, -- Mỗi người chỉ thuộc 1 đội
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BẢNG DANH SÁCH BỘ LỌC KHÁCH HÀNG (LEAD_LISTS)
create table if not exists public.lead_lists (
    id uuid default gen_random_uuid() primary key,
    name varchar(255) not null, -- Ví dụ: "Hệ thống Đại lý phân phối miền Bắc"
    description text,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BẢNG DANH SÁCH KHÁCH HÀNG (LEADS)
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    name varchar(255) not null, -- Tên Đại lý / Công ty thật
    contact_name varchar(255), -- Người liên hệ trực tiếp
    phone varchar(50),
    address text,
    group_type customer_group not null default 'Khách lẻ'::customer_group,
    milk_interests milk_type[] not null default '{}'::milk_type[], -- Cho phép lưu nhiều loại sữa bằng mảng array
    assigned_to uuid references public.profiles(id) on delete set null, -- Nhân viên phụ trách
    lead_list_id uuid references public.lead_lists(id) on delete set null,
    is_deleted boolean default false not null, -- Ẩn dữ liệu thay vì xóa vật lý theo yêu cầu PRD
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BẢNG TIẾN ĐỘ BÁN HÀNG / CƠ HỘI BÁN HÀNG (PIPELINE_STAGES)
create table if not exists public.pipeline_stages (
    id uuid default gen_random_uuid() primary key,
    lead_id uuid references public.leads(id) on delete cascade not null,
    deal_name varchar(255) not null, -- Tên đợt bán hàng
    stage pipeline_stage_enum default 'Tiếp cận'::pipeline_stage_enum not null,
    estimated_revenue numeric(15, 2) default 0.00 not null, -- Số tiền dự kiến (VND)
    lost_reason text, -- Bắt buộc điền ở FE/BE khi stage = 'Thất bại'
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. BẢNG ĐẦU VIỆC CHĂM SÓC (TASKS)
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    title varchar(255) not null, -- Tên đầu việc cụ thể
    description text,
    lead_id uuid references public.leads(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete cascade not null,
    priority task_priority default 'Medium'::task_priority not null,
    status task_status default 'Chưa hoàn thành'::task_status not null,
    deadline timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. BẢNG THANH TOÁN VÀ HÓA ĐƠN (SUBSCRIPTIONS / INVOICES)
create table if not exists public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    invoice_code varchar(100) unique not null, -- Mã số hóa đơn xuất kho riêng biệt
    lead_id uuid references public.leads(id) on delete cascade not null, -- Khách hàng thanh toán
    amount numeric(15, 2) not null, -- Tổng số tiền bằng VND
    payment_method varchar(50), -- Chuyển khoản hoặc Tiền mặt
    status invoice_status default 'Chờ thanh toán'::invoice_status not null,
    paid_at timestamp with time zone, -- Ngày trả tiền thực tế
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITY_LOGS)
create table if not exists public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    action varchar(255) not null, -- Hành động (Ví dụ: "Kéo thẻ sang Đàm phán")
    details text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tạo Trigger Tự Động Thiết Lập Hồ Sơ (Profiles)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Nhân viên Sữa Vĩnh Hưng'),
    'Sales'::user_role -- Quyền mặc định ban đầu là Sales theo đúng PRD quy định
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

-- Đăng ký trigger chạy sau khi chèn dữ liệu vào bảng auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Cơ chế Phân quyền 3 lớp bằng Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.lead_lists enable row level security;
alter table public.leads enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.tasks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.activity_logs enable row level security;

-- Các hàm Helper kiểm tra quyền hạn (Security Definer Functions)
create or replace function public.get_current_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer;

create or replace function public.get_my_team_member_ids()
returns table(member_id uuid) as $$
begin
  return query 
  select user_id from public.team_members
  where team_id in (select team_id from public.team_members where user_id = auth.uid());
end;
$$ language plpgsql security definer;

-- BẢNG 1: PROFILES
drop policy if exists "Cho phép người dùng tự xem hồ sơ cá nhân" on public.profiles;
create policy "Cho phép người dùng tự xem hồ sơ cá nhân" 
on public.profiles for select using (auth.uid() = id);

drop policy if exists "Admin có quyền tối cao với bảng profiles" on public.profiles;
create policy "Admin có quyền tối cao với bảng profiles" 
on public.profiles for all using (public.get_current_user_role() = 'Admin'::user_role);

drop policy if exists "Manager/Sales được xem profile người cùng team" on public.profiles;
create policy "Manager/Sales được xem profile người cùng team"
on public.profiles for select using (
    id in (select public.get_my_team_member_ids())
);

-- BẢNG 2: LEADS (Danh sách khách hàng)
drop policy if exists "Quyền SELECT bảng Leads dựa trên phân tầng trách nhiệm" on public.leads;
create policy "Quyền SELECT bảng Leads dựa trên phân tầng trách nhiệm"
on public.leads for select using (
    public.get_current_user_role() = 'Admin'::user_role
    or (public.get_current_user_role() = 'Manager'::user_role and (assigned_to in (select public.get_my_team_member_ids()) or assigned_to is null))
    or (assigned_to = auth.uid() and is_deleted = false)
);

drop policy if exists "Quyền INSERT bảng Leads" on public.leads;
create policy "Quyền INSERT bảng Leads"
on public.leads for insert with check (
    public.get_current_user_role() = 'Admin'::user_role
    or public.get_current_user_role() = 'Manager'::user_role
    or assigned_to = auth.uid()
    or assigned_to is null
);

drop policy if exists "Quyền UPDATE bảng Leads" on public.leads;
create policy "Quyền UPDATE bảng Leads"
on public.leads for update using (
    public.get_current_user_role() = 'Admin'::user_role
    or (public.get_current_user_role() = 'Manager'::user_role and (assigned_to in (select public.get_my_team_member_ids()) or assigned_to is null))
    or (assigned_to = auth.uid() and is_deleted = false)
) with check (
    public.get_current_user_role() = 'Admin'::user_role
    or (public.get_current_user_role() = 'Manager'::user_role and (assigned_to in (select public.get_my_team_member_ids()) or assigned_to is null))
    or (assigned_to = auth.uid())
);

drop policy if exists "Chỉ Admin mới có quyền xóa vật lý dòng dữ liệu khách hàng" on public.leads;
create policy "Chỉ Admin mới có quyền xóa vật lý dòng dữ liệu khách hàng"
on public.leads for delete using (public.get_current_user_role() = 'Admin'::user_role);

-- BẢNG 3: PIPELINE_STAGES (Cơ hội bán hàng)
drop policy if exists "Xem cơ hội bán hàng nếu có quyền xem khách hàng liên quan" on public.pipeline_stages;
create policy "Xem cơ hội bán hàng nếu có quyền xem khách hàng liên quan"
on public.pipeline_stages for select using (
    exists (select 1 from public.leads where id = pipeline_stages.lead_id)
);

drop policy if exists "Thêm cơ hội bán hàng" on public.pipeline_stages;
create policy "Thêm cơ hội bán hàng"
on public.pipeline_stages for insert with check (
    exists (select 1 from public.leads where id = pipeline_stages.lead_id)
);

drop policy if exists "Cập nhật cơ hội bán hàng" on public.pipeline_stages;
create policy "Cập nhật cơ hội bán hàng"
on public.pipeline_stages for update using (
    exists (select 1 from public.leads where id = pipeline_stages.lead_id)
);

drop policy if exists "Chỉ cho phép Admin xóa cơ hội bán hàng" on public.pipeline_stages;
create policy "Chỉ cho phép Admin xóa cơ hội bán hàng"
on public.pipeline_stages for delete using (public.get_current_user_role() = 'Admin'::user_role);

-- BẢNG 4: TASKS (Đầu việc)
drop policy if exists "Quyền xem danh sách công việc" on public.tasks;
create policy "Quyền xem danh sách công việc"
on public.tasks for select using (
    public.get_current_user_role() = 'Admin'::user_role
    or (public.get_current_user_role() = 'Manager'::user_role and assigned_to in (select public.get_my_team_member_ids()))
    or assigned_to = auth.uid()
);

drop policy if exists "Quyền thêm mới công việc" on public.tasks;
create policy "Quyền thêm mới công việc"
on public.tasks for insert with check (
    public.get_current_user_role() = 'Admin'::user_role
    or public.get_current_user_role() = 'Manager'::user_role
    or assigned_to = auth.uid()
);

drop policy if exists "Quyền chỉnh sửa trạng thái/nội dung công việc" on public.tasks;
create policy "Quyền chỉnh sửa trạng thái/nội dung công việc"
on public.tasks for update using (
    public.get_current_user_role() = 'Admin'::user_role
    or (public.get_current_user_role() = 'Manager'::user_role and assigned_to in (select public.get_my_team_member_ids()))
    or assigned_to = auth.uid()
);

drop policy if exists "Chỉ Admin và Manager được xóa công việc" on public.tasks;
create policy "Chỉ Admin và Manager được xóa công việc"
on public.tasks for delete using (
    public.get_current_user_role() in ('Admin'::user_role, 'Manager'::user_role)
);

-- BẢNG 5: SUBSCRIPTIONS (Thanh toán & Hóa đơn tiền sữa)
drop policy if exists "Quyền xem hóa đơn công nợ" on public.subscriptions;
create policy "Quyền xem hóa đơn công nợ"
on public.subscriptions for select using (
    exists (select 1 from public.leads where id = subscriptions.lead_id)
);

drop policy if exists "Chỉ Admin và Kế toán cấp quản lý được xử lý hóa đơn" on public.subscriptions;
create policy "Chỉ Admin và Kế toán cấp quản lý được xử lý hóa đơn"
on public.subscriptions for all using (
    public.get_current_user_role() in ('Admin'::user_role, 'Manager'::user_role)
);

-- 5. Hệ thống Biểu chỉ mục (Indexes) Tối ưu hóa Truy vấn
create index if not exists idx_leads_assigned_to on public.leads(assigned_to) where is_deleted = false;
create index if not exists idx_leads_list_group on public.leads(lead_list_id, group_type);
create index if not exists idx_pipeline_stage on public.pipeline_stages(stage, lead_id);
create index if not exists idx_tasks_assignment_deadline on public.tasks(assigned_to, status, deadline);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- 6. Kho Dữ liệu Mẫu Chuẩn hóa (Seed Data)
-- Sẽ được gọi thủ công hoặc tích hợp ở mức ứng dụng khi cần thiết, hoặc tạo trong database nếu chạy ở chế độ dev.
