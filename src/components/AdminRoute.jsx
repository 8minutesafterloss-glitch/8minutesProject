import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function AdminRoute() {
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    async function check() {
      try {
        const user = await base44.auth.me();
        setState({ loading: false, isAdmin: user?.role === 'admin' });
      } catch {
        setState({ loading: false, isAdmin: false });
      }
    }
    check();
  }, []);

  if (state.loading) {
    return <DefaultFallback />;
  }

  if (!state.isAdmin) {
    return <Navigate to="/under-construction" replace />;
  }

  return <Outlet />;
}