"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Map, Flag, Menu, X, History, Star, Activity, SlidersHorizontal, ShieldAlert, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function MobileNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "admin";

  // Primary 4 tabs for the bottom bar
  const primaryTabs = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Routes", href: "/route-finder", icon: Search },
    { name: "Map", href: "/chaos-map", icon: Map },
    { name: "Report", href: "/report", icon: Flag },
  ];

  // Secondary links for the expanded menu
  const secondaryLinks = [
    { name: "Traffic Data", href: "/traffic", icon: Activity },
    ...(isLoggedIn ? [
      { name: "Trip History", href: "/trip-history", icon: History },
      { name: "Ratings", href: "/ratings", icon: Star },
      { name: "Preferences", href: "/preferences", icon: SlidersHorizontal },
    ] : []),
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Expanded Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#F8F9FA] md:hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center p-4 border-b border-[#DADCE0]">
            <div className="font-['Syne'] font-bold text-lg text-[#202124]">Menu</div>
            <button onClick={toggleMenu} className="p-2 rounded-full bg-[#E8EAED] text-[#202124] min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-2 px-4 mt-4">More Options</div>
            {secondaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px]
                    ${isActive ? "bg-[#1A73E8]/10 text-[#1A73E8]" : "text-[#202124] bg-white border border-[#DADCE0] hover:bg-[#F8F9FA]"}`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-[#1A73E8]" : "text-[#5F6368]"}`} />
                  {link.name}
                </Link>
              );
            })}

            {isLoggedIn && isAdmin && (
              <>
                <div className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-2 px-4 mt-8">Admin</div>
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-[#202124] bg-white border border-[#DADCE0] min-h-[44px]"
                >
                  <ShieldAlert className="w-5 h-5 text-[#D93025]" />
                  Admin Panel
                </Link>
              </>
            )}
          </div>

          <div className="p-6 border-t border-[#DADCE0] bg-white">
            {isLoggedIn ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1A73E8]/20 text-[#1A73E8] flex items-center justify-center font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-base font-bold text-[#202124] truncate">{session?.user?.name}</div>
                    <div className="text-xs text-[#5F6368] truncate">{session?.user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#D93025]/10 text-[#D93025] py-3 rounded-xl font-bold min-h-[44px]"
                >
                  <LogOut className="w-5 h-5" /> Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3 rounded-xl font-bold min-h-[44px]"
              >
                <LogIn className="w-5 h-5" /> Log in
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#DADCE0] z-40 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {primaryTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 min-h-[44px]
                  ${isActive ? "text-[#1A73E8]" : "text-[#5F6368]"}`}
              >
                <tab.icon className={`w-6 h-6 ${isActive ? "fill-[#1A73E8]/20 stroke-2" : "stroke-[1.5px]"}`} />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={toggleMenu}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 min-h-[44px]
              ${isMenuOpen ? "text-[#1A73E8]" : "text-[#5F6368]"}`}
          >
            <Menu className={`w-6 h-6 ${isMenuOpen ? "fill-[#1A73E8]/20 stroke-2" : "stroke-[1.5px]"}`} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
