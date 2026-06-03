import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, Task, Lead, TaskPriority, TaskStatus } from '../lib/dbService';


interface TasksProps {
  user: Profile;
}

const Tasks: React.FC<TasksProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | TaskStatus>('Tất cả');
  
  // Add task modal/form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [assignedTo, setAssignedTo] = useState(user.id);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await dbService.getTasks();
      const fetchedLeads = await dbService.getLeads();
      const fetchedProfiles = await dbService.getProfiles();
      
      setTasks(fetchedTasks);
      setLeads(fetchedLeads);
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error('Error loading task page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'Đã hoàn thành' ? 'Chưa hoàn thành' : 'Đã hoàn thành';
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    try {
      await dbService.saveTask({
        id: task.id,
        status: newStatus
      });
      dbService.addActivityLog(
        newStatus === 'Đã hoàn thành' ? 'Hoàn thành công việc' : 'Mở lại công việc',
        `Công việc: ${task.title}`
      );
    } catch (err) {
      console.error('Error toggling task completion:', err);
      loadData(); // Revert
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) {
      alert('Vui lòng điền tiêu đề và hạn hoàn thành.');
      return;
    }

    setSubmitting(true);
    try {
      const newTask = await dbService.saveTask({
        title,
        description,
        lead_id: leadId ? leadId : null,
        assigned_to: assignedTo,
        priority,
        status: 'Chưa hoàn thành',
        deadline: new Date(deadline).toISOString(),
      });

      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setLeadId('');
      setAssignedTo(user.id);
      setPriority('Medium');
      setDeadline('');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Không thể tạo công việc mới.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    try {
      await dbService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Không thể xóa công việc.');
    }
  };

  const getLeadName = (id: string | null) => {
    if (!id) return 'Không liên kết';
    const found = leads.find(l => l.id === id);
    return found ? found.name : 'Khách hàng ẩn';
  };

  const getAssigneeName = (id: string) => {
    const found = profiles.find(p => p.id === id);
    return found ? found.full_name : 'Không xác định';
  };

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'Tất cả') return true;
    return t.status === statusFilter;
  });

  if (loading && tasks.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-container-padding pb-8 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Danh sách công việc</h2>
          <p className="text-body-md text-on-surface-variant">
            Theo dõi, cập nhật lịch hẹn giao sữa, giao hàng và nhắc nợ đối tác.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary-container text-white px-5 py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Thêm công việc</span>
        </button>
      </div>

      {/* Control Bar (Filters) */}
      <div className="flex-shrink-0 flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 mb-4">
        <div className="flex space-x-2">
          {(['Tất cả', 'Chưa hoàn thành', 'Đang làm', 'Đã hoàn thành'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-full font-body-md text-body-md cursor-pointer transition-all ${
                statusFilter === tab
                  ? 'bg-primary-container text-white'
                  : 'bg-white border border-[#EFEFEA] text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
          Tổng số: {filteredTasks.length} việc
        </span>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'Đã hoàn thành';
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:bg-surface-container-low/40 transition-all"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Round toggle checkbox */}
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-container active:scale-90 transition-all"
                  >
                    {isCompleted && (
                      <span className="material-symbols-outlined text-primary-container text-[18px] font-bold">check</span>
                    )}
                  </button>
                  
                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-body-md text-body-md font-semibold text-on-surface leading-tight ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[12px] text-on-surface-variant">
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">store</span>
                        <span>{getLeadName(task.lead_id)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">account_circle</span>
                        <span>Giao cho: {getAssigneeName(task.assigned_to)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Priority & Deadline */}
                <div className="flex items-center space-x-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    task.priority === 'High' ? 'bg-error-container text-on-error-container' :
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority === 'High' ? 'Khẩn' : task.priority === 'Medium' ? 'Thường' : 'Thấp'}
                  </span>

                  <span className="text-body-md text-on-surface-variant font-medium whitespace-nowrap">
                    {new Date(task.deadline).toLocaleDateString('vi-VN')}
                  </span>

                  {/* Delete button (only managers/admins, but in mock we allow anyone for ease of use) */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-surface-container-low rounded-xl border border-dashed border-outline-variant/35 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-40 mb-2">task</span>
            <p className="text-body-md">Không có công việc nào cần xử lý trong mục này.</p>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay">
          <div className="modal-container w-full max-w-lg rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-container-padding pt-container-padding pb-stack-md flex justify-between items-center border-b border-outline-variant/20">
              <h2 className="text-[18px] font-medium text-[#1A1A17]">Thêm công việc chăm sóc mới</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask} className="px-container-padding py-6 space-y-4">
              {/* Task Title */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-title">
                  Tiêu đề công việc
                </label>
                <input
                  id="task-title"
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyển sữa mẫu dâu, gọi điện nhắc nợ..."
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-desc">
                  Chi tiết nội dung
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Ghi chú chi tiết yêu cầu công việc..."
                  className="w-full h-20 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Customer Linkage */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-lead">
                  Khách hàng liên quan
                </label>
                <select
                  id="task-lead"
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                >
                  <option value="">Không liên kết</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.contact_name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Assigned to */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-assignee">
                    Người thực hiện
                  </label>
                  <select
                    id="task-assignee"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-priority">
                    Độ khẩn cấp
                  </label>
                  <select
                    id="task-priority"
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="Low">Thấp</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="task-deadline">
                  Hạn hoàn thành (Deadline)
                </label>
                <input
                  id="task-deadline"
                  type="datetime-local"
                  required
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              {/* Footer Buttons */}
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
                    <span>Lưu công việc</span>
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

export default Tasks;
