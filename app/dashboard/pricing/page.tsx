'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { CreditCard, Edit, Plus, Save } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { PricingPolicy } from '@/lib/types';

export default function PricingPage() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const router = useRouter();
  const [selectedPolicy, setSelectedPolicy] = useState<PricingPolicy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const policies = datacoreData.pricingPolicies as PricingPolicy[];

  const getBillingTypeColor = (type: string) => {
    switch (type) {
      case 'accumulated': return 'bg-blue-100 text-blue-700';
      case 'immediate': return 'bg-orange-100 text-orange-700';
      case 'exempt': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Policies</h1>
            <p className="text-gray-500 mt-1">Configure parking fee structures (UC-ADM-04)</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#003366] hover:bg-[#002244]">
                <Plus className="w-4 h-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Pricing Policy</DialogTitle>
                <DialogDescription>
                  Define a new pricing policy for parking fees
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Policy Name</label>
                    <Input placeholder="e.g., Student - Motorbike" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User Role</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learner">Learner</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorbike">Motorbike</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accumulated">Accumulated (BKPay)</SelectItem>
                        <SelectItem value="immediate">Immediate Payment</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rate/Hour (VND)</label>
                    <Input type="number" placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Flat Rate (VND)</label>
                    <Input type="number" placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Daily (VND)</label>
                    <Input type="number" placeholder="10000" />
                  </div>
                </div>
                <Button className="w-full bg-[#003366] hover:bg-[#002244]">
                  <Save className="w-4 h-4 mr-2" />
                  Create Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy) => (
            <Card key={policy.policyId} className={!policy.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                  <Switch checked={policy.isActive} />
                </div>
                <CardDescription className="flex gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">{policy.userRole}</Badge>
                  <Badge variant="outline" className="capitalize">{policy.vehicleType}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Billing Type</span>
                    <Badge className={getBillingTypeColor(policy.billingType)}>
                      {policy.billingType.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {policy.billingType !== 'exempt' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Rate per Hour</span>
                        <span className="font-semibold">
                          {policy.ratePerHour.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                      {policy.flatRate !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Flat Rate</span>
                          <span className="font-semibold">
                            {policy.flatRate.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Max Daily Rate</span>
                        <span className="font-semibold">
                          {policy.maxDailyRate.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </>
                  )}

                  {policy.billingCycle && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Billing Cycle</span>
                      <span className="font-medium capitalize">{policy.billingCycle}</span>
                    </div>
                  )}

                  <Dialog open={dialogOpen && selectedPolicy?.policyId === policy.policyId} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Pricing Policy</DialogTitle>
                        <DialogDescription>
                          Update {selectedPolicy?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Policy Name</label>
                            <Input defaultValue={selectedPolicy?.name} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">User Role</label>
                            <Select defaultValue={selectedPolicy?.userRole}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="learner">Learner</SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="visitor">Visitor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Rate/Hour</label>
                            <Input type="number" defaultValue={selectedPolicy?.ratePerHour} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Flat Rate</label>
                            <Input type="number" defaultValue={selectedPolicy?.flatRate || ''} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Max Daily</label>
                            <Input type="number" defaultValue={selectedPolicy?.maxDailyRate} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Policy Active</span>
                          <Switch defaultChecked={selectedPolicy?.isActive} />
                        </div>
                        <Button className="w-full bg-[#003366] hover:bg-[#002244]">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fee Calculation Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Fee Calculation Engine (UC-FO-04)
            </CardTitle>
            <CardDescription>
              How parking fees are calculated based on these policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Accumulated Billing (Learners/Staff)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>1. System records entry time when card is scanned</li>
                  <li>2. On exit, duration is calculated</li>
                  <li>3. Fee is determined based on flat rate or hourly rate (whichever is applicable)</li>
                  <li>4. Fee is added to user&apos;s accumulated debt</li>
                  <li>5. Monthly batch billing via BKPay (UC-FO-03)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Immediate Payment (Visitors)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>1. Visitor receives ticket at entry (UC-ACC-02)</li>
                  <li>2. On exit, ticket is scanned</li>
                  <li>3. Fee calculated based on hourly rate</li>
                  <li>4. Payment collected immediately (Cash/QR)</li>
                  <li>5. Gate opens upon payment confirmation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
