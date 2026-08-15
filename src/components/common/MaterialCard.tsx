import React from 'react';
import { Material, MaterialType } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Video, 
  FileText, 
  FileCheck, 
  BookMarked, 
  Book, 
  ExternalLink, 
  Eye, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Globe, 
  CheckCircle, 
  EyeOff, 
  Sparkles,
  Link2
} from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onEdit?: (material: Material) => void;
  showAdminActions?: boolean;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ 
  material, 
  onEdit,
  showAdminActions = true 
}) => {
  const { 
    currentUser, 
    canAdministerScope, 
    deleteMaterial, 
    togglePublishMaterial, 
    incrementMaterialView 
  } = useApp();

  const isInstructor = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const hasScopePermission = canAdministerScope(material.targetLevel, material.department);

  const handleOpenLink = () => {
    incrementMaterialView(material.id);
    window.open(material.url, '_blank', 'noopener,noreferrer');
  };

  // Helper for Material Type styling & icons
  const getTypeBadge = (type: MaterialType) => {
    switch (type) {
      case 'video':
        return {
          label: 'VIDEO LECTURE',
          icon: <Video className="w-3.5 h-3.5" />,
          bg: 'bg-rose-100 text-rose-900 border-rose-900 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700'
        };
      case 'pdf':
        return {
          label: 'PDF NOTES',
          icon: <FileText className="w-3.5 h-3.5" />,
          bg: 'bg-amber-100 text-amber-900 border-amber-900 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700'
        };
      case 'exam':
        return {
          label: 'EXAM & RUBRIC',
          icon: <FileCheck className="w-3.5 h-3.5" />,
          bg: 'bg-purple-100 text-purple-900 border-purple-900 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-700'
        };
      case 'summary':
        return {
          label: 'SUMMARY CHEATSHEET',
          icon: <BookMarked className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700'
        };
      case 'book':
        return {
          label: 'REFERENCE BOOK',
          icon: <Book className="w-3.5 h-3.5" />,
          bg: 'bg-sky-100 text-sky-900 border-sky-900 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-700'
        };
      case 'other':
      default:
        return {
          label: 'RESOURCE LINK',
          icon: <Link2 className="w-3.5 h-3.5" />,
          bg: 'bg-neutral-100 text-neutral-900 border-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700'
        };
    }
  };

  const badgeConfig = getTypeBadge(material.type);

  // Format academic context string
  const formatAcademicContext = () => {
    const levelStr = material.targetLevel.replace('_', ' ').toUpperCase();
    const deptStr = material.department ? ` · ${material.department}` : '';
    const semStr = material.semester ? ` · Sem ${material.semester}` : '';
    return `${levelStr}${deptStr}${semStr}`;
  };

  return (
    <div 
      className={`border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] p-5 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] transition-all relative ${
        !material.isPublished ? 'opacity-75 bg-neutral-50 dark:bg-neutral-900 border-dashed' : ''
      }`}
    >
      {/* Top row: Type Badge, Academic Context Tag & View Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold border-2 ${badgeConfig.bg} shadow-[1.5px_1.5px_0px_#000000]`}>
            {badgeConfig.icon}
            <span>{badgeConfig.label}</span>
          </span>

          <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-neutral-300 dark:border-neutral-700">
            {formatAcademicContext()}
          </span>

          {!material.isPublished && (
            <span className="text-[10px] font-mono font-bold bg-neutral-900 text-amber-300 px-2 py-0.5 border border-neutral-700 flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> DRAFT / UNPUBLISHED
            </span>
          )}
        </div>

        {/* View count & Duration/Pages metadata */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {material.durationOrPages && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {material.durationOrPages}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {material.viewCount} views
          </span>
        </div>
      </div>

      {/* Main Material Content */}
      <div className="space-y-2 mb-4">
        <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white leading-tight">
          {material.title}
        </h3>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {material.description}
        </p>
      </div>

      {/* Footer Info & Action Button */}
      <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <span className="font-bold text-neutral-900 dark:text-neutral-200">
            {material.subjectName}
          </span>
          <span className="mx-1.5">•</span>
          <span>Source: <strong className="text-neutral-800 dark:text-neutral-300">{material.provider || 'External URL'}</strong></span>
        </div>

        {/* External Link Action Button */}
        <div className="flex items-center gap-2">
          {showAdminActions && isInstructor && hasScopePermission && (
            <div className="flex items-center gap-1 mr-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(material)}
                  className="p-1.5 border border-black bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_#000000] text-xs"
                  title="Edit Material Link"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => togglePublishMaterial(material.id)}
                className="p-1.5 border border-black bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_#000000] text-xs"
                title={material.isPublished ? 'Unpublish (Hide from students)' : 'Publish (Make visible)'}
              >
                {material.isPublished ? <EyeOff className="w-3.5 h-3.5 text-neutral-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${material.title}"?`)) {
                    deleteMaterial(material.id);
                  }
                }}
                className="p-1.5 border border-black bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 hover:bg-red-100 shadow-[1.5px_1.5px_0px_#000000] text-xs"
                title="Delete Material"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleOpenLink}
            className="neo-btn neo-btn-primary px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 group cursor-pointer"
          >
            <span>Open Material</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
