import React from 'react';
import { Link } from 'react-router-dom';
import { Infinity as InfinityIcon, Calendar, History, Sparkles } from 'lucide-react';
import { Image } from '@/components/ui/image';
import EditableMeetingField from '@/components/meetings/EditableMeetingField';

export default function MeetingCard({ meeting, upcoming }) {
  return (
    <Link
      to={`/meetings/${meeting.slug}`}
      className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        upcoming
          ? 'bg-gradient-to-b from-white to-accent/30 border-2 border-primary/20 hover:shadow-2xl hover:shadow-primary/20'
          : 'bg-gradient-to-b from-white to-muted/40 border border-border/50 hover:shadow-xl hover:shadow-primary/5'
      }`}
    >
      {upcoming && (
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-purple text-white text-xs font-semibold shadow-lg shadow-primary/30">
          <Sparkles className="w-3 h-3" />
          מפגש קרוב
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden relative">
        <Image
          src={meeting.image}
          alt={meeting.title}
          className={`w-full h-full ${upcoming ? '' : 'grayscale-[0.4] group-hover:grayscale-0 transition-all'}`}
          fittingType="fill"
        />
        {!upcoming && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-primary text-xs font-semibold">
              <History className="w-3.5 h-3.5" />
              צפייה בתיעוד
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {upcoming && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary/50 mb-3">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <EditableMeetingField meetingId={meeting.id} field="date" value={meeting.date} as="span" />
          </div>
        )}
        <EditableMeetingField
          meetingId={meeting.id}
          field="title"
          value={meeting.title}
          as="h3"
          className={`font-heading text-lg font-bold mb-2 leading-snug ${upcoming ? 'text-primary' : 'text-foreground/70'}`}
        />
        <EditableMeetingField
          meetingId={meeting.id}
          field="why"
          value={meeting.why}
          as="p"
          multiline
          className={`text-sm flex-1 ${upcoming ? 'text-foreground/60' : 'text-foreground/45'}`}
        />
        <div className="flex items-center justify-between gap-2 mt-4">
          {upcoming && meeting.registrationLink ? (
            <a
              href={meeting.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              להרשמה
            </a>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <InfinityIcon className="w-4 h-4 text-gradient-purple" />
            קריאת המפגש
          </span>
        </div>
      </div>
    </Link>
  );
}