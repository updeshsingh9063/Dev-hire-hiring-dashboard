'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Settings2 } from 'lucide-react';

export default function SettingsPage() {
  const [adminEmail, setAdminEmail] = useState('admin@devhire.com');

  useEffect(() => {
    // Read the current session to get the real admin email
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data?.email) setAdminEmail(data.email);
      })
      .catch(() => {}); // fallback to default
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#8B0000] mb-1">Admin</p>
        <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Settings</h1>
      </div>

      <div
        className="bg-white border-2 border-[#111111] overflow-hidden"
        style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b-4 border-[#8B0000] bg-[#FFF8F8]">
          <Settings2 className="w-4 h-4 text-[#8B0000]" />
          <h2 className="font-black text-[#111111] uppercase tracking-wider text-xs">Profile Settings</h2>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              disabled
              value={adminEmail}
              className="input-field bg-[#F4F4F5] text-[#71717A] cursor-not-allowed"
            />
            <p className="text-xs text-[#71717A] mt-1.5 font-medium">Email cannot be changed</p>
          </div>

          <div>
            <label className="input-label">Display Name</label>
            <input
              type="text"
              placeholder="Admin User"
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Change Password</label>
            <input
              type="password"
              placeholder="New password"
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="input-field"
            />
          </div>

          <div className="pt-4 border-t-2 border-[#E4E4E7]">
            <button type="submit" className="btn-primary px-8 py-3 text-sm uppercase tracking-widest">
              Save Changes →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
