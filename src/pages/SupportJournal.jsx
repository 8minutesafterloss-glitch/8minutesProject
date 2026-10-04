import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Loader2, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SupportPageHeader from '@/components/support/SupportPageHeader';
import { useToast } from '@/components/ui/use-toast';

const MAX_CHARS = 1000;
const MAX_PER_DAY = 3;

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function isSameDay(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export default function SupportJournal() {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      const data = await base44.entities.JournalEntry.list('-created_date', 100);
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const todayCount = entries.filter((e) => isSameDay(e.created_date)).length;
  const reachedDailyLimit = todayCount >= MAX_PER_DAY;

  const handleSave = async () => {
    if (!text.trim()) return;
    if (text.length > MAX_CHARS) return;
    if (reachedDailyLimit) return;

    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({ text: text.trim() });
      setText('');
      setShowForm(false);
      await loadEntries();
      toast({ title: 'הרשומה נשמרה' });
    } catch (err) {
      console.error(err);
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.JournalEntry.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      toast({ title: 'שגיאה במחיקה', variant: 'destructive' });
    }
  };

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <SupportPageHeader
        backTo="/center/support"
        title="יומן אישי"
        subtitle="מקום בטוח לכתוב."
        icon={BookOpen}
      />

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={reachedDailyLimit}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#4B3F72] text-white font-semibold hover:bg-[#3E3260] transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>רשומה חדשה</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EDEDED] p-5 mb-8 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="מה עולה לך על הלב?"
            className="w-full min-h-[140px] resize-none rounded-xl border border-[#E5E5EA] p-4 text-sm text-[#2D2A35] focus:outline-none focus:ring-2 focus:ring-[#4B3F72]/30"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E8E93]">{text.length} / {MAX_CHARS}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowForm(false); setText(''); }}
                className="px-4 py-2 rounded-full text-sm font-medium text-[#8E8E93] hover:bg-[#F2F2F7] transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !text.trim()}
                className="px-6 py-2 rounded-full text-sm font-semibold bg-[#4B3F72] text-white hover:bg-[#3E3260] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'שמור'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reachedDailyLimit && (
        <p className="text-center text-sm text-[#8E8E93] mb-6">
          הגעת למכסה היומית ({MAX_PER_DAY} רשומות ביום). נשמח לקרוא אותך שוב מחר.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#8E8E93]" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">עדיין אין רשומות ביומן.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-[#EDEDED] p-4 flex items-start gap-3 group"
            >
              <div className="flex-1">
                <div className="text-xs text-[#8E8E93] mb-1">{formatDateTime(e.created_date)}</div>
                <div className="text-sm text-[#2D2A35] whitespace-pre-wrap leading-relaxed">{e.text}</div>
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                className="opacity-0 group-hover:opacity-100 text-[#C7C7CC] hover:text-red-400 transition-all flex-shrink-0 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}