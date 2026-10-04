import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import { toast } from '@/components/ui/use-toast';

export default function EditableText({ contentKey, fallback = '', className = '', as = 'p' }) {
  const { content, loading, isAdmin, updateContent } = useHomeContent();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const Tag = as;
  const value = content[contentKey] ?? fallback;

  if (loading) {
    return <Tag className={className}>{fallback}</Tag>;
  }

  if (editing) {
    const handleSave = async () => {
      setSaving(true);
      try {
        await updateContent(contentKey, draft);
        setEditing(false);
        toast({ title: 'הטקסט נשמר בהצלחה' });
      } catch (e) {
        toast({ title: 'השמירה נכשלה', description: e?.message || 'נסי שוב', variant: 'destructive' });
      } finally {
        setSaving(false);
      }
    };
    return (
      <div className="w-full">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-primary/40 bg-white text-foreground text-base resize-y focus:outline-none focus:border-primary"
          rows={Math.max(2, Math.ceil(draft.length / 60))}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-purple text-white text-sm font-medium disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            שמור
          </button>
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium"
          >
            <X className="w-4 h-4" />
            ביטול
          </button>
        </div>
      </div>
    );
  }

  // Render **bold** segments as <strong>
  const renderValue = (text) => {
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <Tag className={`group relative whitespace-pre-wrap ${className}`}>
      {renderValue(value)}
      {isAdmin && (
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="inline-flex items-center justify-center w-6 h-6 mr-1 align-middle rounded-md bg-primary/10 hover:bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          title="עריכת טקסט"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </Tag>
  );
}