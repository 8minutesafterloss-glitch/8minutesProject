import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';
import { Search, ShieldCheck, Lock } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
        if (user?.role === 'admin') {
          const records = await base44.entities.User.list();
          setUsers(records);
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    try {
      await base44.entities.User.update(uid, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u)));
      toast({ title: 'התפקיד עודכן בהצלחה' });
    } catch {
      toast({ title: 'עדכון התפקיד נכשל', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('he-IL');
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <p className="text-foreground/60">אין לך הרשאה לצפות בדף זה</p>
        </div>
      </div>
    );
  }

  const filtered = users.filter(
    (u) =>
      (u.full_name || '').includes(search) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-medium text-primary/60">ניהול</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">ניהול משתמשים</h1>
        <p className="text-foreground/60 mt-3">צפי בחברי הקהילה ונהל את רמות הגישה שלהם.</p>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם או אימייל..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden bg-white overflow-x-auto">
        <table className="w-full text-right min-w-[500px]">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr className="text-xs font-medium text-foreground/50">
              <th className="p-4">שם</th>
              <th className="p-4 hidden sm:table-cell">אימייל</th>
              <th className="p-4">תפקיד</th>
              <th className="p-4 hidden md:table-cell">תאריך הצטרפות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                      {(u.full_name || '?')[0]}
                    </div>
                    <span className="font-medium text-foreground">{u.full_name || 'ללא שם'}</span>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell text-foreground/60 text-sm">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="user">משתמשת</option>
                    <option value="admin">מנהלת</option>
                  </select>
                </td>
                <td className="p-4 hidden md:table-cell text-foreground/50 text-sm">
                  {formatDate(u.created_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-foreground/40 py-12">אין תוצאות</p>
        )}
      </div>
      <p className="text-sm text-foreground/40 mt-4">{filtered.length} משתמשות</p>
    </div>
  );
}