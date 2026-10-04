import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getImages } from '@/lib/exhibitionUtils';

// Same grouping/ordering as Exhibition.jsx so nav order matches the gallery.
function groupBySlug(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.slug || item.artist_name;
    if (!map.has(key)) map.set(key, { items: [], imageCount: 0 });
    const group = map.get(key);
    group.items.push(item);
    group.imageCount += getImages(item).length;
  }
  const groups = Array.from(map.values()).map((group) => {
    let item = group.items[0];
    if (group.items.length > 1) {
      item =
        group.items.find((i) => i.sort_order === 1) ||
        group.items.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
    }
    return { item, imageCount: group.imageCount };
  });
  const rank = (name) => {
    const n = (name || '').trim();
    if (n.startsWith('נאורה')) return 0;
    if (n.startsWith('רוני')) return 1;
    return 2;
  };
  return groups.sort((a, b) => rank(a.item.artist_name) - rank(b.item.artist_name));
}

export default function ArtistNav({ currentSlug }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ExhibitionItem.list();
        setArtists(groupBySlug(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary/30" />
      </div>
    );
  }

  const index = artists.findIndex((a) => a.item.slug === currentSlug);
  if (index === -1) return null;

  const prev = index > 0 ? artists[index - 1] : null;
  const next = index < artists.length - 1 ? artists[index + 1] : null;

  // RTL: "הקודם" points right, "הבא" points left
  return (
    <nav className="flex items-stretch justify-between gap-4 pt-10">
      {prev ? (
        <Link
          to={`/exhibition/${prev.item.slug}`}
          className="group flex-1 flex items-center gap-3 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 p-4 text-right"
        >
          <ChevronRight className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
          <div className="min-w-0">
            <span className="block text-xs text-foreground/45 mb-0.5">הקודם</span>
            <span className="block font-heading font-bold text-primary truncate">{prev.item.artist_name}</span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to={`/exhibition/${next.item.slug}`}
          className="group flex-1 flex items-center gap-3 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 p-4 text-left"
        >
          <div className="min-w-0">
            <span className="block text-xs text-foreground/45 mb-0.5">הבא</span>
            <span className="block font-heading font-bold text-primary truncate">{next.item.artist_name}</span>
          </div>
          <ChevronLeft className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}