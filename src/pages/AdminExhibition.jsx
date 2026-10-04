import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ImagePlus, Download, Users, UserPlus, Pencil, Trash2, Table2, LayoutGrid } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { getImages } from '@/lib/exhibitionUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ArtistAdminPanel from '@/components/admin/ArtistAdminPanel';
import AddArtistDialog from '@/components/admin/AddArtistDialog';
import RecordEditDialog from '@/components/admin/RecordEditDialog';

export default function AdminExhibition() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [importing, setImporting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [view, setView] = useState('artists');
  const [editRecord, setEditRecord] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ExhibitionItem.list();
      setItems(data || []);
    } catch (err) {
      toast({ title: 'שגיאה בטעינת היצירות', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Group items by slug → artists
  const artists = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      const slug = item.slug || item.id;
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push(item);
    });
    return Object.entries(grouped).map(([slug, works]) => ({ slug, works }));
  }, [items]);

  const selectedArtist = artists.find((a) => a.slug === selectedSlug) || null;

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await base44.functions.invoke('importExhibition', { clear_first: true });
      toast({ title: `יובאו ${res.data.imported} יצירות` });
      await load();
    } catch (err) {
      toast({ title: 'שגיאה בייבוא', description: err.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">ניהול יצירות התערוכה</h1>
          <p className="text-foreground/60">{artists.length} אמנים, {items.length} יצירות</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView('artists')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                view === 'artists' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent/30'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              לפי אמן
            </button>
            <button
              onClick={() => setView('records')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                view === 'records' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent/30'
              }`}
            >
              <Table2 className="w-4 h-4" />
              כל הרשומות
            </button>
          </div>
          <Button onClick={() => setShowAddDialog(true)} variant="outline">
            <UserPlus className="w-4 h-4 ml-2" />
            אמן חדש
          </Button>
          <Button onClick={handleImport} disabled={importing} variant="outline">
            {importing ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Download className="w-4 h-4 ml-2" />}
            {importing ? 'מייבא...' : 'ייבוא מהאקסל'}
          </Button>
        </div>
      </div>

      {view === 'records' ? (
        <RecordsTable items={items} onEdit={setEditRecord} onRefresh={load} />
      ) : (
      <div className="grid lg:grid-cols-2 gap-6">
        {/* List — grouped by artist */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pl-2">
          {artists.map((artist) => {
            const first = artist.works[0];
            const imgs = artist.works.flatMap((w) => getImages(w));
            const isSelected = selectedSlug === artist.slug;
            const multi = artist.works.length > 1;
            return (
              <button
                key={artist.slug}
                onClick={() => setSelectedSlug(artist.slug)}
                className={`w-full text-right p-4 rounded-2xl border transition-colors flex items-center gap-4 ${
                  isSelected ? 'border-primary bg-accent/30' : 'border-border/50 hover:bg-accent/10'
                }`}
              >
                {imgs.length > 0 ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-accent/20 flex-shrink-0">
                    <Image src={imgs[0]} alt={first.artist_name} className="w-full h-full" fittingType="fill" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <ImagePlus className="w-6 h-6 text-foreground/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{first.artist_name}</p>
                  <p className="text-sm text-foreground/50 truncate">
                    {artist.works.length} יצירות{imgs.length > 0 ? ` · ${imgs.length} תמונות` : ''}
                  </p>
                </div>
                {multi && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary/60 bg-accent/40 px-2 py-1 rounded-full flex-shrink-0">
                    <Users className="w-3 h-3" />
                    {artist.works.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="rounded-2xl border border-border/50 p-6 max-h-[70vh] overflow-y-auto">
          {!selectedArtist ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <ImagePlus className="w-12 h-12 text-foreground/20 mb-4" />
              <p className="text-foreground/50">בחרי אמן מהרשימה כדי לערוך את הפרטים והיצירות</p>
            </div>
          ) : (
            <ArtistAdminPanel
              works={selectedArtist.works}
              onRefresh={load}
              onDelete={() => {
                setSelectedSlug(null);
                load();
              }}
            />
          )}
        </div>
      </div>
      )}

      <AddArtistDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCreated={async (newSlug) => {
          await load();
          setSelectedSlug(newSlug);
        }}
      />

      <RecordEditDialog
        record={editRecord}
        open={!!editRecord}
        onOpenChange={(o) => !o && setEditRecord(null)}
        onSaved={load}
      />
    </div>
  );
}

function RecordsTable({ items, onEdit, onRefresh }) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (item) => {
    if (!window.confirm(`למחוק את "${item.title}" של ${item.artist_name}?`)) return;
    setDeletingId(item.id);
    try {
      await base44.entities.ExhibitionItem.delete(item.id);
      toast({ title: 'הרשומה נמחקה' });
      onRefresh();
    } catch (err) {
      toast({ title: 'שגיאה במחיקה', description: err.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-accent/30 text-foreground/60">
          <tr>
            <th className="text-right p-3 font-medium">יצירה</th>
            <th className="text-right p-3 font-medium">אמן</th>
            <th className="text-right p-3 font-medium hidden md:table-cell">Slug</th>
            <th className="text-right p-3 font-medium hidden md:table-cell">מיקום</th>
            <th className="text-right p-3 font-medium w-24">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border/40 hover:bg-accent/10">
              <td className="p-3 font-medium text-foreground">{item.title || '—'}</td>
              <td className="p-3 text-foreground/70">{item.artist_name || '—'}</td>
              <td className="p-3 text-foreground/50 hidden md:table-cell" dir="ltr">{item.slug || '—'}</td>
              <td className="p-3 text-foreground/50 hidden md:table-cell">{item.location || '—'}</td>
              <td className="p-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary/70"
                    title="עריכה"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 disabled:opacity-50"
                    title="מחיקה"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}