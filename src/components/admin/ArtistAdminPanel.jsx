import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, Users, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import WorkEditCard from './WorkEditCard';

const SHARED_TEXT = [
  { key: 'artist_name', label: 'שם האמן', type: 'input' },
  { key: 'email', label: 'אימייל', type: 'input' },
  { key: 'slug', label: 'Slug', type: 'input' },
  { key: 'location', label: 'מיקום', type: 'input' },
  { key: 'about_artist', label: 'אודות האמן', type: 'textarea' },
  { key: 'ac_field', label: 'חיבור [H] (AC)', type: 'textarea' },
];

const SHARED_BOOL = [
  { key: 'text_permission', label: 'הרשאת טקסט' },
  { key: 'photo_permission', label: 'הרשאת צילום' },
  { key: 'community_member', label: 'חברת קהילה' },
];

export default function ArtistAdminPanel({ works, onRefresh, onDelete }) {
  const first = works[0];
  const [sharedDraft, setSharedDraft] = useState({});
  const [savingShared, setSavingShared] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingWork, setAddingWork] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const d = {};
    SHARED_TEXT.forEach((f) => (d[f.key] = first[f.key] || ''));
    SHARED_BOOL.forEach((f) => (d[f.key] = !!first[f.key]));
    setSharedDraft(d);
  }, [first.id, first.slug]);

  const sharedChanged =
    SHARED_TEXT.some((f) => sharedDraft[f.key] !== (first[f.key] || '')) ||
    SHARED_BOOL.some((f) => !!sharedDraft[f.key] !== !!first[f.key]);

  const handleSharedField = (key, value) => {
    setSharedDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm(`למחוק את ${first.artist_name} ואת כל ${works.length} היצירות שלה?`)) return;
    setDeleting(true);
    try {
      await base44.entities.ExhibitionItem.deleteMany({ slug: first.slug });
      toast({ title: 'האמן נמחק' });
      onDelete();
    } catch (err) {
      toast({ title: 'שגיאה במחיקה', description: err.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveShared = async () => {
    setSavingShared(true);
    try {
      const updates = {};
      SHARED_TEXT.forEach((f) => (updates[f.key] = sharedDraft[f.key] || ''));
      SHARED_BOOL.forEach((f) => (updates[f.key] = !!sharedDraft[f.key]));
      await base44.entities.ExhibitionItem.updateMany({ slug: first.slug }, { $set: updates });
      toast({ title: `עודכנו ${works.length} יצירות` });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה בשמירה', description: err.message, variant: 'destructive' });
    } finally {
      setSavingShared(false);
    }
  };

  const handleAddWork = async () => {
    setAddingWork(true);
    try {
      await base44.entities.ExhibitionItem.create({
        artist_name: first.artist_name,
        slug: first.slug,
        title: 'יצירה חדשה',
      });
      toast({ title: 'יצירה חדשה נוספה' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה בהוספת יצירה', description: err.message, variant: 'destructive' });
    } finally {
      setAddingWork(false);
    }
  };

  return (
    <div>
      {/* Shared header */}
      <div className="mb-5 pb-5 border-b border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-primary/50" />
          <span className="text-xs text-foreground/50">פרטי אמן — משותף לכל היצירות</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-primary">{first.artist_name}</h2>
        <p className="text-sm text-foreground/50">{works.length} יצירות</p>
      </div>

      {/* Shared fields */}
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        {SHARED_TEXT.filter((f) => f.type === 'input').map((f) => (
          <div key={f.key} className="space-y-1">
            <Label className="text-xs text-foreground/60">{f.label}</Label>
            <Input value={sharedDraft[f.key] || ''} onChange={(e) => handleSharedField(f.key, e.target.value)} className="text-sm" />
          </div>
        ))}
      </div>
      {SHARED_TEXT.filter((f) => f.type === 'textarea').map((f) => (
        <div key={f.key} className="space-y-1 mb-3">
          <Label className="text-xs text-foreground/60">{f.label}</Label>
          <Textarea value={sharedDraft[f.key] || ''} onChange={(e) => handleSharedField(f.key, e.target.value)} rows={3} className="text-sm resize-y" />
        </div>
      ))}
      <div className="flex flex-wrap gap-5 mb-4">
        {SHARED_BOOL.map((f) => (
          <div key={f.key} className="flex items-center gap-2">
            <Switch checked={!!sharedDraft[f.key]} onCheckedChange={(v) => handleSharedField(f.key, v)} />
            <Label className="text-sm text-foreground/70">{f.label}</Label>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-6">
        <Button onClick={handleDelete} disabled={deleting} size="sm" variant="destructive">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
          מחיקת אמן
        </Button>
        <Button onClick={handleSaveShared} disabled={!sharedChanged || savingShared} size="sm">
          {savingShared ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          שמירה לכל היצירות
        </Button>
      </div>

      {/* Works */}
      <div className="space-y-4 pt-5 border-t border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/70">יצירות ({works.length})</h3>
          <Button onClick={handleAddWork} disabled={addingWork} size="sm" variant="outline">
            {addingWork ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
            הוספת יצירה
          </Button>
        </div>
        {works.map((work) => (
          <WorkEditCard key={work.id} work={work} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
}