import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Calendar, Clock, TrendingUp, Infinity as InfinityIcon } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_COLORS = ['#7b5fb8', '#634f96', '#46366c'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [users, meetings, events, registrations] = await Promise.all([
          base44.entities.User.list(),
          base44.entities.Meeting.list(),
          base44.entities.Event.list(),
          base44.entities.Registration.list(),
        ]);

        const userGrowth = {};
        users.forEach((u) => {
          if (!u.created_date) return;
          const d = new Date(u.created_date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          userGrowth[key] = (userGrowth[key] || 0) + 1;
        });
        const growthData = Object.keys(userGrowth)
          .sort()
          .map((k) => {
            const [y, m] = k.split('-');
            const label = new Date(y, m - 1).toLocaleDateString('he-IL', {
              month: 'short',
              year: '2-digit',
            });
            return { name: label, משתמשות: userGrowth[k] };
          });

        const roleCount = {};
        users.forEach((u) => {
          const r = u.role || 'user';
          roleCount[r] = (roleCount[r] || 0) + 1;
        });
        const roleData = Object.entries(roleCount).map(([name, value]) => ({
          name: name === 'admin' ? 'מנהלות' : 'משתמשות',
          value,
        }));

        const regByEvent = {};
        registrations.forEach((r) => {
          regByEvent[r.event_id] = (regByEvent[r.event_id] || 0) + 1;
        });
        const eventData = events.map((ev) => ({
          name: ev.title && ev.title.length > 20 ? ev.title.slice(0, 20) + '…' : ev.title || '',
          הרשמות: regByEvent[ev.id] || 0,
        }));

        const accumulatedMinutes = (meetings.length + events.length) * 8;

        setData({
          totalUsers: users.length,
          totalMeetings: meetings.length,
          totalEvents: events.length,
          totalRegistrations: registrations.length,
          accumulatedMinutes,
          growthData,
          roleData,
          eventData,
        });
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'משתתפות פעילות', value: data.totalUsers, icon: Users, gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { label: 'מפגשים שהתקיימו', value: data.totalMeetings, icon: Calendar, gradient: 'bg-gradient-to-br from-violet-500 to-purple-600' },
    { label: 'אירועים קרובים', value: data.totalEvents, icon: TrendingUp, gradient: 'bg-gradient-to-br from-indigo-500 to-violet-600' },
    { label: 'דקות מצטברות', value: data.accumulatedMinutes, icon: Clock, gradient: 'bg-gradient-to-br from-fuchsia-500 to-purple-600' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <InfinityIcon className="w-5 h-5 text-gradient-purple" />
          <span className="text-sm font-medium text-primary/60">דאשבורד</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">סטטיסטיקות</h1>
        <p className="text-foreground/60 mt-3">נתונים ומגמות על הפעילות במיזם.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-white border border-border/50">
              <div className={`w-10 h-10 rounded-xl ${s.gradient} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-heading text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-foreground/50 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {data.growthData.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-border/50">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">צמיחת קהילה לאורך זמן</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="משתמשות" stroke="#7b5fb8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.roleData.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-border/50">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">חלוקת משתמשות לפי תפקיד</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {data.roleData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.eventData.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-border/50 lg:col-span-2">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">הרשמות לאירועים</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.eventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="הרשמות" fill="#7b5fb8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}