import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-soft-lavender" dir="rtl">
      <Navbar />
      <main className="pt-20 pb-24">
        <Outlet />
      </main>
      <Footer />
      <AdminNav />
    </div>
  );
}