import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, Lead, PipelineStage } from '../lib/dbService';

interface PipelineProps {
  user: Profile;
}

const COLUMNS: { id: PipelineStage; title: string }[] = [
  { id: 'Tiếp cận', title: 'TIẾP CẬN' },
  { id: 'Tư vấn mẫu thử', title: 'TƯ VẤN MẪU THỬ' },
  { id: 'Đàm phán', title: 'ĐÀM PHÁN' },
  { id: 'Thành công', title: 'THÀNH CÔNG' },
  { id: 'Thất bại', title: 'THẤT BẠI' },
];

const Pipeline: React.FC<PipelineProps> = ({ user: _user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  
  // Failure Modal state
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [modalLead, setModalLead] = useState<Lead | null>(null);
  const [lostReason, setLostReason] = useState('');
  const [savingModal, setSavingModal] = useState(false);


  const loadLeads = async () => {
    setLoading(true);
    try {
      const fetched = await dbService.getLeads();
      setLeads(fetched);
    } catch (err) {
      console.error('Error loading leads in Pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stage: PipelineStage) => {
    if (!draggedLead) return;
    const oldStage = draggedLead.stage;
    if (oldStage === stage) {
      setDraggedLead(null);
      return;
    }

    if (stage === 'Thất bại') {
      // Trigger failure modal instead of saving immediately
      setModalLead(draggedLead);

      setLostReason('');
      setShowFailureModal(true);
      setDraggedLead(null);
      return;
    }

    // Save normally
    try {
      // Optimistic UI update
      setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, stage } : l));
      await dbService.saveLead({ id: draggedLead.id, stage });
    } catch (err) {
      console.error('Error updating stage:', err);
      // Revert on error
      loadLeads();
    } finally {
      setDraggedLead(null);
    }
  };

  const handleSaveFailure = async () => {
    if (!modalLead) return;
    if (!lostReason.trim()) {
      alert('Vui lòng chọn hoặc điền chi tiết lý do thất bại.');
      return;
    }

    setSavingModal(true);
    try {
      // Save changes to db
      await dbService.saveLead({
        id: modalLead.id,
        stage: 'Thất bại',
        lost_reason: lostReason,
      });

      // Update UI state
      setLeads(prev => prev.map(l => l.id === modalLead.id ? { ...l, stage: 'Thất bại' as PipelineStage, lost_reason: lostReason } : l));
      setShowFailureModal(false);
      setModalLead(null);
    } catch (err) {
      console.error('Error saving failure stage:', err);
      alert('Không thể lưu trạng thái thất bại.');
    } finally {
      setSavingModal(false);
    }
  };

  const handleCancelFailure = () => {
    // Revert lead to original stage
    setShowFailureModal(false);
    setModalLead(null);
  };

  const handleSelectQuickReason = (reason: string) => {
    if (lostReason.includes(reason)) {
      setLostReason(prev => prev.replace(reason + '. ', ''));
    } else {
      setLostReason(prev => prev + reason + '. ');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading && leads.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-container-padding pb-8">
      {/* Page Header */}
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Cơ hội bán hàng</h2>
          <p className="text-body-md text-on-surface-variant">
            Kéo thả thẻ đại lý/đối tác qua các cột để cập nhật tiến trình phân phối sữa.
          </p>
        </div>
      </div>

      {/* Board Columns container */}
      <div className="flex-1 flex overflow-x-auto gap-gutter pb-4 custom-scrollbar select-none">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.stage === col.id);
          const colTotalRevenue = colLeads.reduce((sum, l) => sum + (l.estimated_revenue || 0), 0);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="flex-shrink-0 w-80 bg-surface-container-low rounded-xl flex flex-col p-4 border border-outline-variant/30"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/30 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'Thành công' ? 'bg-[#1E5E3A]' :
                    col.id === 'Thất bại' ? 'bg-error' :
                    col.id === 'Đàm phán' ? 'bg-amber-500' : 'bg-outline-variant'
                  }`} />
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                    {col.title} ({colLeads.length})
                  </h3>
                </div>
              </div>

              {/* Total estimation */}
              {colTotalRevenue > 0 && (
                <div className="text-[12px] text-on-surface-variant bg-surface px-2 py-1 rounded mb-3 font-semibold text-center">
                  Dự kiến: {formatCurrency(colTotalRevenue)}
                </div>
              )}

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[300px]">
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all relative group"
                  >
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface mb-1">
                      {lead.name}
                    </h4>
                    <p className="text-[12px] text-on-surface-variant flex items-center space-x-1 mb-2">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      <span>{lead.contact_name}</span>
                    </p>
                    
                    {/* Milk Interests */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lead.milk_interests.map(interest => (
                        <span key={interest} className="text-[10px] bg-primary/10 text-primary-container px-2 py-0.5 rounded-full font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row */}
                    <div className="flex justify-between items-center border-t border-outline-variant/20 pt-2">
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        {lead.group_type}
                      </span>
                      <span className="text-body-md font-bold text-primary-container">
                        {formatCurrency(lead.estimated_revenue)}
                      </span>
                    </div>

                    {/* Lost reason display for failed leads */}
                    {lead.stage === 'Thất bại' && lead.lost_reason && (
                      <div className="mt-2 bg-error-container/20 text-[11px] text-error p-2 rounded border border-error/10">
                        <strong>Lý do:</strong> {lead.lost_reason}
                      </div>
                    )}
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-outline-variant/35 rounded-lg flex items-center justify-center text-on-surface-variant opacity-60 text-body-md">
                    Kéo thả thẻ vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Failure Confirmation Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay animate-fade-in">
          <div className="modal-container w-full max-w-xl rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-container-padding pt-container-padding pb-stack-md flex justify-between items-center border-b border-outline-variant/20">
              <h2 className="text-[18px] font-medium text-[#1A1A17]">Xác nhận lý do thất bại</h2>
              <button 
                onClick={handleCancelFailure}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-container-padding py-6 flex flex-col gap-6">
              <p className="text-body-md text-on-surface-variant">
                Vui lòng xác nhận và điền lý do đại lý <strong>{modalLead?.name}</strong> từ chối nhập sữa:
              </p>

              {/* Quick tags */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Lý do phổ biến
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Chê giá cao', 'Không thích vị sữa chua nha đam', 'Chính sách vận chuyển chưa phù hợp'].map(reason => {
                    const isSelected = lostReason.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleSelectQuickReason(reason)}
                        className={`px-4 py-2 rounded-full border text-body-md font-body-md transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-[#EFEFEA] text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {reason}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="failure-note">
                  Ghi chú chi tiết (Bắt buộc)
                </label>
                <textarea
                  id="failure-note"
                  className="w-full h-32 p-3 rounded-lg border border-[#EFEFEA] focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none font-body-md text-body-md text-on-surface custom-scrollbar"
                  placeholder="Nhập thêm ghi chú cụ thể tại sao thương vụ thất bại..."
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                />
              </div>

              {/* Illustration and warning info */}
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center space-x-3 text-on-surface-variant/70 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <p className="text-[12px] leading-snug">
                  Dữ liệu thất bại này sẽ được tổng hợp trực tiếp vào báo cáo tỷ lệ chuyển đổi hàng tháng của ban giám đốc.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-container-padding py-4 bg-surface-container-low flex justify-end items-center gap-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={handleCancelFailure}
                className="px-6 py-2 border border-[#EFEFEA] bg-white text-[#1A1A17] font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-all cursor-pointer active:scale-95 duration-150"
              >
                Hủy bỏ (Trả về cột cũ)
              </button>
              <button
                type="button"
                onClick={handleSaveFailure}
                disabled={savingModal}
                className="px-8 py-2 bg-[#1E5E3A] text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer active:scale-95 duration-150 flex items-center justify-center"
              >
                {savingModal ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span>Lưu trạng thái</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
