'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { ParkingZone, ParkingSession } from '@/lib/types';

export default function ParkingMapPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

  const zones = datacoreData.parkingZones as ParkingZone[];
  const sessions = datacoreData.parkingSessions as ParkingSession[];

  const getZoneColor = (status: string) => {
    switch (status) {
      case 'available': return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-100' };
      case 'nearly_full': return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-100' };
      case 'full': return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-100' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-700', light: 'bg-gray-100' };
    }
  };

  const generateSlots = (zone: ParkingZone) => {
    const slots = [];
    const occupiedCount = zone.totalSlots - zone.availableSlots;
    const activeSessions = sessions.filter(s => s.zoneId === zone.zoneId && s.status === 'active');
    
    for (let i = 1; i <= zone.totalSlots; i++) {
      const slotId = `${zone.zoneId.split('-')[1]}-${i.toString().padStart(2, '0')}`;
      const session = activeSessions.find(s => s.slotId === slotId);
      const isOccupied = i <= occupiedCount || session;
      
      slots.push({
        id: slotId,
        occupied: isOccupied,
        session: session || null,
        hasSensorIssue: i === 35 && zone.zoneId === 'ZONE-B'
      });
    }
    return slots;
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const totalSlots = zones.reduce((acc, z) => acc + z.totalSlots, 0);
  const totalAvailable = zones.reduce((acc, z) => acc + z.availableSlots, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Real-Time Parking Map</h1>
            <p className="text-gray-500 mt-1">Live parking availability (UC-RTM-05)</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{totalAvailable}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{totalSlots - totalAvailable}</p>
                  <p className="text-xs text-gray-500">Occupied</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalSlots}</p>
                  <p className="text-xs text-gray-500">Total Slots</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{Math.round((totalSlots - totalAvailable) / totalSlots * 100)}%</p>
                  <p className="text-xs text-gray-500">Occupancy</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">Sensor Issue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Your Vehicle</span>
          </div>
        </div>

        {/* Zone Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => {
            const colors = getZoneColor(zone.status);
            return (
              <Card 
                key={zone.zoneId}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedZone === zone.zoneId ? 'ring-2 ring-[#003366]' : ''
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.zoneId ? null : zone.zoneId)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{zone.zoneName}</CardTitle>
                    <Badge className={`${colors.light} ${colors.text}`}>
                      {zone.status === 'nearly_full' ? 'Nearly Full' : zone.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{zone.availableSlots}</p>
                      <p className="text-xs text-gray-500">of {zone.totalSlots} available</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 mb-1">
                        {zone.vehicleTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs capitalize">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={colors.bg}
                          style={{ width: `${((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100}%`, height: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Slot View */}
        {selectedZone && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {zones.find(z => z.zoneId === selectedZone)?.zoneName} - Slot Map
              </CardTitle>
              <CardDescription>
                Click on a slot to view details. Green = Available, Red = Occupied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {generateSlots(zones.find(z => z.zoneId === selectedZone)!).map((slot) => (
                  <div
                    key={slot.id}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                      cursor-pointer transition-all hover:scale-105
                      ${slot.hasSensorIssue 
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' 
                        : slot.occupied 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }
                    `}
                    title={
                      slot.hasSensorIssue 
                        ? 'Sensor malfunction - status unknown'
                        : slot.occupied 
                          ? `Occupied${slot.session ? ` - ${slot.session.vehiclePlate}` : ''}`
                          : 'Available'
                    }
                  >
                    {slot.hasSensorIssue ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : slot.occupied ? (
                      <Car className="w-4 h-4" />
                    ) : (
                      slot.id.split('-')[1]
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Electronic Signage Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Electronic Guidance Signage (UC-RTM-03)</CardTitle>
            <CardDescription>
              Simulated display showing what would appear on physical LED boards at entry points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {zones.map((zone) => {
                const colors = getZoneColor(zone.status);
                return (
                  <div 
                    key={zone.zoneId}
                    className="bg-gray-900 rounded-lg p-4 text-center"
                  >
                    <p className="text-gray-400 text-xs mb-2">{zone.zoneName}</p>
                    <div className={`text-4xl font-bold font-mono ${
                      zone.status === 'full' ? 'text-red-500' :
                      zone.status === 'nearly_full' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {zone.status === 'full' ? 'FULL' : zone.availableSlots}
                    </div>
                    {zone.status !== 'full' && (
                      <p className="text-gray-400 text-xs mt-1">AVAILABLE</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
