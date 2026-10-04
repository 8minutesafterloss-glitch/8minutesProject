import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-א-ת]/g, '')
    .replace(/-+/g, '-');
}

const EMPTY_FORM = {
  number: '',
  slug: '',
  title: '',
  date: '',
  image: '',
  why: '',
  speakerName: '',
  speakerBio: '',
  takeaway: '',
  registrationLink: '',
  showInLobby: false,
};

export default function MeetingForm({ meeting, open, onClose, onSave }) {
  const isEdit = !!meeting;
  const [form, setForm] = useState(EMPTY_FORM);
  const [points, setPoints] = useState([{ title: '', text: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (meeting) {
      let parsedPoints = [];
      try {
        parsedPoints = typeof meeting.points === 'string' ? JSON.parse(meeting.points) : (meeting.points || []);
      } catch {
        parsedPoints = [];
      }
      setForm({
        number: meeting.number ?? '',
        slug: meeting.slug || '',
        title: meeting.title || '',
        date: meeting.date || '',
        image: meeting.image || '',
        why: meeting.why || '',
        speakerName: meeting.speakerName || '',
        speakerBio: meeting.speakerBio || '',
        takeaway: meeting.takeaway || '',
        registrationLink: meeting.registrationLink || '',
        showInLobby: meeting.showInLobby !== false,
      });
      setPoints(parsedPoints.length > 0 ? parsedPoints : [{ title: '', text: '' }]);
    } else {
      setForm(EMPTY_FORM);
      setPoints([{ title: '', text: '' }]);
    }
  }, [meeting, open]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handlePointChange = (index, field, value) =>
    setPoints(prev => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  const addPoint = () => setPoints(prev => [...prev, { title: '', text: '' }]);
  const removePoint = (index) => setPoints(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        number: form.number ? Number(form.number) : undefined,
        slug: form.slug || slugify(form.title),
        points: JSON.stringify(points.filter(p => p.title || p.text)),
      };
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'עריכת מפגש' : 'הוספת מפגש חדש'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="number">מספר</Label>
              <Input id="number" type="number" value={form.number} onChange={(e) => handleChange('number', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (כתובת)</Label>
              <Input id="slug" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="אוטומטי מהכותרת" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">כותרת *</Label>
            <Input id="title" required value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">תאריך</Label>
              <Input id="date" type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image">כתובת תמונה</Label>
              <Input id="image" value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="URL" dir="ltr" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="registrationLink">לינק לטופס הרשמה</Label>
            <Input id="registrationLink" value={form.registrationLink} onChange={(e) => handleChange('registrationLink', e.target.value)} placeholder="URL" dir="ltr" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/40 p-4 bg-muted/30">
            <div>
              <Label htmlFor="showInLobby" className="mb-1">הצג בלובי</Label>
              <p className="text-xs text-foreground/50">כשמכובה, המפגש לא יופיע באתר הציבורי</p>
            </div>
            <Switch
              id="showInLobby"
              checked={form.showInLobby}
              onCheckedChange={(v) => handleChange('showInLobby', v)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="why">למה דווקא על הנושא הזה</Label>
            <Textarea id="why" value={form.why} onChange={(e) => handleChange('why', e.target.value)} rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="speakerName">שם המרצה</Label>
            <Input id="speakerName" value={form.speakerName} onChange={(e) => handleChange('speakerName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="speakerBio">אודות המרצה</Label>
            <Textarea id="speakerBio" value={form.speakerBio} onChange={(e) => handleChange('speakerBio', e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>נקודות עיקריות</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPoint}>
                <Plus className="w-4 h-4 ml-1" />
                הוסף נקודה
              </Button>
            </div>
            {points.map((p, i) => (
              <div key={i} className="flex gap-2 items-start border border-border/40 rounded-xl p-3 bg-muted/30">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="כותרת הנקודה"
                    value={p.title}
                    onChange={(e) => handlePointChange(i, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="תוכן הנקודה"
                    value={p.text}
                    onChange={(e) => handlePointChange(i, 'text', e.target.value)}
                    rows={2}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePoint(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="takeaway">מסקנה / לקח</Label>
            <Textarea id="takeaway" value={form.takeaway} onChange={(e) => handleChange('takeaway', e.target.value)} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              ביטול
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-purple text-white">
              {saving ? 'שומר...' : 'שמור'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}