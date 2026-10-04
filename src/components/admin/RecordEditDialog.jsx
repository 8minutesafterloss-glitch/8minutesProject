import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const TEXT_FIELDS = [
  { key: 'title', label: 'שם היצירה', type: 'input' },
  { key: 'artist_name', label: 'שם האמן', type: 'input' },
  { key: 'slug', label: 'Slug', type: 'input' },
  { key: 'email', label: 'אימייל', type: 'input' },
  { key: 'location', label: 'מיקום', type: 'input' },
  { key: 'age', label: 'גיל', type: 'input' },
  { key: 'image_url', label: 'URL תמונה', type: 'input' },
  { key: 'file_url', label: 'URL קובץ', type: 'input' },
  { key: 'about_artist', label: 'אודות האמן', type: 'textarea' },
  { key: 'ac_field', label: 'חיבור [H] (AC)', type: 'textarea' },
  { key: 'artwork_story', label: 'סיפור היצירה', type: 'textarea' },
  { key: 'audience_connection', label: 'חיבור לקהל', type: 'textarea' },
  { key: 'technical_details', label: 'פרטים טכניים', type: 'textarea' },
  { key: 'images', label: 'תמונות (JSON - מערך URLים)', type: 'textarea' },
];

const BOOL_FIELDS = [
  { key: 'community_member', label: 'חברת קהילה' },
  { key: 'text_permission', label: 'הרשאת טקסט' },
  { key: 'photo_permission', label: 'הרשאת צילום' },
];

export default function RecordEditDialog({ record, open, onOpenChange, onSaved }) {
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (record) {
      const d = {};
      TEXT_FIELDS.forEach((f) => (d[f.key] = record[f.key] || ''));
      BOOL_FIELDS.forEach((f) => (d[f.key] = !!record[f.key]));
      setDraft(d);
    }
  }, [record]);

  if (!record) return null;

  const handleField = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {};
      TEXT_FIELDS.forEach((f) => (updates[f.key] = draft[f.key] || ''));
      BOOL_FIELDS.forEach((f) => (updates[f.key] = !!draft[f.key]));
      await base44.entities.ExhibitionItem.update(record.id, updates);
      toast({ title: 'הרשומה נשמרה' });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast({ title: 'שגיאה בשמירה', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">עריכת רשומה</DialogTitle>
          <DialogDescription className="text-right">
            {record.artist_name} — {record.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3">
          {TEXT_FIELDS.filter((f) => f.type === 'input').map((f) => (
            <div key={f.key} className="space-y-1">
              <Label className="text-xs text-foreground/60">{f.label}</Label>
              <Input
                value={draft[f.key] || ''}
                onChange={(e) => handleField(f.key, e.target.value)}
                className="text-sm"
                dir={f.key === 'slug' || f.key === 'email' || f.key === 'image_url' || f.key === 'file_url' ? 'ltr' : 'rtl'}
              />
            </div>
          ))}
        </div>

        {TEXT_FIELDS.filter((f) => f.type === 'textarea').map((f) => (
          <div key={f.key} className="space-y-1 mt-3">
            <Label className="text-xs text-foreground/60">{f.label}</Label>
            <Textarea
              value={draft[f.key] || ''}
              onChange={(e) => handleField(f.key, e.target.value)}
              rows={3}
              className="text-sm resize-y"
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-5 mt-3 pt-3 border-t border-border/50">
          {BOOL_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <Switch checked={!!draft[f.key]} onCheckedChange={(v) => handleField(f.key, v)} />
              <Label className="text-sm text-foreground/70">{f.label}</Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
            שמירה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}