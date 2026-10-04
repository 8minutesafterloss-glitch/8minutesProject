import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { toast } from '@/components/ui/use-toast';

export default function EditableMeetingField({ meetingId, field, value, className = '', as = 'p', multiline = false, onSave }) {
  const { isAdmin, updateMeeting } = useMeetings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const Tag = as;

  const stop = (e) => { e.preventDefault(); e.stopPropagation(); };

  if (editing) {
    const handleSave = async (e) => {
      stop(e);
      setSaving(true);
      try {
        if (onSave) { await onSave(draft); } else { await updateMeeting(meetingId, field, draft); }
        setEditing(false);
        toast({ title: 'השינוי נשמר בהצלחה' });
      } catch (err) {
        toast({ title: 'השמירה נכשלה', description: err?.message || 'נסי שוב', variant: 'destructive' });
      } finally {
        setSaving(false);
      }
    };
    return (
      <div className="w-full" onClick={stop}>
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-primary/40 bg-white text-foreground text-sm resize-y focus:outline-none focus:border-primary"
            rows={4}
            autoFocus
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-primary/40 bg-white text-foreground text-sm focus:outline-none focus:border-primary"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-purple text-white text-xs font-medium disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            שמור
          </button>
          <button
            onClick={(e) => { stop(e); setEditing(false); }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium"
          >
            <X className="w-3.5 h-3.5" />
            ביטול
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag className={`group relative whitespace-pre-wrap ${className}`}>
      {value}
      {isAdmin && (
        <button
          onClick={(e) => { stop(e); setDraft(value || ''); setEditing(true); }}
          className="inline-flex items-center justify-center w-5 h-5 mr-1 align-middle rounded-md bg-primary/10 hover:bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          title="עריכה"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </Tag>
  );
}