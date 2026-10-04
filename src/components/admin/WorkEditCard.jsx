import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, ExternalLink, Upload, X, ImageIcon, Trash2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { getImages } from '@/lib/exhibitionUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const WORK_FIELDS = [
  { key: 'title', label: 'שם היצירה', type: 'input' },
  { key: 'sort_order', label: 'סדר תצוגה (SORT)', type: 'number' },
  { key: 'technical_details', label: 'פרטים טכניים', type: 'textarea' },
  { key: 'artwork_story', label: 'סיפור היצירה', type: 'textarea' },
  { key: 'audience_connection', label: 'חיבור לקהל', type: 'textarea' },
];

export default function WorkEditCard({ work, onRefresh }) {
  const [draft, setDraft] = useState(work);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setDraft(work);
  }, [work.id]);

  const changed = JSON.stringify(draft) !== JSON.stringify(work);
  const images = getImages(work);

  const handleField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const buildTextUpdates = () => {
    const updates = {};
    WORK_FIELDS.forEach((f) => {
      if (f.type === 'number') {
        const n = Number(draft[f.key]);
        updates[f.key] = Number.isFinite(n) ? n : 0;
      } else {
        updates[f.key] = draft[f.key] || '';
      }
    });
    return updates;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.ExhibitionItem.update(work.id, buildTextUpdates());
      toast({ title: 'היצירה נשמרה' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה בשמירה', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`למחוק את היצירה "${work.title || ''}"?`)) return;
    setDeleting(true);
    try {
      await base44.entities.ExhibitionItem.delete(work.id);
      toast({ title: 'היצירה נמחקה' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה במחיקה', description: err.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const currentImages = getImages(work);
      const newUrls = [];
      for (const file of Array.from(files)) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        newUrls.push(file_url);
      }
      const allUrls = [...currentImages, ...newUrls];
      await base44.entities.ExhibitionItem.update(work.id, {
        ...buildTextUpdates(),
        images: JSON.stringify(allUrls),
      });
      toast({ title: 'התמונות הועלו' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה בהעלאה', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const currentImages = getImages(work);
      const updatedImages = currentImages.filter((_, i) => i !== index);
      await base44.entities.ExhibitionItem.update(work.id, {
        ...buildTextUpdates(),
        images: JSON.stringify(updatedImages),
      });
      toast({ title: 'התמונה הוסרה' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה במחיקה', variant: 'destructive' });
    }
  };

  return (
    <div className="rounded-2xl border border-border/40 p-5 bg-accent/5">
      {/* file_url preview */}
      {draft.file_url && (
        <div className="rounded-xl border border-border/50 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-1.5 bg-accent/20 border-b border-border/50">
            <span className="text-xs font-medium text-foreground/60">קובץ מהאקסל</span>
            <a
              href={draft.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              פתח <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="px-3 py-2 bg-accent/5 border-b border-border/40">
            <p className="text-[11px] text-foreground/50 break-all leading-relaxed" dir="ltr">{draft.file_url}</p>
          </div>
          {showPreview ? (
            <div className="relative bg-accent/10 cursor-pointer" onClick={() => setShowPreview(false)}>
              <div className="max-w-xs mx-auto">
                <Image src={draft.file_url} alt="תצוגה מקדימה" className="w-full h-auto" fittingType="fit" />
              </div>
              <p className="text-center text-xs text-foreground/40 py-1.5">לחיצה להסתרה</p>
            </div>
          ) : (
            <button
              onClick={() => setShowPreview(true)}
              className="w-full py-2 text-xs text-primary hover:bg-accent/10 transition-colors"
            >
              הצג תצוגה מקדימה
            </button>
          )}
        </div>
      )}

      {/* Work fields */}
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        {WORK_FIELDS.filter((f) => f.type === 'input' || f.type === 'number').map((f) => (
          <div key={f.key} className="space-y-1">
            <Label className="text-xs text-foreground/60">{f.label}</Label>
            <Input
              type={f.type === 'number' ? 'number' : 'text'}
              value={draft[f.key] ?? ''}
              onChange={(e) => handleField(f.key, e.target.value)}
              className="text-sm"
            />
          </div>
        ))}
      </div>
      {WORK_FIELDS.filter((f) => f.type === 'textarea').map((f) => (
        <div key={f.key} className="space-y-1 mb-3">
          <Label className="text-xs text-foreground/60">{f.label}</Label>
          <Textarea value={draft[f.key] || ''} onChange={(e) => handleField(f.key, e.target.value)} rows={3} className="text-sm resize-y" />
        </div>
      ))}

      <div className="flex justify-between mb-4">
        <Button onClick={handleDelete} disabled={deleting} size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
          מחיקת יצירה
        </Button>
        <Button onClick={handleSave} disabled={!changed || saving} size="sm" variant="outline">
          {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          שמירת יצירה
        </Button>
      </div>

      {/* Images */}
      <div className="pt-4 border-t border-border/40">
        <p className="text-xs font-medium text-foreground/60 mb-2">תמונות ({images.length})</p>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-accent/20">
                <Image src={url} alt={`תמונה ${i + 1}`} className="w-full h-full" fittingType="fill" />
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 left-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/10 transition-colors cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
              <span className="text-xs text-foreground/60">מעלה...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-foreground/40" />
              <span className="text-xs text-foreground/60">העלאת תמונות</span>
            </>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}