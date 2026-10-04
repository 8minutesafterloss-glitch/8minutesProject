import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const HomeContentContext = createContext(null);

export function HomeContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const records = await base44.entities.HomeContent.list();
        const map = {};
        records.forEach(r => { map[r.key] = r.value; });
        setContent(map);
      } catch {
        // fallbacks will be used
      } finally {
        setLoading(false);
      }
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }
    load();
  }, []);

  const updateContent = useCallback(async (key, value) => {
    const existing = await base44.entities.HomeContent.filter({ key });
    if (existing.length > 0) {
      await base44.entities.HomeContent.update(existing[0].id, { value });
    } else {
      await base44.entities.HomeContent.create({ key, value });
    }
    setContent(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <HomeContentContext.Provider value={{ content, loading, isAdmin, updateContent }}>
      {children}
    </HomeContentContext.Provider>
  );
}

export function useHomeContent() {
  const ctx = useContext(HomeContentContext);
  if (!ctx) throw new Error('useHomeContent must be used within HomeContentProvider');
  return ctx;
}