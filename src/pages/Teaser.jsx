import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, RotateCcw } from 'lucide-react';
import { getImages } from '@/lib/exhibitionUtils';
import { Image } from '@/components/ui/image';
import ShareButtons from '@/components/ShareButtons';
import TeaserCaptions from '@/components/teaser/TeaserCaptions';
import Navbar from '@/components/landing/Navbar';
import EditableText from '@/components/landing/EditableText';
import { HomeContentProvider } from '@/hooks/useHomeContent';

const TOTAL_DURATION = 15000; // 15 seconds
const R = 0.88; // acceleration ratio — each interval shrinks
const FIRST_INTERVAL = 1470; // first image stays longest (scaled to fit 15s)

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Teaser() {
  const [images, setImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ExhibitionItem.list();
        // one image per artist (first image of representative work)
        const map = new Map();
        for (const item of data) {
          const key = item.slug || item.artist_name;
          if (map.has(key)) continue;
          const imgs = getImages(item);
          if (imgs.length > 0) map.set(key, imgs[0]);
        }
        const all = Array.from(map.values());
        setImages(all);
        setDisplayImages(shuffle(all));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const timeline = useMemo(() => {
    if (displayImages.length === 0) return [];
    const n = displayImages.length;
    // Build a geometric (accelerating) curve, one step per image,
    // then scale it so the total is exactly TOTAL_DURATION.
    const raw = [];
    let interval = FIRST_INTERVAL;
    for (let i = 0; i < n; i++) {
      raw.push(interval);
      interval *= R;
    }
    const rawSum = raw.reduce((a, b) => a + b, 0);
    const scale = TOTAL_DURATION / rawSum;
    return raw.map((d, i) => ({ imageIndex: i, duration: d * scale }));
  }, [displayImages]);

  useEffect(() => {
    if (timeline.length === 0 || finished) return;
    if (step >= timeline.length - 1) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), timeline[step].duration);
    return () => clearTimeout(t);
  }, [step, timeline, finished]);

  const replay = useCallback(() => {
    setDisplayImages((prev) => shuffle(prev));
    setStep(0);
    setFinished(false);
  }, []);

  const elapsed = useMemo(() => {
    if (timeline.length === 0) return 0;
    return timeline.slice(0, step).reduce((sum, s) => sum + s.duration, 0);
  }, [step, timeline]);

  const currentIndex = timeline[step]?.imageIndex ?? 0;
  const progress = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
  return (
    <HomeContentProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col items-center">
        <Navbar />

        {/* Hero */}
        <section className="relative w-full pt-24 pb-10 px-6 lg:px-8 bg-soft-lavender overflow-hidden">
          <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <EditableText contentKey="teaser_hero_badge" fallback={'קול קורא ליוצרים ויוצרות'} as="span" className="text-sm font-medium text-primary/60" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              <EditableText contentKey="teaser_hero_title" fallback={'הרגעים הריקים — תערוכה'} as="span" />
            </h1>
            <p className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
              <EditableText contentKey="teaser_hero_desc" fallback={'הצצה ראשונה ליצירות שימלאו את הרגעים הריקים. עוד רגע קט ונפתח.'} as="span" />
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
          </div>
        ) : displayImages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            טרם עלו יצירות לתערוכה
          </div>
        ) : (
          <>
            {/* Vertical video frame — 400px wide, 9:16 Instagram ratio */}
            <div className="flex-1 flex items-center justify-center w-full py-8">
              <div
                className="relative bg-black overflow-hidden shadow-2xl shadow-primary/20 rounded-2xl"
                style={{ width: '400px', aspectRatio: '9 / 16' }}
              >
                {/* Images */}
                {displayImages.map((src, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-300 ease-linear"
                    style={{ opacity: i === currentIndex && !finished ? 1 : 0 }}
                  >
                    <Image
                      src={src}
                      alt=""
                      className="w-full h-full"
                      fittingType="fill"
                    />
                  </div>
                ))}

                {/* Caption overlay — 7 stages */}
                {!finished && (
                  <TeaserCaptions elapsed={elapsed} totalDuration={TOTAL_DURATION} />
                )}

                {/* Progress bar at bottom of frame */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30">
                  <div
                    className="h-full bg-gradient-purple transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Replay button inside frame */}
                {finished && (
                  <button
                    onClick={replay}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/60"
                  >
                    <RotateCcw className="w-10 h-10 text-white" />
                    <span className="text-white font-medium">נגן שוב</span>
                  </button>
                )}
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-8 flex justify-center">
              <ShareButtons title="הרגעים הריקים — תערוכה" />
            </div>
          </>
        )}
      </div>
    </HomeContentProvider>
  );
}