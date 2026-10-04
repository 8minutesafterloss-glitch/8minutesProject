import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function CenterFooter() {
  return (
    <footer className="border-t border-border/40 bg-white py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/50">
        <button className="inline-flex items-center gap-1.5 hover:text-[#2D293A] transition-colors">
          <Shield className="w-3.5 h-3.5" />
          <span>מדיניות פרטיות</span>
        </button>
        <button className="hover:text-[#2D293A] transition-colors">הודעה אדית</button>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>מרחב מוגן</span>
        </span>
      </div>
    </footer>
  );
}