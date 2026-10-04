import React from 'react';
import { FileText, Download, Bookmark, FolderOpen } from 'lucide-react';

const CATEGORIES = [
  { title: 'מסמכים שמורים', icon: FileText, count: 0 },
  { title: 'מאמרים מסומנים', icon: Bookmark, count: 0 },
  { title: 'קבצים להורדה', icon: Download, count: 0 },
];

export default function Documents() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-4xl mx-auto">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D293A] mb-2">מסמכים</h1>
      <p className="text-foreground/55 mb-10">המסמכים והקבצים האישיים שלך.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-white rounded-3xl p-6 border border-border/40 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#EAE8EE] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#2D293A]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#2D293A] mb-1">{c.title}</h3>
              <p className="text-sm text-foreground/50">{c.count} פריטים</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-12 border border-border/40 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAE8EE] flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-8 h-8 text-[#2D293A]/40" />
        </div>
        <h3 className="font-heading text-lg font-bold text-[#2D293A] mb-2">אין מסמכים עדיין</h3>
        <p className="text-sm text-foreground/50 max-w-sm mx-auto">
          מסמכים שתשמרי מהמפגשים, מאמרים שתסמני וקבצים שתורידי יופיעו כאן.
        </p>
      </div>
    </div>
  );
}