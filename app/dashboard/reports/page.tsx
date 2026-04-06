'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  Users,
  Motorbike,
  DollarSign,
  Clock,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingZone, ParkingSession, User, Transaction, ParkingHistory } from '@/lib/types';

export default function ReportsPage() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const router = useRouter();
  const [reportType, setReportType] = useState('occupancy');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (currentUser?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const zones = datacoreData.parkingZones as ParkingZone[];
  const sessions = datacoreData.parkingSessions as ParkingSession[];
  const users = datacoreData.users as User[];
  const transactions = datacoreData.transactions as Transaction[];
  const history = datacoreData.parkingHistory as ParkingHistory[];

  // Mock data for charts
  const occupancyData = [
    { time: '06:00', occupancy: 15 },
    { time: '08:00', occupancy: 65 },
    { time: '10:00', occupancy: 85 },
    { time: '12:00', occupancy: 75 },
    { time: '14:00', occupancy: 90 },
    { time: '16:00', occupancy: 70 },
    { time: '18:00', occupancy: 40 },
    { time: '20:00', occupancy: 20 },
  ];

  const weeklyData = [
    { day: 'Mon', sessions: 245, revenue: 1225000 },
    { day: 'Tue', sessions: 312, revenue: 1560000 },
    { day: 'Wed', sessions: 287, revenue: 1435000 },
    { day: 'Thu', sessions: 298, revenue: 1490000 },
    { day: 'Fri', sessions: 356, revenue: 1780000 },
    { day: 'Sat', sessions: 189, revenue: 945000 },
    { day: 'Sun', sessions: 124, revenue: 620000 },
  ];

  const userTypeData = [
    { name: 'Learners', value: 65, color: '#22c55e' },
    { name: 'Faculty', value: 15, color: '#a855f7' },
    { name: 'Staff', value: 12, color: '#3b82f6' },
    { name: 'Visitors', value: 8, color: '#f97316' },
  ];

  const zoneUtilization = zones.map(z => ({
    zone: z.zoneName.split(' - ')[1] || z.zoneName,
    utilization: Math.round(((z.totalSlots - z.availableSlots) / z.totalSlots) * 100),
    available: z.availableSlots,
    total: z.totalSlots
  }));

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingDebt = transactions
    .filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSessions = sessions.length + history.length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">Generate utilization reports (UC-ADM-05)</p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Sessions</p>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last week</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Motorbike className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold">{(totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last week</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Occupancy</p>
                  <p className="text-2xl font-bold">74%</p>
                  <p className="text-xs text-gray-500 mt-1">Peak at 2PM</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Duration</p>
                  <p className="text-2xl font-bold">4.2h</p>
                  <p className="text-xs text-gray-500 mt-1">Per session</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Occupancy Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Daily Occupancy Pattern
              </CardTitle>
              <CardDescription>
                Average parking occupancy throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                    <Line 
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#003366" 
                      strokeWidth={2}
                      dot={{ fill: '#003366' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Sessions
              </CardTitle>
              <CardDescription>
                Number of parking sessions per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#003366" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of parking users by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {userTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Zone Utilization
              </CardTitle>
              <CardDescription>
                Current capacity usage by parking zone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneUtilization.map((zone) => (
                  <div key={zone.zone}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{zone.zone}</span>
                      <span className="text-gray-500">
                        {zone.total - zone.available}/{zone.total} slots ({zone.utilization}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          zone.utilization >= 90 ? 'bg-red-500' :
                          zone.utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${zone.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Summary
            </CardTitle>
            <CardDescription>
              Revenue and debt overview for the current period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">Total Revenue</p>
                <p className="text-2xl font-bold text-green-800">
                  {totalRevenue.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">Pending Debt</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {pendingDebt.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">Visitor Revenue</p>
                <p className="text-2xl font-bold text-blue-800">
                  15,000 VND
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">Avg Fee/Session</p>
                <p className="text-2xl font-bold text-purple-800">
                  4,500 VND
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
            <CardDescription>
              Select report type and date range to export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div 
                className="p-4 border rounded-lg hover:border-[#003366] hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setReportType('occupancy')}
              >
                <BarChart3 className="w-8 h-8 text-[#003366] mb-2" />
                <h4 className="font-semibold">Occupancy Statistics</h4>
                <p className="text-sm text-gray-500">Daily/weekly/monthly occupancy trends</p>
              </div>
              <div 
                className="p-4 border rounded-lg hover:border-[#003366] hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setReportType('revenue')}
              >
                <DollarSign className="w-8 h-8 text-[#003366] mb-2" />
                <h4 className="font-semibold">Revenue Summary</h4>
                <p className="text-sm text-gray-500">Financial transactions and billing</p>
              </div>
              <div 
                className="p-4 border rounded-lg hover:border-[#003366] hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setReportType('sessions')}
              >
                <Motorbike className="w-8 h-8 text-[#003366] mb-2" />
                <h4 className="font-semibold">Session Logs</h4>
                <p className="text-sm text-gray-500">Detailed parking session records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
