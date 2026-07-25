'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Code2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validations/authSchema';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || 'Invalid credentials');
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{
        backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.85)), url("https://images.unsplash.com/photo-1604147495798-57beb5d6af73?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-[500px]">
        {/* Header mark */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-3 px-5 py-3 bg-[#8B0000] border-2 border-[#111111]"
            style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.85)' }}
          >
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <Code2 className="w-4 h-4 text-[#8B0000]" />
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-wider text-sm leading-none">DevHire</p>
              <p className="text-red-200 text-[10px] uppercase tracking-widest font-bold">Admin</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-white border-2 border-[#111111] flex flex-col min-h-[500px]"
          style={{ boxShadow: '6px 6px 0 0 rgba(0,0,0,0.85)' }}
        >
          <div className="border-b-4 border-[#8B0000] px-10 py-8 bg-[#FFF8F8]">
            <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Sign In</h1>
            <p className="text-sm text-[#71717A] font-medium mt-1">Restricted to authorized admins only</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-7 flex-1 flex flex-col justify-center">
            <div>
              <label className="input-label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="admin@company.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-sm uppercase tracking-widest mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
