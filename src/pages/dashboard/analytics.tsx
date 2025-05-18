
import { useState } from 'react';
import { BarChart, AreaChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';
import AppLayout from '@/components/layout/app-layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { UserRole } from '@/types';
import { formatPrice } from '@/lib/utils';
import { getAnalytics } from '@/lib/data';

export default function Analytics() {
  const analytics = getAnalytics();
  
  // Create chart data for materials breakdown
  const categoryData = analytics.categoryBreakdown.map(item => ({
    name: item.category.replace('_', ' ').replace(/_/g, '-').split(' ')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' '),
    weight: parseFloat(item.totalKg.toFixed(1)),
    amount: item.totalPayout
  }));
  
  // Create monthly chart data (in a real app, this would come from the backend)
  // Here we're generating some mock data for demonstration
  const today = new Date();
  const mockMonthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - 29 + i);
    
    // Generate some pattern where weekends have more pickups
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const multiplier = isWeekend ? 1.5 : 1;
    
    // Base value plus some randomness, higher towards the end of the month
    const baseValue = 5 + (i / 30) * 10;
    const randomFactor = Math.random() * 5;
    
    const value = Math.max(0, Math.round((baseValue + randomFactor) * multiplier));
    
    return {
      date: date.toISOString().slice(0, 10),
      pickups: value,
      weight: parseFloat((value * (1.5 + Math.random())).toFixed(1))
    };
  });
  
  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Listings"
            value={analytics.totalListings.toString()}
            description="This Month"
            trend={+12}
          />
          <SummaryCard
            title="Collected Material"
            value={`${analytics.totalCollectedKg.toFixed(1)} kg`}
            description="This Month"
            trend={+8}
          />
          <SummaryCard
            title="Pending Pickups"
            value={analytics.pendingListings.toString()}
            description="Awaiting Schedule"
            trend={0}
          />
          <SummaryCard
            title="Total Payouts"
            value={formatPrice(analytics.totalPayout)}
            description="This Month"
            trend={+15}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Pickups</CardTitle>
              <CardDescription>Number of pickups completed per day</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyData}>
                  <defs>
                    <linearGradient id="colorPickups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25b63c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#25b63c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    tick={{ fontSize: 12 }}
                    tickCount={5}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip 
                    formatter={(value: number) => [`${value} pickups`, 'Pickups']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                      });
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pickups" 
                    stroke="#25b63c" 
                    fillOpacity={1} 
                    fill="url(#colorPickups)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Material Types</CardTitle>
              <CardDescription>Breakdown by material category (kg)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'weight' ? `${value} kg` : formatPrice(value),
                      name === 'weight' ? 'Weight' : 'Amount'
                    ]}
                  />
                  <Bar dataKey="weight" fill="#25b63c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Material Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Material Breakdown</CardTitle>
            <CardDescription>Detailed breakdown by material type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Material Type</th>
                    <th className="py-3 px-4 text-right">Weight (kg)</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-right">Avg. Price/kg</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categoryBreakdown.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">
                        {item.category.replace('_', ' ').replace(/_/g, '-').split(' ')
                          .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                          .join(' ')}
                      </td>
                      <td className="py-3 px-4 text-right">{item.totalKg.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(item.totalPayout)}</td>
                      <td className="py-3 px-4 text-right">
                        {formatPrice(item.totalKg > 0 ? item.totalPayout / item.totalKg : 0)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 text-right">{analytics.totalCollectedKg.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right">{formatPrice(analytics.totalPayout)}</td>
                    <td className="py-3 px-4 text-right">
                      {formatPrice(analytics.totalCollectedKg > 0 
                        ? analytics.totalPayout / analytics.totalCollectedKg 
                        : 0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  trend?: number;
}

function SummaryCard({ title, value, description, trend = 0 }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          {trend !== 0 && (
            <div className={`text-xs font-medium ${
              trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : ''} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
