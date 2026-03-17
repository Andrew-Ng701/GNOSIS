import { Bell } from "lucide-react";

export default function NotificationPanel({ open, onClose, notifications }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose}>
      <div
        className="mx-auto mt-4 w-[calc(100%-1.5rem)] max-w-app rounded-3xl bg-white p-4 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-2">
          <Bell size={18} className="text-brand-500" />
          <h3 className="text-lg font-semibold text-ink">Notifications</h3>
        </div>

        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3"
            >
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500 opacity-100">
                {!item.unread ? <span className="hidden" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-label">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
