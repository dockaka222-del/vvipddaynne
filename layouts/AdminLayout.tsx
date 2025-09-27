import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>
      <main className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
