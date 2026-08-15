import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, CheckCheck, ExternalLink, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    navigate 
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-[#FAF9F5] dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 shadow-[8px_8px_0px_#000000] p-5 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FFE600] border border-black text-black">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-[10px] font-mono text-neutral-500">Live Academic Activity Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-mono font-bold hover:underline text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              title="Mark all read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[65vh] overflow-y-auto space-y-3 font-mono text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Sparkles className="w-6 h-6 mx-auto opacity-40" />
              <p>You are all caught up!</p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.linkUrl) {
                    if (item.linkUrl.startsWith('/subjects/')) {
                      const subId = item.linkUrl.replace('/subjects/', '');
                      navigate('subject-details', subId);
                    } else if (item.linkUrl === '/questions') {
                      navigate('questions');
                    }
                    setIsNotificationsOpen(false);
                  }
                }}
                className={`p-3.5 border-2 border-black dark:border-neutral-700 cursor-pointer transition-all shadow-[2px_2px_0px_#000000] ${
                  item.read
                    ? 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 opacity-80'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-neutral-900 dark:text-white border-black font-semibold'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'material' ? (
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : item.type === 'answer' ? (
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    )}
                    <span className="font-bold text-xs leading-snug">{item.title}</span>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 bg-[#FF4747] border border-black rounded-full shrink-0"></span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1 pl-5 leading-relaxed font-sans">
                  {item.message}
                </p>

                <div className="mt-2 pl-5 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {item.linkUrl && (
                    <span className="text-[#1D4ED8] dark:text-blue-400 flex items-center gap-0.5 font-bold">
                      View details <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
