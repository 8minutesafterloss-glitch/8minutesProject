import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Trash2, Loader2, Clock, CheckCircle2, Edit2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminGuestbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.GuestbookEntry.list('-created_date', 200);
      setEntries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await base44.entities.GuestbookEntry.update(id, { is_approved: true });
    load();
  };

  const unapprove = async (id) => {
    await base44.entities.GuestbookEntry.update(id, { is_approved: false });
    load();
  };

  const remove = async (id) => {
    if (!confirm('למחוק את הרשומה?')) return;
    await base44.entities.GuestbookEntry.delete(id);
    load();
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditMessage(entry.message);
  };

  const saveEdit = async (id) => {
    await base44.entities.GuestbookEntry.update(id, { name: editName.trim(), message: editMessage.trim() });
    setEditingId(null);
    load();
  };

  const filtered = entries.filter(e => {
    if (filter === 'pending') return !e.is_approved;
    if (filter === 'approved') return e.is_approved;
    return true;
  });

  const pendingCount = entries.filter(e => !e.is_approved).length;
  const approvedCount = entries.filter(e => e.is_approved).length;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary/40" /></div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">ספר אורחים</h1>
        <p className="text-foreground/60 mt-3">
          אישור, עריכה ומחיקה של רשומות.
          {pendingCount > 0 && <span className="text-primary font-medium"> {pendingCount} ממתינות לאישור.</span>}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'pending', label: 'ממתינות', count: pendingCount },
          { key: 'approved', label: 'מאושרות', count: approvedCount },
          { key: 'all', label: 'הכל', count: entries.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-gradient-purple text-white'
                : 'bg-accent/40 text-foreground/60 hover:bg-accent/60'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-foreground/50 py-20">אין רשומות להצגה</p>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {filtered.map(entry => (
            <div
              key={entry.id}
              className={`rounded-2xl border p-5 ${
                entry.is_approved ? 'bg-white border-border/40' : 'bg-accent/20 border-primary/20'
              }`}
            >
              {editingId === entry.id ? (
                <div className="space-y-3">
                  <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="שם" />
                  <Textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} rows={3} placeholder="הודעה" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(entry.id)} className="bg-gradient-purple text-white">
                      <Save className="w-4 h-4" /> שמירה
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" /> ביטול
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-heading font-bold text-primary">{entry.name}</h4>
                      <span className="text-xs text-foreground/40">
                        {new Date(entry.created_date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    {entry.is_approved ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="w-4 h-4" /> מאושר
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-primary/60">
                        <Clock className="w-4 h-4" /> ממתין
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/70 leading-relaxed whitespace-pre-line mb-3">{entry.message}</p>
                  {entry.exhibition_item_id && (
                    <p className="text-xs text-foreground/40 mb-3">מקושר ליצירה: {entry.exhibition_item_id}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {!entry.is_approved && (
                      <Button size="sm" onClick={() => approve(entry.id)} className="bg-gradient-purple text-white">
                        <Check className="w-4 h-4" /> אישור
                      </Button>
                    )}
                    {entry.is_approved && (
                      <Button size="sm" variant="outline" onClick={() => unapprove(entry.id)}>
                        בטל אישור
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => startEdit(entry)}>
                      <Edit2 className="w-4 h-4" /> עריכה
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" /> מחיקה
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}