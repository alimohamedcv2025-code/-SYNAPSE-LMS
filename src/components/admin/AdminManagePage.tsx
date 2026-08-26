import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminScope, UserRole } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  Shield,
  Users,
  Ban,
  CheckCircle2
} from 'lucide-react';

const SCOPE_OPTIONS: { value: AdminScope; label: string }[] = [
  { value: 'level_2', label: 'Level 2 General Scope' },
  { value: 'level_3', label: 'Level 3 General Track' },
  { value: 'level_4', label: 'Level 4 Senior Scope' },
  { value: 'summer', label: 'Summer Term Scope' },
  { value: 'case', label: 'Case Study Scope' },
  { value: 'all', label: 'All Levels (Unrestricted)' }
];

export const AdminManagePage: React.FC = () => {
  const {
    users, currentUser, showToast,
    createAdminUser, updateUserRole, updateAdminScope,
    toggleUserActive, deleteUserAccount
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newAdminScope, setNewAdminScope] = useState<AdminScope>('level_3');

  // Role editing state per row
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('student');
  const [editScope, setEditScope] = useState<AdminScope>('level_3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <Lock className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="text-2xl font-bold font-display">Super Admin Access Only</h2>
        <p className="text-xs text-neutral-500">
          This governance module is strictly reserved for the institutional Super Admin.
        </p>
      </div>
    );
  }

  const startEditing = (userId: string, role: UserRole, scope?: AdminScope) => {
    setEditingId(userId);
    setEditRole(role);
    setEditScope(scope || 'level_3');
  };

  const saveRole = async (userId: string) => {
    if (editRole !== 'student' && editRole !== 'super_admin' && !editScope) return;
    const success = await updateUserRole(userId, editRole, editRole === 'admin' ? editScope : undefined);
    if (success) setEditingId(null);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitting(true);
    await createAdminUser(name, email.trim(), newAdminScope);
    setIsSubmitting(false);
    setName('');
    setEmail('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-300 border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-purple-950">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GLOBAL GOVERNANCE & SCOPES</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Account & Role Management
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            View every registered account and assign roles (Student / Scoped Admin / Super Admin) with strict RBAC scopes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="neo-btn neo-btn-primary px-5 py-3 text-xs font-mono font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Admin</span>
        </button>
      </div>

      {/* Create Admin Form */}
      {isCreating && (
        <form onSubmit={handleCreateAdmin} className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4 font-mono text-xs shadow-[6px_6px_0px_#000000]">
          <h3 className="font-display font-black text-lg uppercase text-neutral-900 dark:text-white">
            Provision Scoped Administrator
          </h3>
          <p className="text-[11px] text-neutral-500">
            The account will be created with a temporary password: <span className="font-bold text-black dark:text-[#FFE600]">ChangeMe123!</span> — share it securely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1 uppercase">Faculty Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Eleanor Rigby"
                className="neo-input dark:bg-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 uppercase">Institutional Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@college.edu"
                className="neo-input dark:bg-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 uppercase">Assigned RBAC Scope *</label>
              <select
                value={newAdminScope}
                onChange={(e) => setNewAdminScope(e.target.value as AdminScope)}
                className="neo-input dark:bg-neutral-900 dark:text-white font-bold"
              >
                {SCOPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn neo-btn-primary px-6 py-2 font-black disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Confirm & Issue Access'}
            </button>
          </div>
        </form>
      )}

      {/* All Registered Accounts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-sm font-black uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
          <Users className="w-4 h-4" />
          <span>All Registered Accounts ({users.length})</span>
        </div>

        <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[6px_6px_0px_#000000] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
                <th className="p-3.5">Account</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Scope</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
              {users.map(u => {
                const isSelf = u.id === currentUser?.id;
                const isSuper = u.role === 'super_admin';
                const isEditing = editingId === u.id;

                return (
                  <tr key={u.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors ${!u.isActive ? 'opacity-50' : ''}`}>

                    {/* Name & Email */}
                    <td className="p-3.5 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                          {u.name || '(No name)'}
                        </span>
                        {isSelf && (
                          <span className="px-1.5 bg-[#FFE600] text-black text-[9px] font-bold border border-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {u.email}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as UserRole)}
                          className="neo-input dark:bg-neutral-900 dark:text-white py-1 text-[11px] w-full min-w-[130px]"
                        >
                          <option value="student">🎓 Student</option>
                          <option value="admin">🛡️ Level Admin</option>
                          <option value="super_admin">👑 Super Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border-2 shadow-[1.5px_1.5px_0px_#000000] ${
                          isSuper
                            ? 'bg-purple-200 text-purple-950 border-purple-900'
                            : u.role === 'admin'
                              ? 'bg-blue-200 text-blue-950 border-blue-900'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-900'
                        }`}>
                          {isSuper ? '👑 SUPER ADMIN' : u.role === 'admin' ? '🛡️ ADMIN' : '🎓 STUDENT'}
                        </span>
                      )}
                    </td>

                    {/* Scope */}
                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={editScope}
                          onChange={(e) => setEditScope(e.target.value as AdminScope)}
                          disabled={editRole !== 'admin'}
                          className="neo-input dark:bg-neutral-900 dark:text-white py-1 text-[11px] w-full min-w-[140px] disabled:opacity-40"
                        >
                          {SCOPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        u.role === 'admin'
                          ? (
                            <button
                              onClick={() => startEditing(u.id, u.role, u.adminScope)}
                              className="hover:underline decoration-dotted"
                              title="Click to change scope"
                            >
                              🛡️ {u.adminScope?.toUpperCase() || '—'}
                            </button>
                          )
                          : isSuper ? '🌍 ALL' : <span className="text-neutral-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {!isSelf && (
                        <button
                          onClick={() => toggleUserActive(u.id)}
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase border-2 shadow-[1.5px_1.5px_0px_#000000] cursor-pointer transition-colors ${
                            u.isActive
                              ? 'bg-emerald-400 text-black border-black hover:bg-emerald-300'
                              : 'bg-red-400 text-white border-black hover:bg-red-300'
                          }`}
                          title={u.isActive ? 'Click to deactivate' : 'Click to reactivate'}
                        >
                          {u.isActive ? '✓ Active' : '✕ Frozen'}
                        </button>
                      )}
                      {isSelf && <span className="text-[10px] font-bold uppercase text-neutral-400">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveRole(u.id)}
                              disabled={isSubmitting}
                              className="p-1.5 bg-emerald-400 border border-black hover:bg-emerald-300 text-black font-bold inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-black font-bold"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(u.id, u.role, u.adminScope)}
                              disabled={isSelf}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-[#FFE600] hover:text-black inline-flex items-center gap-1 font-bold disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-neutral-700"
                              title="Change role / scope"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              <span>Role</span>
                            </button>
                            {!isSelf && !isSuper && (
                              <button
                                onClick={() => deleteUserAccount(u.id)}
                                className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-red-500 hover:text-white text-red-600 transition-colors inline-flex items-center gap-1"
                                title="Delete account permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
          <Ban className="w-3 h-3" />
          Frozen accounts cannot sign in. Deleting removes the profile immediately — full auth cleanup runs server-side.
        </p>
      </div>

    </div>
  );
};
