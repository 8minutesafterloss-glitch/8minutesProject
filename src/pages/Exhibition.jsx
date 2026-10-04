import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Infinity as InfinityIcon, Loader2 } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import { getImages } from '@/lib/exhibitionUtils';

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
      // For artists with multiple works, show the work whose sort_order is 1
      item = group.items.find((i) => i.sort_order === 1) ||
        group.items.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
    }
    return { item, imageCount: group.imageCount };
  });
  // Fixed order: נאורה first, רוני second
  const rank = (name) => {
    const n = (name || '').trim();
    if (n.startsWith('נאורה')) return 0;
    if (n.startsWith('רוני')) return 1;
    return 2;
  };
  return groups.sort((a, b) => rank(a.item.artist_name) - rank(b.item.artist_name));
}
import ExhibitionBanner from '@/components/landing/ExhibitionBanner';
import ExhibitionIntro from '@/components/landing/ExhibitionIntro';
import CountdownTimer from '@/components/landing/CountdownTimer';
import GuestbookSection from '@/components/guestbook/GuestbookSection';
import EditableText from '@/components/landing/EditableText';
import { HomeContentProvider } from '@/hooks/useHomeContent';
import { Image } from '@/components/ui/image';

export default function Exhibition() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ExhibitionItem.list();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <HomeContentProvider>
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-20 pb-16 px-6 lg:px-8 bg-soft-lavender overflow-hidden">
          <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <EditableText contentKey="ex_hero_badge" fallback={'קול קורא ליוצרים ויוצרות'} as="span" className="text-sm font-medium text-primary/60" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              <EditableText contentKey="ex_hero_title" fallback={'הרגעים הריקים — תערוכה'} as="span" />
            </h1>
          </div>
        </section>

        {/* Intro content */}
        <section className="px-6 lg:px-8 py-2">
          <ExhibitionIntro />
          <div className="mt-10">
            <CountdownTimer />
          </div>
        </section>

        {/* Exhibition banner image */}
        <section className="px-6 lg:px-8 pb-16">
          <div className="max-w-3xl mx-auto">
            <Image
              src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/50a1250cb_smallTizer.png"
              alt="הרגעים הריקים — תערוכה בנושא לידה שקטה ואובדן תינוק רך"
              className="w-full h-auto rounded-3xl border border-border/50 shadow-lg shadow-primary/10"
              fittingType="fit" />
            
          </div>
        </section>

        {/* Items */}
        <section id="exhibition-items" className="py-20 px-6 lg:px-8 bg-soft-lavender">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-primary mb-12 text-center">
              <EditableText contentKey="ex_items_title" fallback={'הקולות שממלאים את הרגעים הריקים'} as="span" />
            </h2>

            {loading ? <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
              </div> : items.length === 0 ? <div className="text-center py-20">
                <InfinityIcon className="w-12 h-12 text-accent-foreground/30 mx-auto mb-4" />
                <EditableText contentKey="ex_items_empty" fallback={'טרם עלו יצירות לתערוכה'} as="p" className="text-foreground/50" />
              </div> : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupBySlug(items).map(({ item, imageCount }) => {
                const imgs = getImages(item);
                return (
                  <Link key={item.id} to={`/exhibition/${item.slug}`} className="group rounded-2xl bg-gradient-to-b from-white to-accent/20 border border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      {imgs.length > 0 ?
                    <div className="aspect-square overflow-hidden bg-accent/20">
                          <img src={imgs[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div> :

                    <div className="aspect-square flex items-center justify-center bg-accent/10">
                          <InfinityIcon className="w-8 h-8 text-gradient-purple opacity-40" />
                        </div>
                    }
                      <div className="p-3">
                        <h3 className="font-heading text-base font-bold text-primary mb-1 leading-snug line-clamp-2">{item.artist_name}</h3>
                        <p className="text-xs text-foreground/70 font-medium mb-0.5 truncate">
                          {item.title}
                          {imageCount > 1 && <span className="text-foreground/40"> ({imageCount} תמונות)</span>}
                        </p>
                      </div>
                    </Link>);

              })}
              </div>}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <hr className="border-t border-border/40" />
        </div>

        {/* Guestbook */}
        <GuestbookSection exhibitionItems={items} />
      </div>
    </HomeContentProvider>);

}