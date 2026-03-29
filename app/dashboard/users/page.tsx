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
import { Search, Users, Edit, Shield, Ban, CheckCircle } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { User, UserRole } from '@/lib/types';

export default function UsersPage() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const users = datacoreData.users as User[];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.studentId && user.studentId.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive': return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      case 'suspended': return <Badge className="bg-red-100 text-red-700">Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const userStats = {
    total: users.length,
    learners: users.filter(u => u.role === 'learner').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    staff: users.filter(u => u.role === 'staff').length,
    operators: users.filter(u => u.role === 'operator').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage user roles and access permissions (UC-ADM-03)</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{userStats.total}</div>
              <p className="text-xs text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{userStats.learners}</div>
              <p className="text-xs text-gray-500">Learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{userStats.faculty}</div>
              <p className="text-xs text-gray-500">Faculty</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{userStats.staff}</div>
              <p className="text-xs text-gray-500">Staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-600">{userStats.operators}</div>
              <p className="text-xs text-gray-500">Operators</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
              <p className="text-xs text-gray-500">Admins</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              System Users
            </CardTitle>
            <CardDescription>
              Users synchronized from HCMUT_DATACORE (Read-only data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="learner">Learner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Card ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.studentId && (
                            <p className="text-xs text-gray-400">ID: {user.studentId}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.faculty || user.department || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{user.cardId}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{user.vehiclePlate}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.vehicleType}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-3 px-4">
                        <Dialog open={dialogOpen && selectedUser?.userId === user.userId} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Manage User Role</DialogTitle>
                              <DialogDescription>
                                Update system access role for {selectedUser?.fullName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Current Role</label>
                                <Badge className={getRoleBadgeColor(selectedUser?.role || '')}>
                                  {selectedUser?.role?.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Change System Role</label>
                                <Select defaultValue={selectedUser?.role}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="learner">Learner (End User)</SelectItem>
                                    <SelectItem value="faculty">Faculty (End User)</SelectItem>
                                    <SelectItem value="staff">Staff (End User)</SelectItem>
                                    <SelectItem value="operator">Parking Operator</SelectItem>
                                    <SelectItem value="admin">System Administrator</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                  Note: This changes system access level, not DATACORE role
                                </p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1 bg-[#003366] hover:bg-[#002244]">
                                  <Shield className="w-4 h-4 mr-2" />
                                  Save Changes
                                </Button>
                                <Button variant="outline" className="text-red-600 hover:bg-red-50">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
