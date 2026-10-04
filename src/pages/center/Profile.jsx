import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Calendar, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setBio(u.bio || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ bio });
      toast({ title: 'הפרופיל עודכן בהצלחה' });
    } catch {
      toast({ title: 'העדכון נכשל', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D293A] mb-2">פרופיל</h1>
      <p className="text-foreground/55 mb-10">המידע האישי שלך במרחב המוגן.</p>

      <div className="bg-white rounded-3xl p-7 border border-border/40 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {(user?.full_name || '?')[0]}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-[#2D293A]">{user?.full_name || 'ללא שם'}</h2>
            <p className="text-sm text-foreground/50">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground/60 mb-1.5 block">אודותייך</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="ספרי קצת על עצמך..."
              rows={4}
              className="resize-y"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-purple text-white rounded-full px-6">
            {saving ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> שומר...</> : <><Save className="w-4 h-4 ml-2" /> שמור</>}
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-border/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAE8EE] flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-[#2D293A]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-foreground/50">אימייל</p>
            <p className="text-sm font-medium text-[#2D293A] truncate">{user?.email}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAE8EE] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#2D293A]" />
          </div>
          <div>
            <p className="text-xs text-foreground/50">חברה מאז</p>
            <p className="text-sm font-medium text-[#2D293A]">{user?.created_date ? new Date(user.created_date).toLocaleDateString('he-IL') : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}