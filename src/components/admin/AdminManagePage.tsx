import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminScope, User } from '../../types';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  Shield
} from 'lucide-react';

export const AdminManagePage: React.FC = () => {
  const { users, setUsers, currentUser, showToast } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState<AdminScope>('level_3');

  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'super_admin');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newAdmin: User = {
      id: `usr_adm_${Date.now()}`,
      name,
      email,
      role: 'admin',
      adminScope: scope,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newAdmin]);
    showToast(`Created new Scoped Admin for ${scope.toUpperCase()}.`, 'success');
    setName('');
    setEmail('');
    setIsCreating(false);
  };

  const handleDeleteAdmin = (id: string) => {
    if (id === currentUser?.id) {
      showToast('Cannot remove your own active admin account.', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Admin account removed.', 'info');
  };

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
            Manage Department Administrators
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            Provision departmental faculty accounts and assign strict RBAC scopes (Level 2, Level 3 CS/AI/IS, Summer, Case).
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
                value={scope}
                onChange={(e) => setScope(e.target.value as AdminScope)}
                className="neo-input dark:bg-neutral-900 dark:text-white font-bold"
              >
                <option value="level_2">Level 2 General Scope</option>
                <option value="level_3">Level 3 General Track</option>
                <option value="level_3_cs">Level 3 • CS Department</option>
                <option value="level_3_ai">Level 3 • AI Department</option>
                <option value="level_3_is">Level 3 • IS Department</option>
                <option value="level_4">Level 4 Senior Scope</option>
                <option value="summer">Summer Term Scope</option>
                <option value="case">Case Study Scope</option>
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
              className="neo-btn neo-btn-primary px-6 py-2 font-black"
            >
              Confirm & Issue Access
            </button>
          </div>
        </form>
      )}

      {/* Admin Users Table */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[6px_6px_0px_#000000] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
              <th className="p-3.5">Administrator</th>
              <th className="p-3.5">Assigned Scope Domain</th>
              <th className="p-3.5">Security Level</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
            {adminUsers.map(adm => {
              const isSuper = adm.role === 'super_admin';

              return (
                <tr key={adm.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-3.5 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        {adm.name}
                      </span>
                      {adm.id === currentUser?.id && (
                        <span className="px-1.5 py-0.2 bg-[#FFE600] text-black text-[9px] font-bold border border-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {adm.email} • ID: {adm.id}
                    </p>
                  </td>

                  {/* Scope */}
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border-2 shadow-[1.5px_1.5px_0px_#000000] ${
                      isSuper
                        ? 'bg-purple-200 text-purple-950 border-purple-900'
                        : 'bg-[#FFE600] text-black border-black'
                    }`}>
                      {isSuper ? '👑 GLOBAL UNRESTRICTED' : `🛡️ ${adm.adminScope?.toUpperCase()}`}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="p-3.5 text-neutral-700 dark:text-neutral-300 font-bold uppercase">
                    {adm.role.replace('_', ' ')}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    {!isSuper && (
                      <button
                        onClick={() => handleDeleteAdmin(adm.id)}
                        className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-red-500 hover:text-white text-red-600 transition-colors inline-flex items-center gap-1"
                        title="Revoke Admin Access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
