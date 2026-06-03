import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, Lead, Task } from '../lib/dbService';

import type { TabType } from '../components/AppShell';

interface DashboardProps {
  user: Profile;
  onNavigate: (tab: TabType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user: _user, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    newLeadsCount: 0,
    activeDealsCount: 0,
    pendingDebt: 0,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milkStats, setMilkStats] = useState({ fresh: 0, yogurt: 0, powder: 0 });


  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const fetchedLeads = await dbService.getLeads();
        const fetchedTasks = await dbService.getTasks();
        const fetchedInvoices = await dbService.getInvoices();

        setLeads(fetchedLeads);
        setTasks(fetchedTasks);


        // 1. Calculate Stats
        // Monthly Revenue: Sum of amount for invoices that are "Đã thanh toán"
        const revenue = fetchedInvoices
          .filter(inv => inv.status === 'Đã thanh toán')
          .reduce((sum, inv) => sum + inv.amount, 0);

        // New leads count: created in the last 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const newLeads = fetchedLeads.filter(l => new Date(l.created_at).getTime() > thirtyDaysAgo).length;

        // Active deals count: stage is NOT "Thành công" or "Thất bại"
        const activeDeals = fetchedLeads.filter(l => l.stage !== 'Thành công' && l.stage !== 'Thất bại').length;

        // Pending Debt: Sum of invoices that are "Chờ thanh toán", "Đã thanh toán một phần" (assume 50% paid for mock simplicity), or "Quá hạn"
        const debt = fetchedInvoices
          .filter(inv => inv.status === 'Chờ thanh toán' || inv.status === 'Quá hạn' || inv.status === 'Đã thanh toán một phần')
          .reduce((sum, inv) => {
            if (inv.status === 'Đã thanh toán một phần') {
              return sum + inv.amount * 0.5; // remaining half
            }
            return sum + inv.amount;
          }, 0);

        setStats({
          monthlyRevenue: revenue,
          newLeadsCount: newLeads,
          activeDealsCount: activeDeals,
          pendingDebt: debt,
        });

