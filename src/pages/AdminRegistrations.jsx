import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, ChevronDown, ChevronUp, Users, Loader2, Lock, ShieldCheck, ClipboardList } from 'lucide-react';

export default function AdminRegistrations() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
        if (user?.role === 'admin') {
          const [evs, regs, usrs] = await Promise.all([
            base44.entities.Event.list(),
            base44.entities.Registration.list(),
            base44.entities.User.list(),
          ]);
          evs.sort((a, b) => new Date(a.date) - new Date(b.date));
          setEvents(evs);
          setRegistrations(regs);
          setUsers(usrs);
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const userMap = {};
  users.forEach((u) => { userMap[u.id] = u; });

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatRegDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <p className="text-foreground/60">אין לך הרשאה לצפות בדף זה</p>
        </div>
      </div>
    );
  }

  const totalRegs = registrations.length;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-medium text-primary/60">ניהול</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">רישומים לאירועים</h1>
        <p className="text-foreground/60 mt-3">צפי בנרשמות לכל אירוע ומפגש.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-2xl px-5 py-4 border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 text-foreground/50 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>אירועים</span>
          </div>
          <p className="font-heading text-2xl font-bold text-primary">{events.length}</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 text-foreground/50 text-xs mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>סה"כ רישומים</span>
          </div>
          <p className="font-heading text-2xl font-bold text-primary">{totalRegs}</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <p className="text-foreground/50">אין אירועים עדיין</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {events.map((ev) => {
            const regs = registrations.filter((r) => r.event_id === ev.id);
            const isOpen = expanded === ev.id;
            const full = ev.capacity && regs.length >= ev.capacity;
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : ev.id)}
                  className="w-full p-5 flex items-center gap-4 text-right hover:bg-accent/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold text-foreground truncate">{ev.title}</h3>
                      {full && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium whitespace-nowrap">מלא</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(ev.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {regs.length}{ev.capacity ? `/${ev.capacity}` : ''} נרשמות
                      </span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-foreground/40 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground/40 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-border/30">
                    {regs.length === 0 ? (
                      <p className="text-center text-sm text-foreground/40 py-6">אין נרשמות לאירוע זה עדיין</p>
                    ) : (
                      <div className="divide-y divide-border/20">
                        {regs.map((r) => {
                          const u = userMap[r.created_by_id];
                          return (
                            <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                              <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                                {(u?.full_name || '?')[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{u?.full_name || 'משתמשת לא ידועה'}</p>
                                <p className="text-xs text-foreground/50 truncate">{u?.email || ''}</p>
                              </div>
                              <span className="text-xs text-foreground/40 whitespace-nowrap">{formatRegDate(r.created_date)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}