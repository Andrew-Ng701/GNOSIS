import { Bot, GraduationCap, Home, MoreHorizontal, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/match", label: "Match", icon: GraduationCap },
  { to: "/ai-agent", label: "AI Agent", icon: Bot },
  { to: "/community", label: "Community", icon: Users },
  { to: "/more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center rounded-2xl text-[11px] font-medium ${
                isActive ? "text-brand-500" : "text-slate-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  className={isActive ? "text-brand-500" : "text-slate-400"}
                />
                <span className="mt-1">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
