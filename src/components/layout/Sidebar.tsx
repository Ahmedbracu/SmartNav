"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Compass, Map, Activity, MapPin, Search, Star, Clock, AlertTriangle, Flag, LogIn, LogOut, ShieldAlert, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "admin";

  const links = [
    { name: "Dashboard", href: "/", icon: Compass },
    { name: "Route Finder", href: "/route-finder", icon: Search },
    { name: "Chaos Map", href: "/chaos-map", icon: AlertTriangle },
    { name: "Traffic", href: "/traffic", icon: Activity },
  ];

  const userLinks = [
    { name: "Trip History", href: "/trip-history", icon: Clock },
    { name: "Ratings", href: "/ratings", icon: Star },
    { name: "Report Incident", href: "/report", icon: Flag },
    { name: "My Preferences", href: "/preferences", icon: Settings },
  ];

  const adminLinks = [
    { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
  ];

  const renderLinks = (linkList: typeof links) => {
    return linkList.map((link) => {
      const isActive = pathname === link.href;
      return (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1
            ${isActive ? "bg-[#00e5a0]/10 text-[#00e5a0]" : "text-[#8b949e] hover:bg-white/5 hover:text-white"}`}
        >
          <link.icon className={`w-5 h-5 ${isActive ? "text-[#00e5a0]" : "text-[#8b949e]"}`} />
          {link.name}
        </Link>
      );
    });
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-[#30363d]/40 bg-[#0d1117] flex flex-col z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[#30363d]/40">
        <div className="w-8 h-8 rounded-lg bg-[#00e5a0] text-black flex items-center justify-center font-bold mr-3">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <div className="font-['Syne'] font-bold text-lg leading-tight text-white">SmartNav</div>
          <div className="text-[10px] text-[#8b949e] uppercase tracking-wider">Dhaka Navigation</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        {/* Main Links */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-4 px-4">Main</div>
          {renderLinks(links)}
        </div>

        {/* User Links - only if logged in */}
        {isLoggedIn && (
          <div className="mb-8">
            <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-4 px-4">User</div>
            {renderLinks(userLinks)}
          </div>
        )}

        {/* Admin Links */}
        {isLoggedIn && isAdmin && (
          <div>
            <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-4 px-4">Admin</div>
            {renderLinks(adminLinks)}
          </div>
        )}
      </div>

      {/* Auth State */}
      <div className="p-4 border-t border-[#30363d]/40">
        {isLoggedIn ? (
          <div>
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#00e5a0]/20 text-[#00e5a0] flex items-center justify-center text-xs font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{session?.user?.name || "User"}</div>
                <div className="text-[10px] text-[#8b949e] truncate">{session?.user?.email}</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#ff6b8a]/70 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a] transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#8b949e] hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}
