
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Users, BookOpen, Calendar, Settings, Home, LogOut } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Interview', path: '/interview', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="h-full bg-sidebar flex flex-col overflow-hidden">
      <div className="py-6 px-4 flex items-center justify-center">
        {!collapsed ? (
          <h1 className="text-white text-xl font-medium tracking-tight animate-fade-in">ToYouSoftEms</h1>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center">
            <span className="text-white font-semibold text-lg">T</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-4 px-2">
        <div className="space-y-1.5">
          {navigation.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`sidebar-link ${active ? 'active' : ''} ${
                  collapsed ? 'justify-center' : ''
                }`}
              >
                <item.icon size={collapsed ? 20 : 18} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="py-6 px-2">
        <div className={`sidebar-link ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={collapsed ? 20 : 18} />
          {!collapsed && <span>Sign Out</span>}
        </div>
      </div>
    </div>
  );
};
