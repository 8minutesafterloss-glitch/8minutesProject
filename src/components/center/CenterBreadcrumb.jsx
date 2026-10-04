import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const LABELS = {
  '/center/profile': 'פרופיל',
  '/center/settings': 'הגדרות',
  '/center/documents': 'מסמכים',
  '/center/ai-work': 'עבודת AI',
  '/center/coaching': 'אימונים',
  '/center/work': 'עבודה',
  '/center/family': 'משפחה',
  '/center/friends': 'חברות',
  '/center/support': 'תמיכה בשבילי',
  '/center/support/articles': 'תכנים והסברים',
  '/center/support/community': 'קהילה תומכת',
  '/center/support/journal': 'יומן אישי',
  '/events': 'לוח אירועים',
};

function buildTrail(pathname) {
  const trail = [{ label: 'המרכז שלי', to: '/center' }];
  if (pathname === '/center') return trail;

  if (pathname.startsWith('/center/support/')) {
    trail.push({ label: 'תמיכה בשבילי', to: '/center/support' });
  }

  const label = LABELS[pathname];
  if (label) {
    trail.push({ label, to: pathname });
  }
  return trail;
}

export default function CenterBreadcrumb() {
  const location = useLocation();
  const trail = buildTrail(location.pathname);

  if (location.pathname === '/center') return null;

  return (
    <nav className="px-6 sm:px-10 lg:px-16 pt-6 max-w-5xl mx-auto" aria-label="ניווט עיוורי">
      <ol className="flex items-center gap-1.5 text-sm flex-wrap">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <React.Fragment key={item.to}>
              {i > 0 && <ChevronLeft className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" />}
              {isLast ? (
                <li className="text-foreground/80 font-medium">{item.label}</li>
              ) : (
                <li>
                  <Link to={item.to} className="text-foreground/50 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}