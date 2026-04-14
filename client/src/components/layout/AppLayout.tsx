import { NavLink, Outlet } from "react-router-dom";
import { Activity, LayoutDashboard, LogIn, Orbit, PlaySquare, Workflow } from "lucide-react";
import { getCurrentUser } from "@/lib/workflows";

const navItems = [
  { to: "/", label: "Overview", icon: Orbit, end: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder", label: "Builder", icon: Workflow },
  { to: "/executions", label: "Executions", icon: Activity },
  { to: "/signin", label: "Signin", icon: LogIn },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,_#f6f0e8_0%,_#f3ede4_56%,_#ece5da_100%)] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-40 mb-8 rounded-[28px] border border-white/70 bg-white/75 px-4 py-4 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur xl:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-300">
                <PlaySquare size={22} />
              </div>
              <div>
                <p className="font-serif text-2xl leading-none tracking-tight">TradeFlow Studio</p>
                <p className="text-sm text-stone-600">Visual automation for trading bots, execution chains, and desk-ready alerts.</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                        isActive ? "bg-stone-950 text-amber-300" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm text-stone-600">
              Active desk user: <span className="font-semibold text-stone-900">{getCurrentUser()}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
