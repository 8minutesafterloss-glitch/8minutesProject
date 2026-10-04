import React from 'react';
import { Link } from 'react-router-dom';
import { Infinity as InfinityIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white/80 py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white font-heading">8 דקות</span>
            <InfinityIcon className="w-6 h-6 text-white/60" />
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white transition-colors">עמוד הבית</Link>
            <Link to="/exhibition" className="hover:text-white transition-colors">התערוכה</Link>
            <Link to="/meetings" className="hover:text-white transition-colors">מפגשים</Link>
          </div>
          <p className="text-sm text-white/50">© 2026 מיזם 8 דקות</p>
        </div>
      </div>
    </footer>
  );
}