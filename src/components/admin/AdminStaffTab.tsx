import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit2, Trash2, Shield, User as UserIcon, Lock, Mail, Phone, CheckCircle2, X } from 'lucide-react';
import { User } from '../../types';
import { fetchStaffList, createStaffUser, updateStaffUser, deleteStaffUser, notifyDataUpdated } from '../../services/api';

interface AdminStaffTabProps {
  currentUser: User;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminStaffTab: React.FC<AdminStaffTabProps> = ({ currentUser, showToast }) => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff' as 'Admin' | 'Staff' | 'Viewer',
    password: ''
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await fetchStaffList();
      setStaff(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load staff accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormData({ name: '', email: '', phone: '', role: 'Staff', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: User) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const actionName = editingStaff ? `update staff account "${formData.name}"` : `create staff account "${formData.name}"`;
    if (!window.confirm(`CONFIRMATION: Are you sure you want to ${actionName}?`)) {
      return;
    }

    try {
      if (editingStaff) {
        await updateStaffUser(editingStaff.id, formData);
        showToast(`Staff account for ${formData.name} updated successfully!`);
      } else {
        await createStaffUser(formData);
        showToast(`New staff account for ${formData.name} created!`);
      }
      setIsModalOpen(false);
      notifyDataUpdated();
      loadStaff();
    } catch (err: any) {
      showToast(err.message || 'Failed to save staff account', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser.id) {
      showToast('You cannot delete your own active staff account.', 'error');
      return;
    }
    if (!window.confirm(`CONFIRMATION: Are you sure you want to permanently delete staff account for "${name}"?`)) {
      return;
    }

    try {
      await deleteStaffUser(id);
      showToast(`Staff account for ${name} deleted.`);
      notifyDataUpdated();
      loadStaff();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete staff account', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-500" />
            Staff Accounts & Role Access Controller ({staff.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Grant role-based administrative permissions to engineers, sales executives, and support staff.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff Account</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
              <th className="p-3.5">Staff Name</th>
              <th className="p-3.5">Email / Login Username</th>
              <th className="p-3.5">Phone Contact</th>
              <th className="p-3.5">Access Role</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{member.name}</span>
                </td>
                <td className="p-3.5 text-slate-600 font-mono text-[11px]">{member.email}</td>
                <td className="p-3.5 text-slate-700 font-mono">{member.phone || 'N/A'}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      member.role === 'Admin'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : member.role === 'Staff'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
                    title="Edit Staff Account"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    disabled={member.id === currentUser.id}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors disabled:opacity-30"
                    title="Delete Staff Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No staff members registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Staff Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-poppins">
                {editingStaff ? 'Edit Staff Credentials' : 'Create New Staff Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Access Role Permission</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-bold"
                >
                  <option value="Staff font-bold">Staff (Standard CMS Operations)</option>
                  <option value="Admin">Admin (Full Control + Staff Management)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingStaff ? 'New Password (Leave blank to keep unchanged)' : 'Login Password *'}
                </label>
                <input
                  type="password"
                  required={!editingStaff}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
