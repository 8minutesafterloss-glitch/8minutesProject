import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCountdownSettings } from '@/hooks/useCountdownSettings';
import { Loader2 } from 'lucide-react';

export default function ArtistPageGate({ children }) {
  const s = useCountdownSettings();
  const [authState, setAuthState] = useState({ checking: true, isAdmin: false });

  useEffect(() => {
    base44.auth.me()
      .then((u) => setAuthState({ checking: false, isAdmin: u?.role === 'admin' }))
      .catch(() => setAuthState({ checking: false, isAdmin: false }));
  }, []);

  if (authState.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (authState.isAdmin) return children;

  const blockUntil = s.artistPageBlockUntil;
  // No date set → blocked by default until a date is configured
  if (!blockUntil) return <Navigate to="/teaser" replace />;

  const blockMs = new Date(blockUntil).getTime();
  if (Number.isNaN(blockMs) || Date.now() < blockMs) {
    return <Navigate to="/teaser" replace />;
  }

  return children;
}