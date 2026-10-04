import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Loader2, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DEFAULTS } from '@/hooks/useCountdownSettings';

const SETTINGS_KEY = 'countdown_settings';

export default function AdminCountdown() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const recs = await base44.entities.HomeContent.filter({ key: SETTINGS_KEY });
      if (recs.length > 0 && recs[0].value) {
        setSettings({ ...DEFAULTS, ...JSON.parse(recs[0].value) });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const value = JSON.stringify(settings);
      const existing = await base44.entities.HomeContent.filter({ key: SETTINGS_KEY });
      if (existing.length > 0) {
        await base44.entities.HomeContent.update(existing[0].id, { value });
      } else {
        await base44.entities.HomeContent.create({
          key: SETTINGS_KEY,
          value,
          description: 'הגדרות ספירה לאחור בעמוד הבית והתערוכה',
        });
      }
      toast({ title: 'ההגדרות נשמרו' });
    } catch (e) {
      toast({ title: 'שמירה נכשלה', description: e?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 pb-24 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-medium text-primary/60">ניהול תצוגה</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">ניהול ספירה לאחור</h1>
        <p className="text-foreground/60 mt-3">
          הספירה לאחור מופיעה בעמוד הבית ובעמוד התערוכה. ניתן לקבוע את תאריך היעד, תקופת ביניים שבה יוצג השעון עם סימון "נפתח", והאם השעון יהיה לחיץ.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm space-y-6">
        {/* Enabled */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-base font-semibold">הצגת הספירה לאחור</Label>
            <p className="text-sm text-foreground/50 mt-1">האם להציג את השעון בעמודים.</p>
          </div>
          <Switch checked={settings.enabled} onCheckedChange={(v) => update('enabled', v)} />
        </div>

        <hr className="border-border/40" />

        {/* Target date */}
        <div>
          <Label className="text-base font-semibold mb-2 block">תאריך יעד</Label>
          <p className="text-sm text-foreground/50 mb-2">התאריך שאליו מתבצעת הספירה. לאחריו יחל תקופת הביניים (אם מופעלת).</p>
          <Input
            type="datetime-local"
            value={(settings.targetDate || '').slice(0, 16)}
            onChange={(e) => update('targetDate', e.target.value)}
          />
        </div>

        <hr className="border-border/40" />

        {/* Interim */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-base font-semibold">תקופת ביניים</Label>
            <p className="text-sm text-foreground/50 mt-1">
              לאחר תאריך היעד, השעון ימשיך להופיע עם סימון "X" והכיתוב "נפתח" עד סיום תקופת הביניים.
            </p>
          </div>
          <Switch checked={settings.interimEnabled} onCheckedChange={(v) => update('interimEnabled', v)} />
        </div>

        {settings.interimEnabled && (
          <div className="pl-4 border-r-2 border-primary/20 space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">סיום תקופת הביניים</Label>
              <p className="text-sm text-foreground/50 mb-2">לאחר תאריך זה הספירה תיעלם לחלוטין מהמסך.</p>
              <Input
                type="datetime-local"
                value={(settings.interimEndDate || '').slice(0, 16)}
                onChange={(e) => update('interimEndDate', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">כיתוב בתקופת הביניים</Label>
              <Input
                value={settings.openedText}
                onChange={(e) => update('openedText', e.target.value)}
                placeholder="נפתח"
              />
            </div>
          </div>
        )}

        <hr className="border-border/40" />

        {/* Clickable */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-base font-semibold">הפיכה ללחיץ</Label>
            <p className="text-sm text-foreground/50 mt-1">האם השעון יקשר ליעד פנימי או חיצוני.</p>
          </div>
          <Switch checked={settings.clickable} onCheckedChange={(v) => update('clickable', v)} />
        </div>

        {settings.clickable && (
          <div className="pl-4 border-r-2 border-primary/20">
            <Label className="text-sm font-semibold mb-2 block">קישור יעד</Label>
            <p className="text-sm text-foreground/50 mb-2">נתיב פנימי (לדוגמה /register) או כתובת מלאה (https://...).</p>
            <Input
              value={settings.link}
              onChange={(e) => update('link', e.target.value)}
              placeholder="/register"
              dir="ltr"
            />
          </div>
        )}

        <hr className="border-border/40" />

        {/* Artist page block */}
        <div>
          <Label className="text-base font-semibold mb-2 block">תאריך סיום חסימת עמודי אומן</Label>
          <p className="text-sm text-foreground/50 mb-2">
            עד לתאריך זה, עמודי האומנים יהיו חסומים למבקרים ולמשתמשים רגילים וינותבו לעמוד הטיזר. אדמינים ימשיכו להיכנס כרגיל. כל עוד השדה ריק — החסימה תקפה.
          </p>
          <Input
            type="datetime-local"
            value={(settings.artistPageBlockUntil || '').slice(0, 16)}
            onChange={(e) => update('artistPageBlockUntil', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-purple text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          שמירת הגדרות
        </Button>
      </div>
    </div>
  );
}