import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  LayoutGrid,
  Briefcase,
  Users,
  Heart,
  Sparkles,
  MessageCircle,
  BookOpen,
  UsersRound,
  PenLine,
  Calendar,
  FileText,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';

const LINK_GROUPS = [
  {
    label: 'תקשורת',
    items: [
      { label: 'עבודה', icon: Briefcase, to: '/center/work' },
      { label: 'משפחה', icon: Users, to: '/center/family' },
      { label: 'חברות', icon: Heart, to: '/center/friends' },
    ],
  },
  {
    label: 'תמיכה',
    items: [
      { label: 'מרכז התמיכה', icon: MessageCircle, to: '/center/support' },
      { label: 'מאמרים ומדריכים', icon: BookOpen, to: '/center/support/articles' },
      { label: 'קהילה', icon: UsersRound, to: '/center/support/community' },
      { label: 'יומן אישי', icon: PenLine, to: '/center/support/journal' },
    ],
  },
  {
    label: 'כלים',
    items: [
      { label: 'אימונים', icon: Calendar, to: '/center/coaching' },
      { label: 'מסמכים', icon: FileText, to: '/center/documents' },
      { label: 'לוח אירועים', icon: Calendar, to: '/events' },
    ],
  },
  {
    label: 'חשבון',
    items: [
      { label: 'פרופיל', icon: User, to: '/center/profile' },
      { label: 'הגדרות', icon: Settings, to: '/center/settings' },
    ],
  },
];

export default function QuickLinks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-white">
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">כל הכלים</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64 p-2 rounded-2xl border-border/50"
      >
        {LINK_GROUPS.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && <DropdownMenuSeparator className="my-1.5 bg-border/40" />}
            <DropdownMenuLabel className="text-xs font-medium text-foreground/45 px-2 py-1.5">
              {group.label}
            </DropdownMenuLabel>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.to} asChild>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-foreground/75 hover:bg-accent/50 hover:text-foreground cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-primary/70 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}