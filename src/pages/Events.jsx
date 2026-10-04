import React, { useState, useEffect } from 'react';
import { Calendar, User, Check, Infinity as InfinityIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { toast } from '@/components/ui/use-toast';
import { MeetingsProvider, useMeetings } from '@/hooks/useMeetings';

function isFuture(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today;
}

function EventsContent() {
  const { meetings, loading } = useMeetings();
  const [registrations, setRegistrations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [busy, setBusy] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const regRecords = await base44.entities.Registration.list();
        setRegistrations(regRecords);
      } catch {
        // error
      }
      try {
        const user = await base44.auth.me();
        setUserId(user?.id || null);
      } catch {
        setUserId(null);
      }
    }
    load();
  }, []);

  const upcoming = [...meetings]
    .filter((m) => m.showInLobby !== false && isFuture(m.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const isRegistered = (meetingId) =>
    registrations.some((r) => r.event_id === meetingId && r.created_by_id === userId);

  const regCount = (meetingId) =>
    registrations.filter((r) => r.event_id === meetingId).length;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleRegister = async (meetingId) => {
    if (!userId) {
      toast({ title: 'יש להתחבר כדי להירשם', variant: 'destructive' });
      return;
    }
    setBusy((prev) => ({ ...prev, [meetingId]: true }));
    try {
      const reg = await base44.entities.Registration.create({ event_id: meetingId });
      setRegistrations((prev) => [...prev, reg]);
      toast({ title: 'נרשמת בהצלחה!' });
    } catch {
      toast({ title: 'ההרשמה נכשלה', variant: 'destructive' });
    } finally {
      setBusy((prev) => ({ ...prev, [meetingId]: false }));
    }
  };

  const handleCancel = async (meetingId) => {
    const reg = registrations.find(
      (r) => r.event_id === meetingId && r.created_by_id === userId
    );
    if (!reg) return;
    setBusy((prev) => ({ ...prev, [meetingId]: true }));
    try {
      await base44.entities.Registration.delete(reg.id);
      setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
      toast({ title: 'ההרשמה בוטלה' });
    } catch {
      toast({ title: 'ביטול נכשל', variant: 'destructive' });
    } finally {
      setBusy((prev) => ({ ...prev, [meetingId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <InfinityIcon className="w-5 h-5 text-gradient-purple" />
          <span className="text-sm font-medium text-primary/60">המפגשים הקרובים</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">לוח אירועים</h1>
        <p className="text-foreground/60 mt-3 max-w-2xl">
          הירשמי למפגשים הקרובים של מיזם 8 דקות. כל המפגשים מתקיימים בזום, באווירה בטוחה ותומכת.
        </p>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <p className="text-foreground/50">אין מפגשים קרובים כרגע</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((m) => {
            const registered = isRegistered(m.id);
            const count = regCount(m.id);
            return (
              <div
                key={m.id}
                className="flex flex-col rounded-3xl bg-white border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-shadow"
              >
                {m.image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image src={m.image} alt={m.title} className="w-full h-full" fittingType="fill" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-primary/50 mb-3">
                    {m.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(m.date)}
                      </span>
                    )}
                    {m.speakerName && (
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {m.speakerName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-2">{m.title}</h3>
                  {m.why && (
                    <p className="text-sm text-foreground/60 leading-relaxed mb-4 flex-1">
                      {m.why}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
                      {count} רשומות
                    </span>
                    {registered ? (
                      <button
                        onClick={() => handleCancel(m.id)}
                        disabled={busy[m.id]}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/50 text-primary text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        רשומה — ביטול
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(m.id)}
                        disabled={busy[m.id]}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        הירשמי
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Events() {
  return (
    <MeetingsProvider>
      <EventsContent />
    </MeetingsProvider>
  );
}