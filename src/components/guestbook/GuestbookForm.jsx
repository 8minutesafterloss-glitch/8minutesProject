import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function GuestbookForm({ exhibitionItems = [], defaultSlug }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [exhibitionItemId, setExhibitionItemId] = useState(defaultSlug || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Unique-by-slug options for the dropdown
  const itemOptions = exhibitionItems
    .filter((item, idx, arr) => arr.findIndex(i => i.slug === item.slug) === idx)
    .map(item => ({ slug: item.slug, label: `${item.artist_name} — ${item.title}` }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('נא למלא שם והודעה');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await base44.entities.GuestbookEntry.create({
        name: name.trim(),
        message: message.trim(),
        exhibition_item_id: exhibitionItemId || undefined,
        is_approved: false
      });
      setSubmitted(true);
      setName('');
      setMessage('');
      setExhibitionItemId('');
    } catch (err) {
      setError('שגיאה בשליחה. נא לנסות שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-6 rounded-2xl bg-accent/30 border border-border/40">
        <CheckCircle2 className="w-10 h-10 text-primary/60 mx-auto mb-3" />
        <p className="text-primary font-medium">תודה רבה! הרשם נשלח וממתין לאישור.</p>
        <Button variant="ghost" className="mt-4 text-primary" onClick={() => setSubmitted(false)}>
          לכתיבת רשם נוסף
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="gb-name" className="text-sm text-foreground/70 mb-1.5 block">שם *</Label>
        <Input id="gb-name" value={name} onChange={e => setName(e.target.value)} placeholder="השם שלך" maxLength={100} />
      </div>
      <div>
        <Label htmlFor="gb-message" className="text-sm text-foreground/70 mb-1.5 block">הרשם שלך *</Label>
        <Textarea id="gb-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="שתפי את הרשמים שלך מהתערוכה..." maxLength={500} rows={4} />
        <p className="text-xs text-foreground/40 mt-1 text-left">{message.length}/500</p>
      </div>
      {itemOptions.length > 0 && !defaultSlug && (
        <div>
          <Label htmlFor="gb-item" className="text-sm text-foreground/70 mb-1.5 block">יצירה (אופציונלי)</Label>
          <select
            id="gb-item"
            value={exhibitionItemId}
            onChange={e => setExhibitionItemId(e.target.value)}
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">רשם כללי על התערוכה</option>
            {itemOptions.map(opt => (
              <option key={opt.slug} value={opt.slug}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting} className="bg-gradient-purple text-white rounded-full px-6 hover:opacity-90">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        שליחת רשם
      </Button>
    </form>
  );
}