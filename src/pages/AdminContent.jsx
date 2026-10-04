import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Trash2, Check, X, Loader2, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function AdminContent() {
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [newItem, setNewItem] = useState({ key: '', value: '', category: 'כללי' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const recs = await base44.entities.CenterContent.list();
      setRecords(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function check() {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }
    check();
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newItem.key || !newItem.value) {
      toast({ title: 'נא למלא מפתח ותוכן', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await base44.entities.CenterContent.create({ key: newItem.key, value: newItem.value, category: newItem.category || 'כללי' });
      setNewItem({ key: '', value: '', category: 'כללי' });
      await load();
      toast({ title: 'התוכן נוסף' });
    } catch (e) {
      toast({ title: 'הוספה נכשלה', description: e?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (rec) => {
    setSaving(true);
    try {
      await base44.entities.CenterContent.update(rec.id, { value: editDraft });
      setRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, value: editDraft } : r)));
      setEditingKey(null);
      toast({ title: 'הטקסט נשמר' });
    } catch (e) {
      toast({ title: 'שמירה נכשלה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rec) => {
    if (!confirm(`למחוק את התוכן "${rec.key}"?`)) return;
    try {
      await base44.entities.CenterContent.delete(rec.id);
      setRecords((prev) => prev.filter((r) => r.id !== rec.id));
      toast({ title: 'התוכן נמחק' });
    } catch (e) {
      toast({ title: 'מחיקה נכשלה', variant: 'destructive' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground/60">אין לך הרשאה לצפות בדף זה</p>
      </div>
    );
  }

  const filtered = records.filter(
    (r) => !search || r.key?.includes(search) || r.value?.includes(search) || r.category?.includes(search)
  );
  const categories = [...new Set(filtered.map((r) => r.category || 'כללי'))].sort();

  return (
    <div className="p-6 lg:p-10 pb-24">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-medium text-primary/60">ניהול תוכן</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">ניהול תוכן המרכז האישי</h1>
        <p className="text-foreground/60 mt-3">עריכת טקסטים ומדריכים שמופיעים במרכז האישי. שינויים נשמרים ישירות ומופיעים מיד באתר.</p>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm mb-8">
        <h2 className="font-heading text-lg font-bold text-[#2D293A] mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          הוספת תוכן חדש
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <input
            value={newItem.key}
            onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
            placeholder="מפתח (לדוגמה: coaching_title)"
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            placeholder="קטגוריה"
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-purple text-white text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            הוסף
          </button>
        </div>
        <textarea
          value={newItem.value}
          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          placeholder="תוכן הטקסט..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm resize-y focus:outline-none focus:border-primary"
        />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-foreground/30 absolute right-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי מפתח, תוכן או קטגוריה..."
          className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-foreground/40">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>אין תוכן עדיין. הוסיפי טקסט חדש למעלה, או עריכי טקסטים ישירות בדפי המרכז האישי (רחף מעל טקסט ולחצי על סמל העיפרון).</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="font-heading text-sm font-bold text-foreground/50 mb-3 uppercase tracking-wide">{cat}</h3>
              <div className="space-y-3">
                {filtered.filter((r) => (r.category || 'כללי') === cat).map((rec) => (
                  <div key={rec.id} className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-xs text-primary/70 bg-accent/40 px-2 py-1 rounded-md">{rec.key}</code>
                      <button
                        onClick={() => handleDelete(rec)}
                        className="p-1.5 rounded-lg text-foreground/30 hover:text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {editingKey === rec.id ? (
                      <div>
                        <textarea
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          rows={Math.max(3, Math.ceil(editDraft.length / 50))}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-primary/40 bg-white text-sm resize-y focus:outline-none focus:border-primary"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(rec)}
                            disabled={saving}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-purple text-white text-sm font-medium disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" /> שמור
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium"
                          >
                            <X className="w-4 h-4" /> ביטול
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        onClick={() => { setEditingKey(rec.id); setEditDraft(rec.value); }}
                        className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap cursor-text hover:bg-accent/20 rounded-lg p-2 -m-2 transition-colors"
                      >
                        {rec.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}