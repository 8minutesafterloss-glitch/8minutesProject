import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, UserPlus } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u0590-\u05FF-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AddArtistDialog({ open, onOpenChange, onCreated }) {
  const [artistName, setArtistName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slugTouched && artistName) {
      setSlug(slugify(artistName));
    }
  }, [artistName, slugTouched]);

  useEffect(() => {
    if (!open) {
      setArtistName('');
      setSlug('');
      setTitle('');
      setSlugTouched(false);
    }
  }, [open]);

  const canCreate = artistName.trim() && slug.trim();

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    try {
      const created = await base44.entities.ExhibitionItem.create({
        artist_name: artistName.trim(),
        slug: slug.trim(),
        title: title.trim() || 'יצירה ראשונה',
      });
      toast({ title: 'האמן נוסף בהצלחה' });
      onOpenChange(false);
      onCreated(slug.trim());
    } catch (err) {
      toast({ title: 'שגיאה ביצירה', description: err.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2 justify-end">
            <UserPlus className="w-5 h-5 text-primary" />
            הוספת אמן חדש
          </DialogTitle>
          <DialogDescription className="text-right">
            צרי רשומת אמן חדשה. ניתן לערוך את שאר הפרטים לאחר היצירה.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">שם האמן</Label>
            <Input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="לדוגמה: נורה כהן"
              className="text-right"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Slug (מזהה ייחודי לכתובת)</Label>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="נוצר אוטומטית מהשם"
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">שם היצירה הראשונה (אופציונלי)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="יצירה ראשונה"
              className="text-right"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            ביטול
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate || creating}>
            {creating ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <UserPlus className="w-4 h-4 ml-2" />}
            צירת אמן
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}