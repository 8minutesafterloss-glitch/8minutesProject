import React from 'react';
import { Sparkles, History } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import { MeetingsProvider, useMeetings } from '@/hooks/useMeetings';
import MeetingCard from '@/components/meetings/MeetingCard';

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d >= today;
}

function MeetingsContent() {
  const { meetings, loading } = useMeetings();
  const visible = meetings.filter((m) => m.showInLobby !== false);
  const upcoming = visible.
  filter((m) => isUpcoming(m.date)).
  sort((a, b) => (a.number || 0) - (b.number || 0));
  const past = visible.
  filter((m) => !isUpcoming(m.date)).
  sort((a, b) => (b.number || 0) - (a.number || 0));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-20 pb-6 px-6 lg:px-8 bg-soft-lavender overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">מפגשי פרויקט ה'רגעים הריקים'

          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            אחת לשבועיים מתקיימים מפגשי זום עם נשות ואנשי מקצוע מתחומים שונים, במטרה להעניק ידע, כלים ותקווה לנשים ולמשפחות המתמודדות עם האובדן.
          </p>
        </div>
      </section>

      <section className="pt-6 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ?
          <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div> :
          upcoming.length === 0 && past.length === 0 ?
          <p className="text-center text-foreground/50 py-20">אין מפגשים עדיין</p> :

          <div className="space-y-16">
              {/* Upcoming */}
              {upcoming.length > 0 &&
            <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-purple text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-primary">מפגשים קרובים</h2>
                      <p className="text-sm text-foreground/50">ההרשמה פתוחה — מוזמנות להצטרף</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((m) =>
                <MeetingCard key={m.slug} meeting={m} upcoming />
                )}
                  </div>
                </div>
            }

              {/* Past */}
              {past.length > 0 &&
            <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-primary/60">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground/70">מפגשים שהתקיימו</h2>
                      <p className="text-sm text-foreground/50">תיעוד מפגשים קודמים לצפייה</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((m) =>
                <MeetingCard key={m.slug} meeting={m} />
                )}
                  </div>
                </div>
            }
            </div>
          }
        </div>
      </section>
    </div>);

}

export default function Meetings() {
  return (
    <MeetingsProvider>
      <MeetingsContent />
    </MeetingsProvider>);

}