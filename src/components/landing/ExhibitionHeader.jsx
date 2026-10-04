import React from 'react';
import { Link } from 'react-router-dom';
import { Infinity as InfinityIcon, ArrowRight } from 'lucide-react';
import EditableText from '@/components/landing/EditableText';

export default function ExhibitionHeader({ backLabel = 'חזרה לדף הבית', backTo = '/' }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to={backTo} className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors">
          <ArrowRight className="w-4 h-4" />
          <EditableText contentKey="ex_header_back" fallback={backLabel} as="span" />
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <EditableText contentKey="ex_header_brand" fallback={'8 דקות'} as="span" className="text-2xl font-bold text-primary font-heading" />
          
        </Link>
      </nav>
    </header>);

}