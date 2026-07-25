'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Code2,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applicants', label: 'Applicants', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#8B0000]">
      {/* Logo */}
      <div className="px-5 py-6 border-b-2 border-[#6B0000] flex items-center gap-3">
        <div
          className="w-9 h-9 bg-white flex items-center justify-center shrink-0"
          style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)' }}
        >
          <Code2 className="w-5 h-5 text-[#8B0000]" />
        </div>
        <div>
          <p className="font-black text-white text-base uppercase tracking-wider leading-none">DevHire</p>
          <p className="text-red-300 text-[10px] uppercase tracking-widest font-bold mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-white text-[#8B0000]'
                  : 'text-white hover:bg-[#A50000] hover:text-white'
              }`}
              style={isActive ? { boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)' } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t-2 border-[#6B0000]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-red-200 hover:bg-[#6B0000] hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-20 border-r-4 border-[#6B0000]">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#8B0000] border-b-4 border-[#6B0000] px-4 py-3 flex items-center justify-between">
        <span className="font-black text-white uppercase tracking-wider">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-8 h-8 bg-white flex items-center justify-center text-[#8B0000]"
          style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)' }}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-white flex items-center justify-center text-[#8B0000] z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
