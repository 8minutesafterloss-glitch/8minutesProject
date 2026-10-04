import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const records = await base44.entities.Meeting.list();
        setMeetings(records);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }
    load();
  }, []);

  const updateMeeting = useCallback(async (id, field, value) => {
    await base44.entities.Meeting.update(id, { [field]: value });
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }, []);

  const updateMeetingPoint = useCallback(async (id, pointIndex, field, value) => {
    const meeting = meetings.find(m => m.id === id);
    if (!meeting) return;
    let points = [];
    try {
      points = typeof meeting.points === 'string' ? JSON.parse(meeting.points) : (meeting.points || []);
    } catch {
      points = [];
    }
    if (!points[pointIndex]) return;
    points[pointIndex][field] = value;
    const pointsStr = JSON.stringify(points);
    await base44.entities.Meeting.update(id, { points: pointsStr });
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, points: pointsStr } : m));
  }, [meetings]);

  const createMeeting = useCallback(async (data) => {
    const record = await base44.entities.Meeting.create(data);
    setMeetings(prev => [...prev, record]);
    return record;
  }, []);

  const updateMeetingData = useCallback(async (id, data) => {
    await base44.entities.Meeting.update(id, data);
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  }, []);

  const deleteMeeting = useCallback(async (id) => {
    await base44.entities.Meeting.delete(id);
    setMeetings(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <MeetingsContext.Provider value={{ meetings, loading, isAdmin, updateMeeting, updateMeetingPoint, createMeeting, updateMeetingData, deleteMeeting }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error('useMeetings must be used within MeetingsProvider');
  return ctx;
}