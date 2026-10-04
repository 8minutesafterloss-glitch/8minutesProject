import React from 'react';
import { Outlet } from 'react-router-dom';
import CenterNavbar from '@/components/center/CenterNavbar';
import CenterSidebar from '@/components/center/CenterSidebar';
import CenterFooter from '@/components/center/CenterFooter';
import CenterBreadcrumb from '@/components/center/CenterBreadcrumb';
import { CenterContentProvider } from '@/hooks/useCenterContent';
import SkipLink from '@/components/SkipLink';

export default function CenterLayout() {
  return (
    <CenterContentProvider>
      <div className="min-h-screen bg-[#F9F9F9]" dir="rtl">
        <SkipLink />
        <CenterNavbar />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          <CenterSidebar />
          <main id="main-content" className="flex-1 min-w-0">
            <CenterBreadcrumb />
            <Outlet />
          </main>
        </div>
        <CenterFooter />
      </div>
    </CenterContentProvider>
  );
}