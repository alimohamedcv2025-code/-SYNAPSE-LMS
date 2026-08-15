import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, GraduationCap, CheckCircle2, RefreshCw } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, users, switchUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="bg-black text-white px-3 py-2 border-b-2 border-black text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFE600] text-black px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px] border border-black">
            LIVE DEMO RBAC
          </span>
          <span className="text-neutral-300 hidden sm:inline">Active Persona:</span>
          <span className="font-bold text-[#FFE600] flex items-center gap-1">
            {currentUser.role === 'super_admin' ? (
              <Shield className="w-3.5 h-3.5 text-[#FFE600]" />
            ) : currentUser.role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {currentUser.name} 
            <span className="text-neutral-400 font-normal">
              ({currentUser.role === 'super_admin' 
                ? 'Super Admin / Global' 
                : currentUser.role === 'admin' 
                ? `Admin [${currentUser.adminScope?.toUpperCase()}]` 
                : `Student [${currentUser.academicProfile?.level.toUpperCase()}${currentUser.academicProfile?.department ? ` - ${currentUser.academicProfile.department}` : ''}]`})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-neutral-400 text-[11px] mr-1 hidden md:inline">Quick Switch:</span>
          {users.map(u => {
            const isSelected = u.id === currentUser.id;
            let label = u.name.split(' ')[0];
            let badge = '';

            if (u.role === 'super_admin') badge = 'Super';
            else if (u.role === 'admin') badge = u.adminScope?.replace('level_', 'L') || 'Admin';
            else if (u.academicProfile?.level === 'summer') badge = 'Summer';
            else if (u.academicProfile?.level === 'case') badge = 'Case';
            else if (u.academicProfile?.level === 'level_3') badge = `L3-${u.academicProfile.department || 'CS'}`;
            else badge = 'L2';

            return (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-0.5 text-[11px] font-mono transition-all flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-[#FFE600] text-black font-bold border-black shadow-[1px_1px_0px_#ffffff]'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-700'
                }`}
                title={`Switch to ${u.name} (${u.role})`}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-black inline" />}
                <span>{label}</span>
                <span className="opacity-60 text-[9px]">[{badge}]</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
