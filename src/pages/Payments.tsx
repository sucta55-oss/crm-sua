import React, { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile, Invoice, Lead, InvoiceStatus } from '../lib/dbService';



interface PaymentsProps {
  user: Profile;
  onInvoicePaid: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ user, onInvoicePaid }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Status edit state
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [newStatus, setNewStatus] = useState<InvoiceStatus>('Chờ thanh toán');
  const [newMethod, setNewMethod] = useState('Chuyển khoản');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedInvoices = await dbService.getInvoices();
      const fetchedLeads = await dbService.getLeads();
      setInvoices(fetchedInvoices);
      setLeads(fetchedLeads);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenStatusEdit = (inv: Invoice) => {
    if (user.role === 'Sales') return; // Chặn chỉnh sửa đối với Sales
    setEditingInvoice(inv);
    setNewStatus(inv.status);
    setNewMethod(inv.payment_method || 'Chuyển khoản');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    setSaving(true);
    try {
      const updated = await dbService.saveInvoice({
        id: editingInvoice.id,
        status: newStatus,
        payment_method: newMethod
      });

      // Update UI state
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? updated : inv));
      setEditingInvoice(null);
      
      // Notify parent to refresh dashboard if tab is switched later
      onInvoicePaid();
      
      dbService.addActivityLog(
        'Cập nhật thanh toán',
        `Hóa đơn: ${editingInvoice.invoice_code}. Trạng thái mới: ${newStatus}`
      );
    } catch (err) {
      console.error('Error updating invoice status:', err);
      alert('Không thể cập nhật trạng thái hóa đơn.');
    } finally {
      setSaving(false);
    }
  };

  const getLeadName = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
    return found ? found.name : 'Khách hàng ẩn';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading && invoices.length === 0) {
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
          <h2 className="font-headline-md text-headline-md text-on-surface">Thanh toán & Công nợ</h2>
          <p className="text-body-md text-on-surface-variant">
            Quản lý hóa đơn xuất kho sữa, hình thức thu tiền và theo dõi các khoản công nợ quá hạn.
          </p>
        </div>
      </div>

      {/* Invoice Table Container */}
      <div className="flex-1 overflow-auto border border-outline-variant/30 rounded-xl bg-surface-container-lowest custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider sticky top-0 z-10">
              <th className="px-6 py-4">Mã hóa đơn</th>
              <th className="px-6 py-4">Khách hàng thanh toán</th>
              <th className="px-6 py-4 text-right">Tổng tiền (VND)</th>
              <th className="px-6 py-4">Phương thức</th>
              <th className="px-6 py-4">Ngày ghi nhận</th>
              <th className="px-6 py-4">Ngày thanh toán</th>
              <th className="px-6 py-4">Trạng thái</th>
              {user.role !== 'Sales' && <th className="px-6 py-4 text-center">Hành động</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 font-body-md text-body-md">
            {invoices.length > 0 ? (
              invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors h-[48px]">
                  <td className="px-6 py-4 font-semibold text-on-surface-variant">{inv.invoice_code}</td>
                  <td className="px-6 py-4 font-medium text-on-surface">{getLeadName(inv.lead_id)}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary-container">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4">{inv.payment_method || '-'}</td>
                  <td className="px-6 py-4">{new Date(inv.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      inv.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Đã thanh toán một phần' ? 'bg-blue-100 text-blue-800' :
                      inv.status === 'Quá hạn' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  {user.role !== 'Sales' && (
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenStatusEdit(inv)}
                        className="text-primary hover:text-primary-container p-1"
                        title="Cập nhật trạng thái"
                      >
                        <span className="material-symbols-outlined text-[20px]">change_circle</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user.role === 'Sales' ? 7 : 8} className="text-center py-16 text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined text-[48px] mb-2 block">receipt_long</span>
                  Chưa có hóa đơn thanh toán nào được ghi nhận.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Edit Status Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay">
          <div className="modal-container w-full max-w-md rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-container-padding pt-container-padding pb-stack-md flex justify-between items-center border-b border-outline-variant/20">
              <h2 className="text-[18px] font-medium text-[#1A1A17]">Cập nhật trạng thái hóa đơn</h2>
              <button
                onClick={() => setEditingInvoice(null)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateStatus} className="px-container-padding py-6 space-y-4">
              <div>
                <p className="text-body-md text-on-surface-variant">
                  Cập nhật thanh toán cho hóa đơn: <strong>{editingInvoice.invoice_code}</strong>
                </p>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Đơn vị: <strong>{getLeadName(editingInvoice.lead_id)}</strong> - Số tiền: <strong className="text-primary-container">{formatCurrency(editingInvoice.amount)}</strong>
                </p>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="invoice-status">
                  Trạng thái tiền nong
                </label>
                <select
                  id="invoice-status"
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                >
                  <option value="Chờ thanh toán">Chờ thanh toán</option>
                  <option value="Đã thanh toán một phần">Đã thanh toán một phần</option>
                  <option value="Đã thanh toán">Đã thanh toán (Hoàn tất)</option>
                  <option value="Quá hạn">Quá hạn</option>
                </select>
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block" htmlFor="invoice-method">
                  Phương thức thanh toán
                </label>
                <select
                  id="invoice-method"
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input"
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                >
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                </select>
              </div>

              {/* Footer */}
              <div className="pt-4 flex justify-end items-center gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-6 py-2 border border-[#EFEFEA] bg-white text-[#1A1A17] font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2 bg-[#1E5E3A] text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer flex items-center justify-center"
                >
                  {saving ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span>Lưu thay đổi</span>
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

export default Payments;
