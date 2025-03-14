
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Calendar, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your activities.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <DashboardCard
            title="Attendance Rate"
            value="95%"
            description="Last 30 days"
            icon={Calendar}
            change={{ value: 2, positive: true }}
            link="/attendance"
          />
          <DashboardCard
            title="Active Courses"
            value={4}
            description="1 starting soon"
            icon={BookOpen}
            link="/courses"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card md:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your most recent interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-foreground/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New interview question added</p>
                      <p className="text-sm text-muted-foreground">
                        "How would you design a system for real-time notifications?"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-lg border animate-in" 
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <p className="text-sm font-medium">Mock Interview Session</p>
                    <p className="text-xs text-muted-foreground mt-1">Tomorrow, 2:00 PM</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
