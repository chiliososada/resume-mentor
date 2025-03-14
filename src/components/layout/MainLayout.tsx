
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div 
        className={`h-full transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[80px]' : 'w-[260px]'
        }`}
      >
        <Sidebar collapsed={collapsed} />
      </div>
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm border-b border-border">
          <button 
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-border transition-colors hover:bg-muted"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
        
        <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
