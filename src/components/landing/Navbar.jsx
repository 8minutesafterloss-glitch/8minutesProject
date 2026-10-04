import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SkipLink from '@/components/SkipLink';

const MAIN_LINKS = [
  { to: '/', label: 'עמוד הבית' },
  { to: '/exhibition', label: 'התערוכה' },
  { to: '/meetings', label: 'מפגשים' },
];

const SUB_LINKS = [
  { id: 'goals', label: 'על המיזם' },
  { id: 'empty-moments', label: 'הרגעים הריקים' },
  { id: 'how', label: 'איך זה עובד' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const scrollLockRef = useRef(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section on home page
  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !scrollLockRef.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    SUB_LINKS.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSubNavClick = (e, link) => {
    e.preventDefault();
    const el = document.getElementById(link.id);
    if (el) {
      scrollLockRef.current = true;
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(link.id);
      setTimeout(() => { scrollLockRef.current = false; }, 800);
    }
    setOpen(false);
  };

  const mainLinks = [...MAIN_LINKS];
  if (isAdmin) mainLinks.push({ to: '/center', label: 'למרכז שלי' });

  return (
    <>
      <SkipLink />
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-border/30 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        {/* Top row */}
        <nav
          aria-label="ניווט ראשי"
          className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between"
        >
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-2xl font-bold text-primary font-heading">8 דקות</span>
          </Link>

          {/* Desktop main nav */}
          <div className="hidden md:flex items-center gap-8">
            {mainLinks.map((l) => {
              const isActive = l.to === '/' ? isHome : location.pathname.startsWith(l.to);
              const isHomeLink = l.to === '/';
              return (
                <div key={l.to} className="relative">
                  <Link
                    to={l.to}
                    className={`text-sm transition-colors ${
                      isActive ? 'text-primary font-bold' : 'text-foreground/60 hover:text-primary'
                    }`}
                  >
                    {l.label}
                  </Link>
                  {isHomeLink && isHome && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 flex items-center gap-3 whitespace-nowrap bg-white px-5 py-2 rounded-full border border-border/50 shadow-sm">
                      {SUB_LINKS.map((link, idx) => (
                        <React.Fragment key={link.id}>
                          {idx > 0 && <span className="text-foreground/20 select-none">|</span>}
                          <a
                            href={`#${link.id}`}
                            onClick={(e) => handleSubNavClick(e, link)}
                            className={`text-xs transition-colors ${
                              activeSection === link.id
                                ? 'text-primary font-medium'
                                : 'text-foreground/50 hover:text-primary'
                            }`}
                          >
                            {link.label}
                          </a>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop admin actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/hadmin"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                ניהול
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  התחברות
                </Link>
                <Button
                  asChild
                  className="bg-gradient-purple text-white rounded-full px-6 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <Link to="/register">הצטרפי</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-primary"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden border-t border-border/50 bg-white">
            <div className="px-6 py-4 flex flex-col gap-1">
              {mainLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/40 last:border-0"
                >
                  {l.label}
                </Link>
              ))}

              {/* Sub-nav in mobile — home page only */}
              {isHome && (
                <div className="py-3 flex flex-col gap-2 border-b border-border/40">
                  <span className="text-xs text-foreground/40 font-medium">עמוד הבית</span>
                  {SUB_LINKS.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleSubNavClick(e, link)}
                      className="py-1.5 text-sm text-foreground/70 hover:text-primary transition-colors pr-4"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {isAdmin && (
                <Link
                  to="/hadmin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  ניהול
                </Link>
              )}
              {isAdmin && (
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-center py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    התחברות
                  </Link>
                  <Button
                    asChild
                    className="bg-gradient-purple text-white rounded-full px-6 py-3 hover:opacity-90 transition-opacity"
                  >
                    <Link to="/register" onClick={() => setOpen(false)}>
                      הצטרפי
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <span id="main-content" tabIndex={-1} className="sr-only" />
    </>
  );
}