'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ticket, Plus, QrCode, DollarSign, Car, Clock, CheckCircle } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingSession, ParkingZone, PricingPolicy } from '@/lib/types';

export default function VisitorTicketsPage() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const router = useRouter();
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [processPaymentOpen, setProcessPaymentOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [selectedZone, setSelectedZone] = useState('');

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
  const zones = datacoreData.parkingZones as ParkingZone[];
  const policies = datacoreData.pricingPolicies as PricingPolicy[];
  
  const visitorSessions = sessions.filter(s => s.isVisitor);
  const activeVisitorSessions = visitorSessions.filter(s => s.status === 'active');

  const calculateFee = (session: ParkingSession): number => {
    const entryTime = new Date(session.entryTime);
    const now = new Date();
    const hours = Math.ceil((now.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
    const visitorPolicy = policies.find(p => p.userRole === 'visitor' && p.vehicleType === 'motorbike');
    return hours * (visitorPolicy?.ratePerHour || 3000);
  };

  const generateTicketId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TKT-${dateStr}${random}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visitor Ticket Management</h1>
            <p className="text-gray-500 mt-1">Issue tickets and process payments (UC-ACC-02, UC-FO-02)</p>
          </div>
          <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#003366] hover:bg-[#002244]">
                <Plus className="w-4 h-4 mr-2" />
                Issue New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue Visitor Ticket</DialogTitle>
                <DialogDescription>
                  Create a new parking ticket for a visitor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <QrCode className="w-24 h-24 mx-auto text-gray-400" />
                  <p className="mt-2 font-mono text-lg font-bold">{generateTicketId()}</p>
                  <p className="text-xs text-gray-500">Ticket ID</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Plate (Optional)</label>
                  <Input 
                    placeholder="e.g., 51A-12345" 
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Captured by LPR camera for security logging</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Parking Zone</label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.filter(z => z.status !== 'full').map((zone) => (
                        <SelectItem key={zone.zoneId} value={zone.zoneId}>
                          {zone.zoneName} ({zone.availableSlots} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                  <p className="font-medium">Visitor Rate Information:</p>
                  <p>Motorbike: 3,000 VND/hour</p>
                  <p>Car: 10,000 VND/hour</p>
                </div>

                <Button 
                  className="w-full bg-[#003366] hover:bg-[#002244]"
                  onClick={() => setNewTicketOpen(false)}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Print Ticket & Open Gate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Ticket className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeVisitorSessions.length}</div>
                  <p className="text-xs text-gray-500">Active Visitor Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(15000).toLocaleString('vi-VN')}
                  </div>
                  <p className="text-xs text-gray-500">Today&apos;s Visitor Revenue (VND)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">Total Visitors Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Visitor Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Active Visitor Sessions
            </CardTitle>
            <CardDescription>
              Visitors currently parked - process payment on exit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeVisitorSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active visitor sessions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Ticket ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Vehicle Plate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Zone / Slot</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Entry Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Est. Fee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeVisitorSessions.map((session) => {
                      const zone = zones.find(z => z.zoneId === session.zoneId);
                      const entryTime = new Date(session.entryTime);
                      const duration = Math.round((Date.now() - entryTime.getTime()) / (1000 * 60));
                      const hours = Math.floor(duration / 60);
                      const minutes = duration % 60;
                      const fee = calculateFee(session);

                      return (
                        <tr key={session.sessionId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-xs font-semibold">
                            {session.ticketId}
                          </td>
                          <td className="py-3 px-4 font-medium">{session.vehiclePlate}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-xs text-gray-500">{zone?.zoneName}</p>
                              <p className="font-medium">{session.slotId}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {entryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {hours}h {minutes}m
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-orange-600">
                            {fee.toLocaleString('vi-VN')} VND
                          </td>
                          <td className="py-3 px-4">
                            <Dialog open={processPaymentOpen && selectedSession?.sessionId === session.sessionId} onOpenChange={setProcessPaymentOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => setSelectedSession(session)}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Process Exit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Process Visitor Payment</DialogTitle>
                                  <DialogDescription>
                                    Collect payment and complete parking session
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Ticket ID:</span>
                                      <span className="font-mono font-bold">{selectedSession?.ticketId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Vehicle:</span>
                                      <span className="font-medium">{selectedSession?.vehiclePlate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Duration:</span>
                                      <span className="font-medium">{hours}h {minutes}m</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg">
                                      <span className="font-semibold">Total Fee:</span>
                                      <span className="font-bold text-orange-600">
                                        {fee.toLocaleString('vi-VN')} VND
                                      </span>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <Select defaultValue="cash">
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="qr">QR Code</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <Button 
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => setProcessPaymentOpen(false)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Payment & Open Gate
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
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

        {/* Lost Ticket Handling */}
        <Card>
          <CardHeader>
            <CardTitle>Handle Access Exceptions (UC-ACC-05)</CardTitle>
            <CardDescription>
              Process lost tickets and manual overrides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Search by Vehicle Plate</label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Enter vehicle plate number..." />
                  <Button variant="outline">Search</Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Find entry record by license plate for lost ticket cases
                </p>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Manual Entry Override</label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Enter reason..." />
                  <Button variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                    Manual Override
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  All manual actions are logged for auditing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
