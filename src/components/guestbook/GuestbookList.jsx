import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, MessageSquare, Infinity as InfinityIcon } from 'lucide-react';

function relativeDate(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'כעת';
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  if (hours < 24) return `לפני ${hours} שע׳`;
  if (days < 30) return `לפני ${days} ימים`;
  return new Date(dateStr).toLocaleDateString('he-IL');
}

export default function GuestbookList({ exhibitionSlug, exhibitionItems = [] }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const filter = { is_approved: true };
        if (exhibitionSlug) filter.exhibition_item_id = exhibitionSlug;
        const data = await base44.entities.GuestbookEntry.filter(filter, '-created_date', 100);
        setEntries(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [exhibitionSlug]);

  const itemMap = new Map(exhibitionItems.map(i => [i.slug, i]));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-10 h-10 text-accent-foreground/30 mx-auto mb-3" />
        <p className="text-foreground/50">עדיין אין רשומות. היו הראשונות לכתוב.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => {
        const linkedItem = entry.exhibition_item_id ? itemMap.get(entry.exhibition_item_id) : null;
        return (
          <div key={entry.id} className="rounded-2xl bg-white border border-border/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-bold text-primary">{entry.name}</h4>
              <span className="text-xs text-foreground/40">{relativeDate(entry.created_date)}</span>
            </div>
            <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{entry.message}</p>
            {linkedItem && (
              <Link
                to={`/exhibition/${linkedItem.slug}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary/60 hover:text-primary transition-colors"
              >
                <InfinityIcon className="w-4 h-4" />
                {linkedItem.artist_name} — {linkedItem.title}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}