
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService, DashboardData } from '@/services/dashboardService';

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  change, 
  link 
}: { 
  title: string; 
  value: string | number; 
  description?: string; 
  icon: React.ElementType; 
  change?: { value: number; positive: boolean }; 
  link: string;
}) => (
  <Card className="glass-card hover-scale">
    <Link to={link} className="block h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {change && (
            <span className={`flex items-center text-xs ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
              {change.positive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {Math.abs(change.value)}%
            </span>
          )}
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
      </CardContent>
    </Link>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your activities.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card hover-scale animate-pulse">
              <div className="h-32"></div>
            </Card>
            <Card className="glass-card hover-scale animate-pulse">
              <div className="h-32"></div>
            </Card>
          </div>
        ) : error ? (
          <Card className="glass-card p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Card>
        ) : dashboardData ? (
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard
              title="Resumes"
              value={dashboardData.resumeStats.total}
              description={`${dashboardData.resumeStats.pending} pending review`}
              icon={FileText}
              change={{ value: 
                dashboardData.resumeStats.total > 0 
                  ? Math.round((dashboardData.resumeStats.approved / dashboardData.resumeStats.total) * 100) 
                  : 0, 
                positive: true 
              }}
              link="/resume"
            />
            <DashboardCard
              title="Interview Questions"
              value={dashboardData.questionStats.total}
              description={`${dashboardData.questionStats.recent} new this week`}
              icon={Users}
              change={{ 
                value: dashboardData.questionStats.recent, 
                positive: dashboardData.questionStats.recent > 0 
              }}
              link="/interview"
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard
              title="Resumes"
              value={12}
              description="3 pending review"
              icon={FileText}
              change={{ value: 12, positive: true }}
              link="/resume"
            />
            <DashboardCard
              title="Interview Questions"
              value={42}
              description="8 new this week"
              icon={Users}
              change={{ value: 8, positive: true }}
              link="/interview"
            />
          </div>
        )}
        
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Welcome to ToYouSoftEms</CardTitle>
            <CardDescription>Employee Management System</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>ToYouSoftEms helps you manage your professional development journey.</p>
              <p>Use the sidebar to navigate between different sections:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Review and update your <strong>Resume</strong></li>
                <li>Prepare for <strong>Interviews</strong> with practice questions</li>
                <li>Manage your <strong>Settings</strong> and profile information</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
