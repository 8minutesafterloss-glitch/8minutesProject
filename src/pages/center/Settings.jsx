import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Lock, LogOut, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const TOGGLES = [
  { key: 'meetings', label: 'עדכונים על מפגשים', description: 'הודעות על מפגשים חדשים וזום' },
  { key: 'events', label: 'אירועים קרובים', description: 'תזכורות על אירועים והרשמות' },
  { key: 'community', label: 'פעילות קהילתית', description: 'הודעות מהקהילה ופורומים' },
];

export default function Settings() {
  const [notifications, setNotifications] = useState({ meetings: true, events: true, community: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setNotifications(u.notification_prefs || { meetings: true, events: true, community: false });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await base44.auth.updateMe({ notification_prefs: updated });
      toast({ title: 'ההגדרות נשמרו' });
    } catch {
      toast({ title: 'השמירה נכשלה', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/');
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
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D293A] mb-2">הגדרות</h1>
      <p className="text-foreground/55 mb-10">נהלי את העדפות החשבון שלך.</p>

      <div className="bg-white rounded-3xl p-7 border border-border/40 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-[#2D293A]" />
          <h2 className="font-heading text-lg font-bold text-[#2D293A]">הודעות ועדכונים</h2>
        </div>
        <div className="space-y-5">
          {TOGGLES.map(t => (
            <div key={t.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#2D293A]">{t.label}</p>
                <p className="text-xs text-foreground/50 mt-0.5">{t.description}</p>
              </div>
              <Switch checked={!!notifications[t.key]} onCheckedChange={() => handleToggle(t.key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-7 border border-border/40 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-[#2D293A]" />
          <h2 className="font-heading text-lg font-bold text-[#2D293A]">פרטיות</h2>
        </div>
        <p className="text-sm text-foreground/55 leading-relaxed">
          המידע שלך מאוחסן במרחב מוגן. רק לך יש גישה לפרטים האישיים שלך. הנתונים אינם משותפים עם צד שלישי.
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-3xl p-5 border border-border/40 shadow-sm flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">התנתקי</span>
      </button>
    </div>
  );
}