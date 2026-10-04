import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { MeetingsProvider, useMeetings } from '@/hooks/useMeetings';
import { toast } from '@/components/ui/use-toast';
import MeetingForm from '@/components/admin/MeetingForm';

function AdminMeetingsContent() {
  const { meetings, loading, createMeeting, updateMeetingData, deleteMeeting } = useMeetings();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const sorted = [...meetings].sort((a, b) => (b.number || 0) - (a.number || 0));

  const handleAdd = () => {
    setEditingMeeting(null);
    setFormOpen(true);
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormOpen(true);
  };

  const handleDelete = async (meeting) => {
    if (!window.confirm(`למחוק את המפגש "${meeting.title}"?`)) return;
    try {
      await deleteMeeting(meeting.id);
      toast({ title: 'המפגש נמחק' });
    } catch (err) {
      toast({ title: 'המחיקה נכשלה', description: err?.message || 'נסי שוב', variant: 'destructive' });
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingMeeting) {
        await updateMeetingData(editingMeeting.id, data);
        toast({ title: 'המפגש עודכן בהצלחה' });
      } else {
        await createMeeting(data);
        toast({ title: 'המפגש נוסף בהצלחה' });
      }
      setFormOpen(false);
    } catch (err) {
      toast({ title: 'השמירה נכשלה', description: err?.message || 'נסי שוב', variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/hadmin" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary/60 hover:text-primary transition-colors mb-2">
            <ArrowRight className="w-4 h-4" />
            חזרה לניהול
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">ניהול מפגשים</h1>
          <p className="text-foreground/60 mt-2">עריכה, הוספה ומחיקה של מפגשים ופרטיהם.</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-purple text-white rounded-full px-6 self-start">
          <Plus className="w-4 h-4 ml-1.5" />
          הוסף מפגש
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground/50 mb-4">אין מפגשים עדיין</p>
          <Button onClick={handleAdd} className="bg-gradient-purple text-white rounded-full px-6">
            <Plus className="w-4 h-4 ml-1.5" />
            הוסף מפגש ראשון
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-3xl bg-white border border-border/40 shadow-sm overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <Image src={m.image} alt={m.title} className="w-full h-full" fittingType="fill" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary/50 mb-2">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{m.date || 'ללא תאריך'}</span>
                  {m.number != null && <span className="text-foreground/30">·</span>}
                  {m.number != null && <span>מפגש #{m.number}</span>}
                </div>
                <h3 className="font-heading text-lg font-bold text-primary mb-2 leading-snug">{m.title}</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 flex-1">{m.why}</p>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(m)}
                    className="flex-1"
                  >
                    <Pencil className="w-3.5 h-3.5 ml-1.5" />
                    עריכה
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(m)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MeetingForm
        meeting={editingMeeting}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default function AdminMeetings() {
  return (
    <MeetingsProvider>
      <AdminMeetingsContent />
    </MeetingsProvider>
  );
}