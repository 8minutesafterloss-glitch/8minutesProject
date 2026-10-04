import React, { useState, useEffect, useCallback } from 'react';
import { Check, Plus, Trash2, Loader2, ListTodo, Circle, User, Flame } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ASSIGNEES = ['נאורה', 'רוני'];
const PRIORITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const priorityColor = (p) => {
  if (!p) return 'text-foreground/40 bg-muted';
  if (p <= 3) return 'text-white bg-red-500';
  if (p <= 6) return 'text-white bg-amber-500';
  return 'text-foreground/60 bg-accent';
};

export default function AdminTodoList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newProgress, setNewProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterRange, setFilterRange] = useState('today');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const recs = await base44.entities.AdminTask.list('-created_date', 100);
      setTasks(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const rangeStart = {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
    month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
    all: null,
  }[filterRange];

  const visibleTasks = tasks.filter((t) => {
    const created = new Date(t.created_date);
    const inRange = !rangeStart || created >= rangeStart;
    const matchAssignee = filterAssignee === 'all' || t.assignee === filterAssignee;
    return inRange && matchAssignee;
  });
  const completed = visibleTasks.filter((t) => t.completed).length;
  const total = visibleTasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const rec = await base44.entities.AdminTask.create({
        title: newTitle.trim(),
        completed: false,
        assignee: newAssignee || null,
        priority: newPriority ? Number(newPriority) : null,
        progress: newProgress !== '' ? Number(newProgress) : 0,
      });
      setTasks((prev) => [rec, ...prev]);
      setNewTitle('');
      setNewAssignee('');
      setNewPriority('');
      setNewProgress('');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      await base44.entities.AdminTask.update(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (task, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
    try {
      await base44.entities.AdminTask.update(task.id, patch);
    } catch (e) {
      console.error(e);
      load();
    }
  };

  const handleDelete = async (task) => {
    try {
      await base44.entities.AdminTask.delete(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      console.error(e);
    }
  };

  const todayLabel = new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-white rounded-3xl p-7 border border-border/40 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-primary">מטלות היום</h2>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterRange} onValueChange={setFilterRange}>
            <SelectTrigger className="h-8 w-32 px-3 rounded-full border border-border bg-white text-xs h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">היום</SelectItem>
              <SelectItem value="week">שבוע אחרון</SelectItem>
              <SelectItem value="month">חודש אחרון</SelectItem>
              <SelectItem value="all">הכל</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="h-8 w-28 px-3 rounded-full border border-border bg-white text-xs h-auto">
              <User className="w-3.5 h-3.5 text-foreground/40 ml-1" />
              <SelectValue placeholder="כולם" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כולם</SelectItem>
              {ASSIGNEES.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-foreground/45">{todayLabel}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground/60">
            {completed} מתוך {total} הושלמו
          </span>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-purple rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Add */}
      <div className="flex flex-col lg:flex-row gap-2 mb-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="מטלה חדשה..."
          className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
        />
        <Select value={newAssignee} onValueChange={setNewAssignee}>
          <SelectTrigger className="lg:w-32 px-3 py-2.5 rounded-xl border border-border bg-white text-sm h-auto">
            <User className="w-3.5 h-3.5 text-foreground/40 ml-1" />
            <SelectValue placeholder="אדם" />
          </SelectTrigger>
          <SelectContent>
            {ASSIGNEES.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={newPriority} onValueChange={setNewPriority}>
          <SelectTrigger className="lg:w-32 px-3 py-2.5 rounded-xl border border-border bg-white text-sm h-auto">
            <Flame className="w-3.5 h-3.5 text-foreground/40 ml-1" />
            <SelectValue placeholder="דחיפות" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={String(p)}>{p} {p === 1 ? '(דחוף ביותר)' : ''}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative lg:w-28">
          <input
            type="number"
            min={0}
            max={100}
            value={newProgress}
            onChange={(e) => setNewProgress(e.target.value)}
            placeholder="אחוז"
            className="w-full px-3 py-2.5 pr-7 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">%</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !newTitle.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-purple text-white text-sm font-semibold disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          הוסף
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="text-center py-8">
          <Circle className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-foreground/40">אין מטלות בטווח הנבחר. התחילי בהוספת מטלה למעלה.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border/40 bg-white hover:bg-accent/20 transition-colors group"
            >
              <button
                onClick={() => handleToggle(task)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-gradient-purple border-transparent text-white'
                    : 'border-border hover:border-primary'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5" />}
              </button>
              <span
                className={`flex-1 min-w-0 text-sm ${
                  task.completed ? 'text-foreground/40 line-through' : 'text-foreground/80'
                }`}
              >
                {task.title}
              </span>
              {task.progress >= 100 && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white flex-shrink-0">
                  <Check className="w-4 h-4" />
                </span>
              )}
              {task.assignee && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary/70 bg-accent/40 px-2 py-1 rounded-full whitespace-nowrap">
                  <User className="w-3 h-3" />
                  {task.assignee}
                </span>
              )}
              <Select
                value={task.priority ? String(task.priority) : ''}
                onValueChange={(v) => handleUpdate(task, { priority: Number(v) })}
              >
                <SelectTrigger className={`w-20 h-7 text-xs font-bold rounded-full border-0 ${priorityColor(task.priority)}`}>
                  <Flame className="w-3 h-3 ml-0.5" />
                  <SelectValue placeholder="דחיפות" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={String(p)}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={task.progress ?? 0}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, Number(e.target.value)));
                    handleUpdate(task, { progress: val });
                  }}
                  className="w-14 h-7 px-1.5 text-xs text-center rounded-full border border-border bg-white focus:outline-none focus:border-primary"
                />
                <span className="text-xs text-foreground/40">%</span>
              </div>
              <button
                onClick={() => handleDelete(task)}
                className="p-1.5 rounded-lg text-foreground/20 hover:text-destructive hover:bg-destructive/5 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}