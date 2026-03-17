import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { seedAppData } from "../lib/storage";

export default function AppShell({ children, showNav = true }) {
  const location = useLocation();

  useEffect(() => {
    seedAppData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6">
      <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-app rounded-[32px] border border-white/60 bg-surface shadow-soft">
        <div className="min-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] bg-surface">
          <main className={showNav ? "px-4 pb-24 pt-4" : "px-4 pb-6 pt-4"}>
            {children}
          </main>
          {showNav && <BottomNav />}
        </div>
      </div>
    </div>
  );
}
