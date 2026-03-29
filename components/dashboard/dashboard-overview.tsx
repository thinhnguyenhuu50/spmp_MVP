'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  MapPin, 
  Clock, 
  CreditCard, 
  TrendingUp, 
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingZone, ParkingSession, User } from '@/lib/types';

export function DashboardOverview() {
  const { user } = useAuth();
  const zones = datacoreData.parkingZones as ParkingZone[];
  const sessions = datacoreData.parkingSessions as ParkingSession[];
  const allUsers = datacoreData.users as User[];

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';
  const isAdminOrOperator = isAdmin || isOperator;

  const totalSlots = zones.reduce((acc, zone) => acc + zone.totalSlots, 0);
  const availableSlots = zones.reduce((acc, zone) => acc + zone.availableSlots, 0);
  const occupiedSlots = totalSlots - availableSlots;
  const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);

  const activeSessions = sessions.filter(s => s.status === 'active');
  const userActiveSessions = sessions.filter(s => s.userId === user?.userId && s.status === 'active');
  const visitorSessions = activeSessions.filter(s => s.isVisitor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'nearly_full': return 'bg-yellow-100 text-yellow-700';
      case 'full': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName?.split(' ').slice(-1)[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdminOrOperator 
              ? 'Here\'s an overview of the parking system status.'
              : 'Here\'s your parking overview for today.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/parking-map">
            <Button className="bg-[#003366] hover:bg-[#002244]">
              <MapPin className="w-4 h-4 mr-2" />
              View Parking Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdminOrOperator ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Slots</CardTitle>
                <Car className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSlots}</div>
                <p className="text-xs text-gray-500 mt-1">Across {zones.length} zones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Available</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
                <p className="text-xs text-gray-500 mt-1">{100 - occupancyRate}% available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Occupied</CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{occupiedSlots}</div>
                <p className="text-xs text-gray-500 mt-1">{occupancyRate}% occupancy rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Sessions</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSessions.length}</div>
                <p className="text-xs text-gray-500 mt-1">{visitorSessions.length} visitors</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">My Active Sessions</CardTitle>
                <Car className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userActiveSessions.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {userActiveSessions.length > 0 ? 'Currently parked' : 'No active sessions'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Available Slots</CardTitle>
                <MapPin className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
                <p className="text-xs text-gray-500 mt-1">Out of {totalSlots} total slots</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Current Debt</CardTitle>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(user?.currentDebt || 0).toLocaleString('vi-VN')}
                </div>
                <p className="text-xs text-gray-500 mt-1">VND via BKPay</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Vehicle</CardTitle>
                <Car className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{user?.vehiclePlate}</div>
                <p className="text-xs text-gray-500 mt-1 capitalize">{user?.vehicleType}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Zone Status */}
      <Card>
        <CardHeader>
          <CardTitle>Parking Zone Status</CardTitle>
          <CardDescription>Real-time availability across all parking zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <div 
                key={zone.zoneId}
                className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{zone.zoneName}</h3>
                  <Badge className={getStatusColor(zone.status)}>
                    {zone.status === 'nearly_full' ? 'Nearly Full' : zone.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#003366]">{zone.availableSlots}</p>
                    <p className="text-xs text-gray-500">of {zone.totalSlots} available</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          zone.status === 'full' ? 'bg-red-500' :
                          zone.status === 'nearly_full' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isAdminOrOperator ? 'Recent Active Sessions' : 'My Active Sessions'}
          </CardTitle>
          <CardDescription>
            {isAdminOrOperator 
              ? 'Currently active parking sessions in the system'
              : 'Your currently active parking sessions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(isAdminOrOperator ? activeSessions : userActiveSessions).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active sessions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Session ID</th>
                    {isAdminOrOperator && <th className="text-left py-3 px-2 font-medium text-gray-500">User</th>}
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Zone</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Slot</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Entry Time</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Duration</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(isAdminOrOperator ? activeSessions.slice(0, 5) : userActiveSessions).map((session) => {
                    const zone = zones.find(z => z.zoneId === session.zoneId);
                    const sessionUser = allUsers.find(u => u.userId === session.userId);
                    const entryTime = new Date(session.entryTime);
                    const duration = Math.round((Date.now() - entryTime.getTime()) / (1000 * 60));
                    const hours = Math.floor(duration / 60);
                    const minutes = duration % 60;

                    return (
                      <tr key={session.sessionId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 font-mono text-xs">{session.sessionId}</td>
                        {isAdminOrOperator && (
                          <td className="py-3 px-2">
                            {session.isVisitor ? (
                              <span className="text-orange-600">Visitor</span>
                            ) : (
                              sessionUser?.fullName || 'Unknown'
                            )}
                          </td>
                        )}
                        <td className="py-3 px-2">{zone?.zoneName || session.zoneId}</td>
                        <td className="py-3 px-2 font-medium">{session.slotId}</td>
                        <td className="py-3 px-2">
                          {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {hours}h {minutes}m
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {isAdminOrOperator && activeSessions.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/dashboard/sessions">
                <Button variant="outline" size="sm">
                  View All Sessions
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin-only: System Notifications */}
      {isAdminOrOperator && (
        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>Recent system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datacoreData.systemNotifications.map((notification) => (
                <div 
                  key={notification.notificationId}
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    notification.type === 'alert' ? 'bg-red-50 border-red-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    notification.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    notification.type === 'alert' ? 'text-red-500' :
                    notification.type === 'warning' ? 'text-yellow-500' :
                    notification.type === 'success' ? 'text-green-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
