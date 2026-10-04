import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MapPin, Loader2, Infinity as InfinityIcon, User, Heart } from 'lucide-react';
import ExhibitionHeader from '@/components/landing/ExhibitionHeader';
import ArtistWork from '@/components/exhibition/ArtistWork';
import ArtistPageGate from '@/components/exhibition/ArtistPageGate';
import { getImages } from '@/lib/exhibitionUtils';
import { HomeContentProvider } from '@/hooks/useHomeContent';
import ShareButtons from '@/components/ShareButtons';
import LinkifiedText from '@/components/LinkifiedText';
import GuestbookList from '@/components/guestbook/GuestbookList';
import GuestbookForm from '@/components/guestbook/GuestbookForm';
import ArtistNav from '@/components/exhibition/ArtistNav';

export default function ExhibitionDetail() {
  const { slug } = useParams();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ExhibitionItem.filter({ slug });
        setWorks(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  let content;
  if (loading) {
    content = (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  } else if (works.length === 0) {
    content = (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <InfinityIcon className="w-12 h-12 text-accent-foreground/30" />
        <p className="text-foreground/60">האמן לא נמצא</p>
        <Link to="/exhibition#exhibition-items" className="text-primary font-medium hover:underline">חזרה לתערוכה</Link>
      </div>
    );
  } else {
    const sortedWorks = [...works].sort((a, b) => {
      const sa = Number.isFinite(Number(a.sort_order)) ? Number(a.sort_order) : Infinity;
      const sb = Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : Infinity;
      if (sa !== sb) return sa - sb;
      return new Date(a.created_date || 0) - new Date(b.created_date || 0);
    });
    const first = sortedWorks[0];

    content = (
      <div className="min-h-screen bg-soft-lavender">
        <ExhibitionHeader backLabel="חזרה לתערוכה" backTo="/exhibition#exhibition-items" />

        {/* Artist header */}
        <section className="pt-12 pb-10 px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-accent-foreground/40" />
              <span className="text-sm text-foreground/50">הרגעים הריקים — תערוכה</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              {first.artist_name}
            </h1>
            {first.location && (
              <p className="inline-flex items-center gap-2 text-lg text-foreground/60">
                <MapPin className="w-5 h-5" />
                {first.location}
              </p>
            )}
            {works.length > 1 && (
              <p className="mt-3 text-sm text-foreground/45">
                {works.length} יצירות בתערוכה
              </p>
            )}
            {first.about_artist && (
              <div className="mt-8 max-w-2xl mx-auto text-right">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <User className="w-5 h-5 text-primary/50" />
                  <h2 className="font-heading text-lg font-semibold text-primary">על היוצר/ת</h2>
                </div>
                <LinkifiedText className="text-foreground/70 leading-relaxed whitespace-pre-line">
                  {first.about_artist}
                </LinkifiedText>
              </div>
            )}
            {first.ac_field && (
              <div className="mt-8 max-w-2xl mx-auto text-right">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary/50" />
                  <h2 className="font-heading text-lg font-semibold text-primary">חיבור לקהל</h2>
                </div>
                <LinkifiedText className="text-foreground/70 leading-relaxed whitespace-pre-line">
                  {first.ac_field}
                </LinkifiedText>
              </div>
            )}
          </div>
        </section>

        {/* Share */}
        <div className="px-6 lg:px-8 pb-2">
          <div className="max-w-3xl mx-auto flex justify-center">
            <ShareButtons title={first.artist_name} />
          </div>
        </div>

        {/* Works */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto space-y-10">
            {sortedWorks.map((work) => (
              <ArtistWork key={work.id} work={work} />
            ))}
          </div>
        </section>

        {/* Guestbook entries linked to this artist */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6 text-center">רשמים על היצירות</h2>
            <div className="rounded-3xl bg-soft-lavender border border-border/40 p-6 sm:p-8 mb-10">
              <GuestbookForm defaultSlug={slug} />
            </div>
            <GuestbookList exhibitionSlug={slug} />
          </div>
        </section>

        {/* Prev / Next artist navigation */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto">
            <ArtistNav currentSlug={slug} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <HomeContentProvider>
      <ArtistPageGate>
        {content}
      </ArtistPageGate>
    </HomeContentProvider>
  );
}