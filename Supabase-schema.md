Dưới đây là thiết kế nền tảng cơ sở dữ liệu và cơ chế bảo mật trên **Supabase (PostgreSQL)** dành cho hệ thống CRM Sữa Vĩnh Hưng, bám sát các yêu cầu từ PRD và Design Brief của doanh nghiệp.

## **1\. Kiến trúc Xác thực & Cơ chế Chống Trùng tài khoản (Identity Linking)**

Supabase Auth (sử dụng thư viện GoTrue) mặc định hỗ trợ cơ chế tự động liên kết danh tính (**Automatic Identity Linking**) dựa trên địa chỉ Email nếu cấu hình SaaS / Provider Email Verification được bật (bắt buộc Email phải được xác minh).

### **1.1. Flow xử lý của các kịch bản Xác thực**

#### **Kịch bản 1: Đăng ký & Đăng nhập bằng Email \+ Mật khẩu**

1. Người dùng điền Email và Mật khẩu $\\rightarrow$ Gọi API supabase.auth.signUp().  
2. Supabase Auth tạo một bản ghi tạm trong schema auth.users với trạng thái chưa xác minh (email\_confirmed\_at IS NULL) và gửi một mã JWT/Link xác nhận về Email của nhân viên.  
3. Nhân viên click Link xác nhận $\\rightarrow$ Trường email\_confirmed\_at được cập nhật timestamp $\\rightarrow$ Kích hoạt Trigger tạo hồ sơ tự động tại bảng public.profiles.  
4. Các lần đăng nhập sau: Gọi API supabase.auth.signInWithPassword().

#### **Kịch bản 2: Đăng nhập bằng Google OAuth**

1. Người dùng bấm nút "Đăng nhập bằng tài khoản Google" $\\rightarrow$ Gọi API supabase.auth.signInWithOAuth({ provider: 'google' }).  
2. Người dùng xác thực thành công trên giao diện Google. Google trả về thông tin Profile bao gồm email và email\_verified: true.  
3. Supabase Auth tiếp nhận và xử lý ngầm tại kho lưu trữ (auth.users & auth.identities):  
   * **Nếu Email này CHƯA từng tồn tại:** Hệ thống tạo user\_id mới $\\rightarrow$ Kích hoạt Trigger tạo public.profiles.  
   * **Nếu Email này ĐÃ tồn tại (do đã đăng ký Email/Password trước đó):** Supabase tự động tạo thêm một bản ghi liên kết vào bảng auth.identities dưới cùng một user\_id cũ. Không sinh ra tài khoản mới. Trạng thái Role, quyền truy cập bám theo user\_id cũ giữ nguyên vẹn.

#### **Kịch bản 3: Quên mật khẩu & Đặt lại mật khẩu**

1. Nhân viên bấm "Quên mật khẩu" $\\rightarrow$ Gọi API supabase.auth.resetPasswordForEmail().  
2. Hệ thống gửi link khôi phục bảo mật về Email.  
3. Nhân viên click link và được điều hướng về trang cấu hình mật khẩu mới trên CRM $\\rightarrow$ Gọi API supabase.auth.updateUser({ password: new\_password }) để cập nhật dữ liệu.

## **2\. SQL Schema & Thiết lập Cấu trúc Bảng dữ liệu**

Đoạn mã SQL dưới đây thiết lập toàn bộ cấu trúc bảng, các ràng buộc dữ liệu ngành sữa (Phân khúc khách hàng, Loại sữa quan tâm, Trạng thái hóa đơn) nằm trong schema public.

SQL  
\-- KÍCH HOẠT EXTENSION PHỤC VỤ TÌM KIẾM HOẶC UUID (NẾU CẦN)  
create extension if not exists "uuid-ossp";

