import React, { useState } from 'react';
import { FileText, Sparkles, Heart } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { getImages } from '@/lib/exhibitionUtils';
import ImageLightbox from '@/components/exhibition/ImageLightbox';

export default function ArtistWork({ work }) {
  const images = getImages(work);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const sections = [
    { icon: FileText, label: 'פרטים טכניים', text: work.technical_details },
    { icon: Heart, label: 'סיפור היצירה', text: work.artwork_story },
    { icon: Sparkles, label: 'חשוב לי לומר ש', text: work.audience_connection },
  ].filter((s) => s.text);

  return (
    <div className="bg-gradient-to-b from-white to-accent/10 rounded-3xl border border-border/50 p-6 md:p-8">
      {/* Image gallery */}
      {images.length > 0 && (
        <div className="mb-8">
          {images.length === 1 ? (
            <button
              onClick={() => setLightboxIndex(0)}
              className="block w-full rounded-2xl overflow-hidden bg-accent/20"
            >
              <Image
                src={images[0]}
                alt={work.title}
                className="w-full max-h-[500px] object-contain"
                fittingType="fit"
              />
            </button>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square rounded-xl overflow-hidden bg-accent/20 hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={url}
                    alt={`${work.title} - תמונה ${i + 1}`}
                    className="w-full h-full"
                    fittingType="fill"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading text-2xl font-bold text-primary mb-6">{work.title}</h3>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary/50" />
                  <h4 className="font-heading text-base font-semibold text-primary">{section.label}</h4>
                </div>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{section.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}