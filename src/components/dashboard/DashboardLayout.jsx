import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background neural-bg">
      <Sidebar />
      <main className="lg:ml-[240px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}