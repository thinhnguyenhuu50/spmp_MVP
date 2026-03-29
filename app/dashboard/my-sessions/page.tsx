'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Clock, Car, MapPin, Calendar } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingSession, ParkingZone, ParkingHistory } from '@/lib/types';

export default function MySessionsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sessions = datacoreData.parkingSessions as ParkingSession[];
  const history = datacoreData.parkingHistory as ParkingHistory[];
  const zones = datacoreData.parkingZones as ParkingZone[];

  const userActiveSessions = sessions.filter(s => s.userId === user?.userId && s.status === 'active');
  const userHistory = history.filter(h => h.userId === user?.userId);

  const formatDuration = (entryTime: string, exitTime: string | null) => {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const minutes = Math.round((exit.getTime() - entry.getTime()) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalSpent = userHistory.reduce((acc, h) => acc + h.fee, 0);
  const totalSessions = userHistory.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Parking Sessions</h1>
          <p className="text-gray-500 mt-1">View your parking history and active sessions</p>
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
                  <p className="text-2xl font-bold">{userActiveSessions.length}</p>
                  <p className="text-xs text-gray-500">Active Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <History className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                  <p className="text-xs text-gray-500">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {totalSessions > 0 ? Math.round(userHistory.reduce((acc, h) => {
                      const entry = new Date(h.entryTime);
                      const exit = new Date(h.exitTime);
                      return acc + (exit.getTime() - entry.getTime()) / (1000 * 60 * 60);
                    }, 0) / totalSessions) : 0}h
                  </p>
                  <p className="text-xs text-gray-500">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSpent.toLocaleString('vi-VN')}</p>
                  <p className="text-xs text-gray-500">Total Spent (VND)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Session */}
        {userActiveSessions.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Car className="w-5 h-5" />
                Currently Parked
              </CardTitle>
              <CardDescription className="text-green-700">
                Your vehicle is currently in the parking lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userActiveSessions.map((session) => {
                  const zone = zones.find(z => z.zoneId === session.zoneId);
                  const entryTime = new Date(session.entryTime);

                  return (
                    <div key={session.sessionId} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-green-100 text-green-700">ACTIVE</Badge>
                        <span className="text-xs text-gray-500">{session.sessionId}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{zone?.zoneName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">Slot {session.slotId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            Entry: {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatDuration(session.entryTime, null)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Parking History
            </CardTitle>
            <CardDescription>
              Your past parking sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No parking history yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Zone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Entry</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Exit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Fee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userHistory.map((session) => {
                      const zone = zones.find(z => z.zoneId === session.zoneId);
                      const entryTime = new Date(session.entryTime);
                      const exitTime = new Date(session.exitTime);

                      return (
                        <tr key={session.sessionId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {entryTime.toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4">{zone?.zoneName || session.zoneId}</td>
                          <td className="py-3 px-4">
                            {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            {exitTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            {formatDuration(session.entryTime, session.exitTime)}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            {session.fee.toLocaleString('vi-VN')} VND
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