        // 2. Milk Interests Popularity Stats
        let fresh = 0, yogurt = 0, powder = 0;
        fetchedLeads.forEach(l => {
          if (l.milk_interests.includes('Sữa tươi')) fresh++;
          if (l.milk_interests.includes('Sữa chua')) yogurt++;
          if (l.milk_interests.includes('Sữa bột')) powder++;
        });
        setMilkStats({ fresh, yogurt, powder });

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Get 3 recent completed/uncompleted tasks
  const recentTasks = tasks.slice(0, 3);
  // Get 3 recent added leads
  const recentLeads = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
      </div>
    );
  }

  // Calculate percentages for the milk bar chart
  const totalInterests = milkStats.fresh + milkStats.yogurt + milkStats.powder || 1;
  const freshPercent = Math.max(10, Math.round((milkStats.fresh / totalInterests) * 100));
  const yogurtPercent = Math.max(10, Math.round((milkStats.yogurt / totalInterests) * 100));
  const powderPercent = Math.max(10, Math.round((milkStats.powder / totalInterests) * 100));

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar px-container-padding pb-stack-lg">
      <div className="grid grid-cols-12 gap-gutter mt-stack-md">
        
        {/* KPI Row */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">Doanh thu tháng này</p>
          <h3 className="font-headline-md text-headline-sm text-primary-container truncate font-semibold">
            {formatCurrency(stats.monthlyRevenue)}
          </h3>
          <p className="text-[11px] text-[#1E5E3A] font-bold mt-2 flex items-center">
            <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12.4% so với tháng trước
          </p>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">Đại lý mới (30 ngày)</p>
          <h3 className="font-headline-md text-headline-sm text-primary-container font-semibold">
            {stats.newLeadsCount} Khách hàng
          </h3>
          <p className="text-[11px] text-[#1E5E3A] font-bold mt-2 flex items-center">
            <span className="material-symbols-outlined text-[14px] mr-1">person_add</span> Tăng trưởng ổn định
          </p>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">Cơ hội đang chạy</p>
          <h3 className="font-headline-md text-headline-sm text-primary-container font-semibold">
            {stats.activeDealsCount} Vụ mua bán
          </h3>
          <p className="text-[11px] text-outline font-medium mt-2 flex items-center">
            <span className="material-symbols-outlined text-[14px] mr-1">hourglass_empty</span> Đang trong tiến trình đàm phán
          </p>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">Công nợ cần thu</p>
          <h3 className="font-headline-md text-headline-sm text-error font-semibold truncate">
            {formatCurrency(stats.pendingDebt)}
          </h3>
          <p className="text-[11px] text-error font-bold mt-2 flex items-center">
            <span className="material-symbols-outlined text-[14px] mr-1">warning</span> Cần liên hệ thu hồi sớm
          </p>
        </div>

        {/* Chart Column (Left) & Team Performance (Right) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Cơ cấu loại sữa được quan tâm</h4>
              <span className="text-[12px] text-on-surface-variant">Lượt bình chọn theo khách hàng</span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-4">
              Thống kê lượng khách hàng bày tỏ sự quan tâm đặc biệt đối với từng ngành sữa cốt lõi.
            </p>
          </div>
          
          <div className="h-56 mt-4 flex items-end justify-around space-x-8 px-6 border-b border-outline-variant/30 pb-4">
            {/* Sữa tươi */}
            <div className="flex flex-col items-center w-20 group">
              <div 
                style={{ height: `${freshPercent}%` }}
                className="w-full bg-primary-container/20 border-x-2 border-primary-container rounded-t-lg transition-all duration-500 hover:bg-primary-container/30 relative flex items-end justify-center group-hover:scale-105"
              >
                <span className="absolute -top-7 text-body-md font-bold text-primary-container">{milkStats.fresh}</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface mt-2">Sữa tươi</span>
            </div>

            {/* Sữa chua */}
            <div className="flex flex-col items-center w-20 group">
              <div 
                style={{ height: `${yogurtPercent}%` }}
                className="w-full bg-primary/20 border-x-2 border-primary rounded-t-lg transition-all duration-500 hover:bg-primary/30 relative flex items-end justify-center group-hover:scale-105"
              >
                <span className="absolute -top-7 text-body-md font-bold text-primary">{milkStats.yogurt}</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface mt-2">Sữa chua</span>
            </div>

            {/* Sữa bột */}
            <div className="flex flex-col items-center w-20 group">
              <div 
                style={{ height: `${powderPercent}%` }}
                className="w-full bg-secondary/20 border-x-2 border-secondary rounded-t-lg transition-all duration-500 hover:bg-secondary/30 relative flex items-end justify-center group-hover:scale-105"
              >
                <span className="absolute -top-7 text-body-md font-bold text-secondary">{milkStats.powder}</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface mt-2">Sữa bột</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-[12px] text-on-surface-variant">Tổng số khách khảo sát: {leads.length}</span>
            <button 
              onClick={() => onNavigate('customers')}
              className="text-primary font-label-md text-label-md hover:underline flex items-center"
            >
              Xem chi tiết khách hàng <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Team Performance Column (Right) */}
        <div className="col-span-12 lg:col-span-4 bg-warm-milk/50 border border-outline-variant p-stack-lg rounded-xl flex flex-col justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">Kế hoạch chỉ tiêu doanh số</p>
            <div className="space-y-stack-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-[12px]">TH</div>
                  <span className="font-body-md text-body-md">Trần Minh Hải (Manager)</span>
                </div>
                <span className="font-bold text-primary">92%</span>
              </div>
              <div className="w-full bg-outline-variant/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-[92%]"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[12px]">NĐ</div>
                  <span className="font-body-md text-body-md">Nguyễn Văn Đạt (Sales)</span>
                </div>
                <span className="font-bold text-primary">85%</span>
              </div>
              <div className="w-full bg-outline-variant/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-[85%]"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-[12px]">TA</div>
                  <span className="font-body-md text-body-md">Nguyễn Thục Anh (VIP)</span>
                </div>
                <span className="font-bold text-primary">68%</span>
              </div>
              <div className="w-full bg-outline-variant/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-[68%]"></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('pipeline')}
            className="w-full mt-stack-lg py-3 border border-primary text-primary font-label-md rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
          >
            Quản lý cơ hội chốt số
          </button>
        </div>

        {/* Recent New Customers */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">Khách hàng mới nhất</h4>
            <button onClick={() => onNavigate('customers')} className="text-primary font-label-md hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-all border border-outline-variant/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold">{l.name}</p>
                      <p className="text-[12px] text-on-surface-variant">Liên hệ: {l.contact_name} - {l.phone}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    l.group_type === 'VIP' ? 'bg-amber-100 text-amber-800' :
                    l.group_type === 'Đại lý' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {l.group_type}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-body-md text-on-surface-variant text-center py-4">Chưa có khách hàng nào</p>
            )}
          </div>
        </div>

        {/* Tasks / Focus widget */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">Công việc khẩn cấp</h4>
            <button onClick={() => onNavigate('tasks')} className="text-primary font-label-md hover:underline">
              Quản lý việc ({tasks.filter(t => t.status !== 'Đã hoàn thành').length})
            </button>
          </div>
          <div className="space-y-2">
            {recentTasks.length > 0 ? (
              recentTasks.map((t) => (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      t.priority === 'High' ? 'bg-error' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'
                    }`} />
                    <span className="font-body-md text-body-md text-on-surface line-clamp-1">{t.title}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    Hạn: {new Date(t.deadline).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-body-md text-on-surface-variant text-center py-4">Chưa có đầu việc nào</p>
            )}
          </div>
        </div>

      </div>

      {/* Scenic Footer Element */}
      <div className="mt-stack-lg relative h-40 rounded-2xl overflow-hidden group">
        <img
          alt="Dairy Farm Scenic View"
          className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida/AP1WRLvXaawnkTwMoH66hhRAn8pFTcVktUwvNRFz8GjBSeA3yxv5R5WwtGmFX_a_bbwUH-46R9txVPs7--9CIdKN-zJhgDuMXZiQL1nFbYEqh3YPnSvZNctYVEENStpglenSPW3ayKPSVu9Jt7deivDp1ErqKuBzLL8b64hfF4fnRHxPc1_52MRVuFmVd1Q0nuQ6nZtfANMXEJi2-KSj1dVhAV0mOABxz6LsA4mA5jH2LjwjmuAsa8xwER8lRrak"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent flex flex-col justify-end p-8">
          <p className="text-white font-headline-sm text-headline-sm">"Sữa sạch từ tâm, nâng tầm sức khỏe Việt"</p>
          <p className="text-white/60 text-[12px] font-label-md uppercase tracking-[0.2em] mt-1">Sứ mệnh Vĩnh Hưng 2026</p>
        </div>
      </div>
      
      {/* Decorative Organic Shape */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Dashboard;
