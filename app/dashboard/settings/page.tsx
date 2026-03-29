'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Shield, 
  Bell, 
  Car, 
  CreditCard,
  Key,
  Mail,
  Phone,
  Building,
  Save
} from 'lucide-react';

export default function SettingsPage() {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'operator': return 'bg-orange-100 text-orange-700';
      case 'faculty': return 'bg-purple-100 text-purple-700';
      case 'staff': return 'bg-blue-100 text-blue-700';
      case 'learner': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal information synced from HCMUT_DATACORE (read-only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#003366] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user?.fullName}</h3>
                    <p className="text-gray-500">{user?.email}</p>
                    <Badge className={`mt-1 ${getRoleBadgeColor(user?.role || '')}`}>
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Full Name
                    </label>
                    <Input value={user?.fullName} disabled className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      Email
                    </label>
                    <Input value={user?.email} disabled className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Phone
                    </label>
                    <Input value={user?.phone} disabled className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      {user?.role === 'learner' ? 'Faculty' : 'Department'}
                    </label>
                    <Input value={user?.faculty || user?.department} disabled className="bg-gray-50" />
                  </div>
                  {user?.studentId && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        Student ID
                      </label>
                      <Input value={user.studentId} disabled className="bg-gray-50" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Card ID
                    </label>
                    <Input value={user?.cardId} disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Profile information is synchronized from HCMUT_DATACORE and cannot be modified directly. 
                    To update your information, please contact the university administration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicle Tab */}
          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>
                  Your registered vehicle details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Plate</label>
                    <Input value={user?.vehiclePlate} disabled className="bg-gray-50 text-lg font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <Input value={user?.vehicleType?.toUpperCase()} disabled className="bg-gray-50 capitalize" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Applicable Pricing Policy</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Rate Type:</span>
                    <span className="font-medium">
                      {user?.role === 'faculty' ? 'Exempt' : 'Accumulated (Monthly)'}
                    </span>
                    <span className="text-gray-500">Flat Rate:</span>
                    <span className="font-medium">
                      {user?.role === 'faculty' ? '0 VND' : '5,000 VND/day'}
                    </span>
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-medium">BKPay</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    <strong>To register a new vehicle:</strong> Please visit the parking office with your 
                    vehicle registration documents and student/staff ID.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Parking Entry/Exit Alerts</p>
                      <p className="text-sm text-gray-500">Receive notifications when you enter or exit the parking lot</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Billing Notifications</p>
                      <p className="text-sm text-gray-500">Get notified about pending payments and billing cycles</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Zone Availability Alerts</p>
                      <p className="text-sm text-gray-500">Receive alerts when your preferred zone is full</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">System Announcements</p>
                      <p className="text-sm text-gray-500">Important updates about the parking system</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="bg-[#003366] hover:bg-[#002244]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Account Status: Secure</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your account is protected by HCMUT SSO authentication.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Password</p>
                      <Badge variant="outline">HCMUT SSO</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Your password is managed through HCMUT SSO. To change your password, 
                      please use the SSO password change portal.
                    </p>
                    <Button variant="outline" size="sm">
                      Change Password via SSO
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <Badge className="bg-yellow-100 text-yellow-700">Not Enabled</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Add an extra layer of security to your account.
                    </p>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Recent Login Activity</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Today, 9:30 AM</span>
                        <span>Smart Parking System</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Yesterday, 3:15 PM</span>
                        <span>MyBK Portal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
