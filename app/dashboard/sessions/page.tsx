'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, History, Clock, Car, Download, Filter } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingSession, ParkingZone, User, ParkingHistory } from '@/lib/types';

export default function SessionsPage() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (currentUser?.role !== 'admin' && currentUser?.role !== 'operator') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || (currentUser?.role !== 'admin' && currentUser?.role !== 'operator')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sessions = datacoreData.parkingSessions as ParkingSession[];
  const history = datacoreData.parkingHistory as ParkingHistory[];
  const zones = datacoreData.parkingZones as ParkingZone[];
  const users = datacoreData.users as User[];

  const allSessions = [
    ...sessions,
    ...history.map(h => ({ ...h, exitTime: h.exitTime, slotId: 'N/A', vehiclePlate: 'N/A', ticketId: undefined, isVisitor: false }))
  ];

  const filteredSessions = allSessions.filter(session => {
    const user = users.find(u => u.userId === session.userId);
    const matchesSearch = 
      session.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.vehiclePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.slotId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZone = zoneFilter === 'all' || session.zoneId === zoneFilter;
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesZone && matchesStatus;
  });

  const activeSessions = filteredSessions.filter(s => s.status === 'active');
  const completedSessions = filteredSessions.filter(s => s.status === 'completed');

  const formatDuration = (entryTime: string, exitTime: string | null) => {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const minutes = Math.round((exit.getTime() - entry.getTime()) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const SessionTable = ({ sessionData }: { sessionData: typeof filteredSessions }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Session ID</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Vehicle</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Zone / Slot</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Entry Time</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Exit Time</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Fee</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessionData.map((session) => {
            const user = users.find(u => u.userId === session.userId);
            const zone = zones.find(z => z.zoneId === session.zoneId);
            const entryTime = new Date(session.entryTime);
            const exitTime = session.exitTime ? new Date(session.exitTime) : null;

            return (
              <tr key={session.sessionId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs">{session.sessionId}</td>
                <td className="py-3 px-4">
                  {session.isVisitor ? (
                    <div>
                      <span className="text-orange-600 font-medium">Visitor</span>
                      {session.ticketId && (
                        <p className="text-xs text-gray-500">{session.ticketId}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{user?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{user?.studentId || user?.department}</p>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{session.vehiclePlate || 'N/A'}</td>
                <td className="py-3 px-4">
                  <p className="text-xs text-gray-500">{zone?.zoneName || session.zoneId}</p>
                  <p className="font-medium">{session.slotId}</p>
                </td>
                <td className="py-3 px-4">
                  <p>{entryTime.toLocaleDateString('vi-VN')}</p>
                  <p className="text-xs text-gray-500">
                    {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
                <td className="py-3 px-4">
                  {exitTime ? (
                    <>
                      <p>{exitTime.toLocaleDateString('vi-VN')}</p>
                      <p className="text-xs text-gray-500">
                        {exitTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.entryTime, session.exitTime)}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold">
                  {session.fee > 0 ? (
                    <span className="text-green-600">{session.fee.toLocaleString('vi-VN')} VND</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge className={session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {session.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sessionData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No sessions found</p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parking Sessions</h1>
            <p className="text-gray-500 mt-1">View and manage all parking sessions</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeSessions.length}</p>
                  <p className="text-xs text-gray-500">Active Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <History className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedSessions.length}</p>
                  <p className="text-xs text-gray-500">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Car className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activeSessions.filter(s => s.isVisitor).length}
                  </p>
                  <p className="text-xs text-gray-500">Active Visitors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5h</p>
                  <p className="text-xs text-gray-500">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by session ID, vehicle plate, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  {zones.map((zone) => (
                    <SelectItem key={zone.zoneId} value={zone.zoneId}>
                      {zone.zoneName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Session Records
            </CardTitle>
            <CardDescription>
              All parking session data with entry/exit records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">
                  Active ({activeSessions.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedSessions.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({filteredSessions.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <SessionTable sessionData={activeSessions} />
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <SessionTable sessionData={completedSessions} />
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <SessionTable sessionData={filteredSessions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
