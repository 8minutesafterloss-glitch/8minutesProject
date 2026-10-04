import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const CenterContentContext = createContext(null);

export function CenterContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = useCallback(async () => {
    try {
      const recs = await base44.entities.CenterContent.list();
      setRecords(recs);
      const map = {};
      recs.forEach((r) => { map[r.key] = r.value; });
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
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateContent = useCallback(async (key, value, category) => {
    const existing = records.find((r) => r.key === key);
    if (existing) {
      await base44.entities.CenterContent.update(existing.id, { value, category: category || existing.category });
      setRecords((prev) => prev.map((r) => (r.id === existing.id ? { ...r, value, category: category || r.category } : r)));
    } else {
      const rec = await base44.entities.CenterContent.create({ key, value, category: category || 'כללי' });
      setRecords((prev) => [...prev, rec]);
    }
    setContent((prev) => ({ ...prev, [key]: value }));
  }, [records]);

  const deleteContent = useCallback(async (key) => {
    const existing = records.find((r) => r.key === key);
    if (!existing) return;
    await base44.entities.CenterContent.delete(existing.id);
    setRecords((prev) => prev.filter((r) => r.id !== existing.id));
    setContent((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [records]);

  return (
    <CenterContentContext.Provider value={{ content, records, loading, isAdmin, updateContent, deleteContent, reload: load }}>
      {children}
    </CenterContentContext.Provider>
  );
}

export function useCenterContent() {
  const ctx = useContext(CenterContentContext);
  if (!ctx) throw new Error('useCenterContent must be used within CenterContentProvider');
  return ctx;
}