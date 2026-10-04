import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function ImageLightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index || 0);

  useEffect(() => {
    setCurrent(index || 0);
  }, [index]);

  if (!images || images.length === 0) return null;

  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };
  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl p-0 bg-black/95 border-none overflow-hidden">
        <DialogClose className="absolute top-4 left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <X className="w-5 h-5" />
        </DialogClose>
        <div className="flex items-center justify-center min-h-[60vh] relative">
          <Image
            src={images[current]}
            alt={`תמונה ${current + 1}`}
            className="max-h-[80vh] w-auto"
            fittingType="fit"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                {current + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}