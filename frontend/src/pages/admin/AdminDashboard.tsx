import React from 'react';
import { Package, Users, Tag, Mail } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Total Products', value: '24', icon: Package },
    { name: 'Active Users', value: '156', icon: Users },
    { name: 'Categories', value: '12', icon: Tag },
    { name: 'Campaigns Sent', value: '3', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to the CarShop admin control panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="text-muted-foreground text-sm flex h-48 items-center justify-center border border-dashed rounded-lg">
            No recent activity to show.
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <div className="text-muted-foreground text-sm flex h-48 items-center justify-center border border-dashed rounded-lg">
            Dashboard widgets coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};
