import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, User, Sparkles, Heart } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { MeetingsProvider, useMeetings } from '@/hooks/useMeetings';
import EditableMeetingField from '@/components/meetings/EditableMeetingField';
import ShareButtons from '@/components/ShareButtons';

function MeetingDetailContent() {
  const { slug } = useParams();
  const { meetings, loading, updateMeeting, updateMeetingPoint } = useMeetings();
  const meeting = meetings.find(m => m.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">המפגש לא נמצא</p>
          <Link to="/meetings" className="text-primary font-medium hover:underline">
            חזרה לכל המפגשים
          </Link>
        </div>
      </div>
    );
  }

  let points = [];
  try {
    points = typeof meeting.points === 'string' ? JSON.parse(meeting.points) : (meeting.points || []);
  } catch {
    points = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/meetings" className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה למפגשים
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary font-heading">8 דקות</span>
          </Link>
        </nav>
      </header>

      <article className="px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <EditableMeetingField
            meetingId={meeting.id}
            field="title"
            value={meeting.title}
            as="h1"
            className="font-heading text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight"
          />

          <div className="rounded-3xl overflow-hidden mb-10 border border-border/50 shadow-lg shadow-primary/10">
            <Image
              src={meeting.image}
              alt={meeting.title}
              className="w-full h-auto"
              fittingType="fit"
            />
          </div>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">למה בחרנו לדבר דווקא על הנושא הזה?</h2>
            <EditableMeetingField
              meetingId={meeting.id}
              field="why"
              value={meeting.why}
              as="p"
              multiline
              className="text-lg text-foreground/70 leading-relaxed"
            />
          </section>

          <section className="mb-10 p-6 rounded-2xl bg-accent/30 border border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-primary/60" />
              <h2 className="font-heading text-xl font-bold text-primary">מי המרצה?</h2>
            </div>
            <EditableMeetingField
              meetingId={meeting.id}
              field="speakerName"
              value={meeting.speakerName}
              as="p"
              className="font-semibold text-primary mb-2"
            />
            <EditableMeetingField
              meetingId={meeting.id}
              field="speakerBio"
              value={meeting.speakerBio}
              as="p"
              multiline
              className="text-foreground/70 leading-relaxed"
            />
          </section>

          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary/50" />
              <h2 className="font-heading text-2xl font-bold text-primary">על מה דיברנו?</h2>
            </div>
            <div className="space-y-6">
              {points.map((p, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {i + 1}.{' '}
                    <EditableMeetingField
                      meetingId={meeting.id}
                      field="title"
                      value={p.title}
                      as="span"
                      onSave={(val) => updateMeetingPoint(meeting.id, i, 'title', val)}
                    />
                  </h3>
                  <EditableMeetingField
                    meetingId={meeting.id}
                    field="text"
                    value={p.text}
                    as="p"
                    multiline
                    className="text-foreground/70 leading-relaxed pr-6"
                    onSave={(val) => updateMeetingPoint(meeting.id, i, 'text', val)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-gradient-to-l from-accent/40 to-secondary/50 border border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-primary/60" />
              <h2 className="font-heading text-xl font-bold text-primary">מה נשאר עם הקהילה אחרי המפגש?</h2>
            </div>
            <EditableMeetingField
              meetingId={meeting.id}
              field="takeaway"
              value={meeting.takeaway}
              as="p"
              multiline
              className="text-foreground/70 leading-relaxed"
            />
          </section>

          <div className="mt-10 flex justify-center">
            <ShareButtons title={meeting.title} />
          </div>

          {meeting.registrationLink && (
            <div className="mt-10 text-center">
              <a
                href={meeting.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-purple text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                להרשמה
              </a>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border/50 text-center">
            <Link to="/meetings" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              <ArrowRight className="w-4 h-4" />
              חזרה לכל המפגשים
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function MeetingDetail() {
  return (
    <MeetingsProvider>
      <MeetingDetailContent />
    </MeetingsProvider>
  );
}