\-- 1\. BẢNG NHÓM / ĐỘI NGŨ KINH DOANH (TEAMS)  
create table public.teams (  
    id uuid default gen\_random\_uuid() primary key,  
    name varchar(255) not null, \-- Ví dụ: "Đội Kinh doanh Miền Bắc", "Nhóm Học đường & Siêu thị"  
    description text,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- TẠO CHẠY TRƯỚC ENUM CHO CÁC PHÂN LOẠI QUYỀN VÀ TRẠNG THÁI NGÀNH SỮA  
create type user\_role as enum ('Sales', 'Manager', 'Admin');  
create type customer\_group as enum ('Khách lẻ', 'Đại lý', 'VIP');  
create type milk\_type as enum ('Sữa tươi', 'Sữa chua', 'Sữa bột');  
create type task\_priority as enum ('Low', 'Medium', 'High');  
create type task\_status as enum ('Chưa hoàn thành', 'Đang làm', 'Đã hoàn thành');  
create type pipeline\_stage\_enum as enum ('Tiếp cận', 'Tư vấn mẫu thử', 'Đàm phán', 'Thành công', 'Thất bại');  
create type invoice\_status as enum ('Chờ thanh toán', 'Đã thanh toán một phần', 'Đã thanh toán', 'Quá hạn');

\-- 2\. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES) \- Liên kết 1:1 với auth.users  
create table public.profiles (  
    id uuid references auth.users on delete cascade primary key,  
    email varchar(255) unique not null,  
    full\_name varchar(255),  
    role user\_role default 'Sales'::user\_role not null,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 3\. BẢNG THÀNH VIÊN NHÓM (TEAM\_MEMBERS)  
create table public.team\_members (  
    id uuid default gen\_random\_uuid() primary key,  
    team\_id uuid references public.teams(id) on delete cascade not null,  
    user\_id uuid references public.profiles(id) on delete cascade unique not null, \-- Mỗi người chỉ thuộc 1 đội  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 4\. BẢNG DANH SÁCH BỘ LỌC KHÁCH HÀNG (LEAD\_LISTS)  
create table public.lead\_lists (  
    id uuid default gen\_random\_uuid() primary key,  
    name varchar(255) not null, \-- Ví dụ: "Hệ thống Đại lý phân phối miền Bắc"  
    description text,  
    created\_by uuid references public.profiles(id) on delete set null,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 5\. BẢNG DANH SÁCH KHÁCH HÀNG (LEADS)  
create table public.leads (  
    id uuid default gen\_random\_uuid() primary key,  
    name varchar(255) not null, \-- Tên Đại lý / Công ty thật  
    contact\_name varchar(255), \-- Người liên hệ trực tiếp  
    phone varchar(50),  
    address text,  
    group\_type customer\_group not null default 'Khách lẻ'::customer\_group,  
    milk\_interests milk\_type\[\] not null default '{}'::milk\_type\[\], \-- Cho phép lưu nhiều loại sữa bằng mảng array  
    assigned\_to uuid references public.profiles(id) on delete set null, \-- Nhân viên phụ trách phụ trách  
    lead\_list\_id uuid references public.lead\_lists(id) on delete set null,  
    is\_deleted boolean default false not null, \-- Ẩn dữ liệu thay vì xóa vật lý theo yêu cầu PRD  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 6\. BẢNG TIẾN ĐỘ BÁN HÀNG / CƠ HỘI BÁN HÀNG (PIPELINE\_STAGES)  
create table public.pipeline\_stages (  
    id uuid default gen\_random\_uuid() primary key,  
    lead\_id uuid references public.leads(id) on delete cascade not null,  
    deal\_name varchar(255) not null, \-- Tên đợt bán hàng  
    stage pipeline\_stage\_enum default 'Tiếp cận'::pipeline\_stage\_enum not null,  
    estimated\_revenue numeric(15, 2) default 0.00 not null, \-- Số tiền dự kiến (VND)  
    lost\_reason text, \-- Bắt buộc điền ở FE/BE khi stage \= 'Thất bại'  
    updated\_at timestamp with time zone default timezone('utc'::text, now()) not null,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 7\. BẢNG ĐẦU VIỆC CHĂM SÓC (TASKS)  
create table public.tasks (  
    id uuid default gen\_random\_uuid() primary key,  
    title varchar(255) not null, \-- Tên đầu việc cụ thể  
    description text,  
    lead\_id uuid references public.leads(id) on delete cascade,  
    assigned\_to uuid references public.profiles(id) on delete cascade not null,  
    priority task\_priority default 'Medium'::task\_priority not null,  
    status task\_status default 'Chưa hoàn thành'::task\_status not null,  
    deadline timestamp with time zone not null,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 8\. BẢNG THANH TOÁN VÀ HÓA ĐƠN (SUBSCRIPTIONS / INVOICES)  
create table public.subscriptions (  
    id uuid default gen\_random\_uuid() primary key,  
    invoice\_code varchar(100) unique not null, \-- Mã số hóa đơn xuất kho riêng biệt  
    lead\_id uuid references public.leads(id) on delete cascade not null, \-- Khách hàng thanh toán  
    amount numeric(15, 2) not null, \-- Tổng số tiền bằng VND  
    payment\_method varchar(50), \-- Chuyển khoản hoặc Tiền mặt  
    status invoice\_status default 'Chờ thanh toán'::invoice\_status not null,  
    paid\_at timestamp with time zone, \-- Ngày trả tiền thực tế  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- 9\. BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITY\_LOGS)  
create table public.activity\_logs (  
    id uuid default gen\_random\_uuid() primary key,  
    user\_id uuid references public.profiles(id) on delete set null,  
    action varchar(255) not null, \-- Hành động (Ví dụ: "Kéo thẻ sang Đàm phán")  
    details text,  
    created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

## **3\. Tạo Trigger Tự Động Thiết Lập Hồ Sơ (Profiles)**

Hàm và Trigger dưới đây có nhiệm vụ lắng nghe sự kiện từ auth.users ngay khi user đăng ký thành công hoặc đăng nhập lần đầu qua Google OAuth để tự động khởi tạo bản ghi bên public.profiles.

SQL  
create or replace function public.handle\_new\_user()  
returns trigger as $$  
begin  
  insert into public.profiles (id, email, full\_name, role)  
  values (  
    new.id,  
    new.email,  
    coalesce(new.raw\_user\_meta\_data\-\>\>'full\_name', new.raw\_user\_meta\_data\-\>\>'name', 'Nhân viên Sữa Vĩnh Hưng'),  
    'Sales'::user\_role \-- Quyền mặc định ban đầu là Sales theo đúng PRD quy định  
  )  
  on conflict (id) do nothing;  
  return new;  
end;  
$$ language plpgsql security definer;

\-- Đăng ký trigger chạy sau khi chèn dữ liệu vào bảng auth.users  
create trigger on\_auth\_user\_created  
  after insert on auth.users  
  for each row execute procedure public.handle\_new\_user();

## **4\. Cơ chế Phân quyền 3 lớp bằng Row Level Security (RLS)**

Để triển khai được quy tắc: **Sales chỉ xem được của mình, Manager xem của cả nhóm, Admin xem toàn bộ**, ta cần xây dựng các hàm helper tối ưu hóa hiệu năng kiểm tra trước khi viết Policy.

### **4.1. Bật tính năng RLS trên toàn bộ các bảng nghiệp vụ kinh doanh**

SQL  
alter table public.profiles enable row level security;  
alter table public.teams enable row level security;  
alter table public.team\_members enable row level security;  
alter table public.lead\_lists enable row level security;  
alter table public.leads enable row level security;  
alter table public.pipeline\_stages enable row level security;  
alter table public.tasks enable row level security;  
alter table public.subscriptions enable row level security;  
alter table public.activity\_logs enable row level security;

### **4.2. Các hàm Helper kiểm tra quyền hạn (Security Definer Functions)**

SQL  
\-- Hàm lấy Role hiện tại của người dùng đang đăng nhập  
create or replace function public.get\_current\_user\_role()  
returns user\_role as $$  
  select role from public.profiles where id \= auth.uid();  
$$ language sql security definer;

\-- Hàm lấy danh sách user\_id thuộc cùng một team với người dùng hiện tại (Dành cho Manager)  
create or replace function public.get\_my\_team\_member\_ids()  
returns table(member\_id uuid) as $$  
begin  
  return query   
  select user\_id from public.team\_members  
  where team\_id in (select team\_id from public.team\_members where user\_id \= auth.uid());  
end;  
$$ language plpgsql security definer;

### **4.3. Định nghĩa hệ thống RLS Policies chi tiết cho từng bảng**

#### **Bảng 1: PROFILES**

* *Admin:* Có toàn quyền quản lý, cập nhật phân vai chức vụ.  
* *Mọi người dùng:* Được tự xem thông tin hồ sơ cá nhân của mình.

SQL  
create policy "Cho phép người dùng tự xem hồ sơ cá nhân"   
on public.profiles for select using (auth.uid() \= id);

create policy "Admin có quyền tối cao với bảng profiles"   
on public.profiles for all using (public.get\_current\_user\_role() \= 'Admin'::user\_role);

#### **Bảng 2: LEADS (Danh sách khách hàng)**

* *Sales:* Xem/Sửa dữ liệu do chính mình phụ trách (assigned\_to \= auth.uid()). Không được quyền Xóa hồ sơ (kể cả xóa logic is\_deleted), không được xuất file (Xử lý chặn xuất file tại giao diện Client bằng cách ẩn nút export dựa trên role).  
* *Manager:* Xem/Sửa dữ liệu của các nhân viên thuộc nhóm mình quản lý. Không được xóa vật lý.  
* *Admin:* Toàn quyền thao tác trên mọi dòng dữ liệu.

SQL  
create policy "Quyền SELECT bảng Leads dựa trên phân tầng trách nhiệm"  
on public.leads for select using (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or (public.get\_current\_user\_role() \= 'Manager'::user\_role and assigned\_to in (select public.get\_my\_team\_member\_ids()))  
    or (assigned\_to \= auth.uid() and is\_deleted \= false)  
);

create policy "Quyền INSERT bảng Leads"  
on public.leads for insert with check (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or public.get\_current\_user\_role() \= 'Manager'::user\_role  
    or assigned\_to \= auth.uid()  
);

create policy "Quyền UPDATE bảng Leads"  
on public.leads for update using (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or (public.get\_current\_user\_role() \= 'Manager'::user\_role and assigned\_to in (select public.get\_my\_team\_member\_ids()))  
    or (assigned\_to \= auth.uid() and is\_deleted \= false)  
) with check (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or (public.get\_current\_user\_role() \= 'Manager'::user\_role and assigned\_to in (select public.get\_my\_team\_member\_ids()))  
    or (assigned\_to \= auth.uid())  
);

create policy "Chỉ Admin mới có quyền xóa vật lý dòng dữ liệu khách hàng"  
on public.leads for delete using (public.get\_current\_user\_role() \= 'Admin'::user\_role);

#### **Bảng 3: PIPELINE\_STAGES (Cơ hội bán hàng)**

Dữ liệu cơ hội gắn liền với quyền tiếp cận của khách hàng tại bảng public.leads.

SQL  
create policy "Xem cơ hội bán hàng nếu có quyền xem khách hàng liên quan"  
on public.pipeline\_stages for select using (  
    exists (select 1 from public.leads where id \= pipeline\_stages.lead\_id)  
);

create policy "Thêm cơ hội bán hàng"  
on public.pipeline\_stages for insert with check (  
    exists (select 1 from public.leads where id \= pipeline\_stages.lead\_id)  
);

create policy "Cập nhật cơ hội bán hàng"  
on public.pipeline\_stages for update using (  
    exists (select 1 from public.leads where id \= pipeline\_stages.lead\_id)  
);

create policy "Chỉ cho phép Admin xóa cơ hội bán hàng"  
on public.pipeline\_stages for delete using (public.get\_current\_user\_role() \= 'Admin'::user\_role);

#### **Bảng 4: TASKS (Đầu việc)**

* *Sales:* Xem và xử lý đầu việc được giao.  
* *Manager / Admin:* Kiểm soát tình hình phân bổ nhiệm vụ chăm sóc đại lý sữa.

SQL  
create policy "Quyền xem danh sách công việc"  
on public.tasks for select using (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or (public.get\_current\_user\_role() \= 'Manager'::user\_role and assigned\_to in (select public.get\_my\_team\_member\_ids()))  
    or assigned\_to \= auth.uid()  
);

create policy "Quyền thêm mới công việc"  
on public.tasks for insert with check (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or public.get\_current\_user\_role() \= 'Manager'::user\_role  
    or assigned\_to \= auth.uid()  
);

create policy "Quyền chỉnh sửa trạng thái/nội dung công việc"  
on public.tasks for update using (  
    public.get\_current\_user\_role() \= 'Admin'::user\_role  
    or (public.get\_current\_user\_role() \= 'Manager'::user\_role and assigned\_to in (select public.get\_my\_team\_member\_ids()))  
    or assigned\_to \= auth.uid()  
);

#### **Bảng 5: SUBSCRIPTIONS (Thanh toán & Hóa đơn tiền sữa)**

SQL  
create policy "Quyền xem hóa đơn công nợ"  
on public.subscriptions for select using (  
    exists (select 1 from public.leads where id \= subscriptions.lead\_id)  
);

create policy "Chỉ Admin và Kế toán cấp quản lý được xử lý hóa đơn"  
on public.subscriptions for all using (  
    public.get\_current\_user\_role() in ('Admin'::user\_role, 'Manager'::user\_role)  
);

## **5\. Hệ thống Biểu chỉ mục (Indexes) Tối ưu hóa Truy vấn**

Để hệ thống đáp ứng tiêu chí vận hành: **Thời gian phản hồi và xử lý dưới 2 giây**, các chỉ mục chỉ định dưới đây được tạo ra nhằm tối ưu hóa các câu lệnh lọc danh sách, kéo thả bảng Kanban và kết nối bảng dữ liệu lớn.

SQL  
\-- Chỉ mục tìm kiếm nhanh khách hàng được phân phối cho nhân viên kinh doanh cụ thể  
create index idx\_leads\_assigned\_to on public.leads(assigned\_to) where is\_deleted \= false;

\-- Chỉ mục hỗ trợ gom bộ lọc thông minh theo danh sách khu vực và phân khúc đại lý  
create index idx\_leads\_list\_group on public.leads(lead\_list\_id, group\_type);

\-- Chỉ mục tối ưu hóa tốc độ kéo thả thẻ và cập nhật số liệu biểu đồ tổng quan trên Kanban Pipeline  
create index idx\_pipeline\_stage on public.pipeline\_stages(stage, lead\_id);

\-- Chỉ mục phục vụ thông báo danh sách việc làm cần xử lý khẩn cấp theo Deadline của từng nhân viên  
create index idx\_tasks\_assignment\_deadline on public.tasks(assigned\_to, status, deadline);

\-- Chỉ mục rà soát công nợ, hóa đơn quá hạn phục vụ bộ phận kế toán điều phối hàng  
create index idx\_subscriptions\_status on public.subscriptions(status);

## **6\. Kho Dữ liệu Mẫu Chuẩn hóa (Seed Data)**

Nội dung dữ liệu mẫu được chuẩn hóa bằng Tiếng Việt, sử dụng chính xác các tổ chức, đại lý giả định và thời hạn xử lý thuộc bối cảnh vận hành của Công ty Sữa Vĩnh Hưng để phục vụ bước dựng Mockup UI/UX.

SQL  
\-- 1\. CHÈN DỮ LIỆU TÀI KHOẢN MẪU ĐỂ GIẢ LẬP HỆ THỐNG (YÊU CẦU CÓ USER THẬT TẠI AUTH.USERS KHI CHẠY THỰC TẾ)  
\-- Khởi tạo 3 user giả định tương ứng với 3 ID cố định để test mối quan hệ dữ liệu  
insert into auth.users (id, email, email\_confirmed\_at) values   
('a1111111-1111-1111-1111-111111111111', 'admin@vinhhungmilk.vn', now()),  
('m2222222-2222-2222-2222-222222222222', 'manager\_mienbac@vinhhungmilk.vn', now()),  
('s3333333-3333-3333-3333-333333333333', 'sales\_haiphong@vinhhungmilk.vn', now())  
on conflict do nothing;

\-- Cập nhật Role chính xác cho các Profile mẫu (Trigger tự động chèn mặc định là Sales trước đó)  
update public.profiles set role \= 'Admin'::user\_role, full\_name \= 'Ban Giám Đốc Vĩnh Hưng' where id \= 'a1111111-1111-1111-1111-111111111111';  
update public.profiles set role \= 'Manager'::user\_role, full\_name \= 'Trần Minh Hải (Trưởng nhóm MB)' where id \= 'm2222222-2222-2222-2222-222222222222';  
update public.profiles set role \= 'Sales'::user\_role, full\_name \= 'Nguyễn Văn Đạt (Kinh doanh)' where id \= 's3333333-3333-3333-3333-333333333333';

\-- 2\. CHÈN DỮ LIỆU ĐỘI NGŨ KINH DOANH (TEAMS)  
insert into public.teams (id, name, description) values  
('t1000000-0000-0000-0000-000000000000', 'Hệ thống Đại lý phân phối miền Bắc', 'Quản lý phân phối các đại lý bán sỉ dòng sản phẩm sữa tại khu vực phía Bắc.');

\-- Gắn nhân viên vào nhóm  
insert into public.team\_members (team\_id, user\_id) values  
('t1000000-0000-0000-0000-000000000000', 'm2222222-2222-2222-2222-222222222222'),  
('t1000000-0000-0000-0000-000000000000', 's3333333-3333-3333-3333-333333333333')  
on conflict do nothing;

\-- 3\. CHÈN DANH SÁCH BỘ LỌC KHÁCH HÀNG (LEAD\_LISTS)  
insert into public.lead\_lists (id, name, description) values  
('l1000000-0000-0000-0000-000000000001', 'Hệ thống Đại lý phân phối miền Bắc', 'Tập hợp các cửa hàng tạp hóa, đại lý bán sỉ khu vực phía Bắc'),  
('l2000000-0000-0000-0000-000000000002', 'Đối tác VIP Học đường và Siêu thị', 'Tài khoản tổ chức lớn, trường học nhập sữa tươi định kỳ hàng tháng'),  
('l3000000-0000-0000-0000-000000000003', 'Khách mua lẻ trực tiếp kênh trải nghiệm', 'Người tiêu dùng nhỏ lẻ đăng ký giao sữa tại nhà');

\-- 4\. CHÈN DỮ LIỆU MẪU 6 KHÁCH HÀNG TIỀN NĂNG (LEADS)  
insert into public.leads (id, name, contact\_name, phone, address, group\_type, milk\_interests, assigned\_to, lead\_list\_id) values  
('c1000000-0000-0000-0000-000000000001', 'Chuỗi siêu thị Co.opmart Nguyễn Đình Chiểu', 'Bà Nguyễn Thục Anh', '0901234567', 'Số 168 Nguyễn Đình Chiểu, Quận 3, TP. HCM', 'VIP', '{"Sữa tươi", "Sữa chua"}', 'm2222222-2222-2222-2222-222222222222', 'l2000000-0000-0000-0000-000000000002'),  
('c2000000-0000-0000-0000-000000000002', 'Công ty Cổ phần Thực phẩm và Nước giải khát Green Foods', 'Ông Phạm Minh Tuấn', '0912345678', 'KCN Tân Bình, Quận Tân Phú, TP. HCM', 'VIP', '{"Sữa bột"}', 's3333333-3333-3333-3333-333333333333', 'l2000000-0000-0000-0000-000000000002'),  
('c3000000-0000-0000-0000-000000000003', 'Đại lý Sữa và Bỉm Mai Linh (Hà Nội)', 'Bà Lê Thị Mai', '0923456789', 'Số 45 Cầu Giấy, Quận Cầu Giấy, Hà Nội', 'Đại lý', '{"Sữa tươi", "Sữa bột"}', 's3333333-3333-3333-3333-333333333333', 'l1000000-0000-0000-0000-000000000001'),  
('c4000000-0000-0000-0000-000000000004', 'Nhà phân phối Tiêu dùng nhanh Nam Phát (Hải Phòng)', 'Ông Hoàng Văn Nam', '0934567890', 'Số 12 Lê Hồng Phong, Ngô Quyền, Hải Phòng', 'Đại lý', '{"Sữa chua"}', 's3333333-3333-3333-3333-333333333333', 'l1000000-0000-0000-0000-000000000001'),  
('c5000000-0000-0000-0000-000000000005', 'Trường Mầm non Tư thục Bình Minh Montessori', 'Bà Vũ Thu Hương', '0945678901', 'KĐT Trung Hòa \- Nhân Chính, Thanh Xuân, Hà Nội', 'VIP', '{"Sữa tươi"}', 's3333333-3333-3333-3333-333333333333', 'l2000000-0000-0000-0000-000000000002'),  
('c6000000-0000-0000-0000-000000000006', 'Cửa hàng Tạp hóa bình ổn Thanh Hải (Quận 7)', 'Ông Trần Thanh Hải', '0956789012', 'Số 789 Huỳnh Tấn Phát, Quận 7, TP. HCM', 'Khách lẻ', '{"Sữa tươi", "Sữa chua"}', 's3333333-3333-3333-3333-333333333333', 'l3000000-0000-0000-0000-000000000003');

\-- 5\. CHÈN TRẠNG THÁI TIẾN ĐỘ KANBAN TƯƠNG ỨNG CHO 6 KHÁCH HÀNG  
insert into public.pipeline\_stages (lead\_id, deal\_name, stage, estimated\_revenue, lost\_reason) values  
('c1000000-0000-0000-0000-000000000001', 'Cung cấp Sữa tươi & Sữa chua Quý 3', 'Đàm phán', 120000000, null),  
('c2000000-0000-0000-0000-000000000002', 'Đơn hàng Sữa bột nguyên kem xuất khẩu', 'Tiếp cận', 350000000, null),  
('c3000000-0000-0000-0000-000000000003', 'Hợp đồng thử nghiệm đại lý mới', 'Tư vấn mẫu thử', 450000000, null),  
('c4000000-0000-0000-0000-000000000004', 'Phân phối Sữa chua uống độc quyền', 'Đàm phán', 650000000, null),  
('c5000000-0000-0000-0000-000000000005', 'Cung ứng sữa tươi học đường năm 2026', 'Thành công', 850000000, null),  
('c6000000-0000-0000-0000-000000000006', 'Đơn đặt hàng sữa Tết gia đình', 'Thất bại', 12000000, 'Chê giá cao và chính sách vận chuyển chưa phù hợp');

\-- 6\. CHÈN DỮ LIỆU MẪU 5 CÔNG VIỆC THỰC TẾ (TASKS)  
insert into public.tasks (title, description, lead\_id, assigned\_to, priority, status, deadline) values  
('Chuyển giao 3 thùng sữa chua mẫu vị dâu mới', 'Mang qua trực tiếp cho đại lý kiểm tra hương vị và phản hồi.', 'c3000000-0000-0000-0000-000000000003', 's3333333-3333-3333-3333-333333333333', 'High', 'Chưa hoàn thành', date\_trunc('day', now()) \+ interval '17 hours'),  
('Gọi điện thương thảo lại tỷ lệ chiết khấu', 'Thảo luận đơn hàng sữa tươi học đường cho mầm non Bình Minh.', 'c5000000-0000-0000-0000-000000000005', 's3333333-3333-3333-3333-333333333333', 'High', 'Chưa hoàn thành', date\_trunc('day', now()) \+ interval '1 day 11 hours 30 minutes'),  
('Kiểm tra thời hạn sử dụng lô sữa bột tồn kho', 'Đến tận kho rà soát hạn sử dụng, lên kế hoạch đổi trả hàng cận date.', 'c4000000-0000-0000-0000-000000000004', 's3333333-3333-3333-3333-333333333333', 'Medium', 'Đang làm', date\_trunc('day', now()) \+ interval '2 days 16 hours'),  
('Gửi email bảng báo giá chi tiết sữa bột', 'Báo giá dòng sản phẩm sữa bột nguyên kem cho đối tác Green Foods.', 'c2000000-0000-0000-0000-000000000002', 's3333333-3333-3333-3333-333333333333', 'Low', 'Chưa hoàn thành', date\_trunc('week', now()) \+ interval '4 days 17 hours'), \-- Thứ sáu tuần này  
('Gặp trực tiếp thu hồi biên bản ký kết hợp đồng', 'Thu hồi biên bản hợp đồng phân phối sữa tươi năm 2026.', 'c1000000-0000-0000-0000-000000000001', 'm2222222-2222-2222-2222-222222222222', 'High', 'Chưa hoàn thành', date\_trunc('week', now()) \+ interval '7 days 10 hours'); \-- Thứ hai tuần sau  
