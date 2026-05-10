'use client';
import {
  // ... các icon khác
  AlertTriangle  // thêm icon này
} from 'lucide-react';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Car,
  LayoutDashboard,
  MapPin,
  History,
  CreditCard,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Bell,
  Menu,
  X,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';
  const isAdminOrOperator = isAdmin || isOperator;

  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/parking-map', label: 'Parking Map', icon: MapPin },
    { href: '/dashboard/my-sessions', label: 'My Sessions', icon: History },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/parking-map', label: 'Parking Map', icon: MapPin },
    { href: '/dashboard/sessions', label: 'All Sessions', icon: History },
    { href: '/dashboard/users', label: 'User Management', icon: Users },
    { href: '/dashboard/pricing', label: 'Pricing Policies', icon: CreditCard },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/visitor-tickets', label: 'Visitor Tickets', icon: Ticket },
  ];

  const operatorNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/parking-map', label: 'Parking Map', icon: MapPin },
    { href: '/dashboard/sessions', label: 'All Sessions', icon: History },
    { href: '/dashboard/visitor-tickets', label: 'Visitor Tickets', icon: Ticket },
    { href: '/dashboard/manual-override', label: 'Manual Override', icon: AlertTriangle },
  ];

  const navItems = isAdmin ? adminNavItems : isOperator ? operatorNavItems : userNavItems;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#003366] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-[#003366]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Smart Parking System</h1>
                <p className="text-xs text-white/70">HCMUT IoT-SPMS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="p-3 text-sm text-gray-600">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">System Sync Completed</p>
                        <p className="text-xs text-gray-500">User data synchronized successfully</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">Zone C is Full</p>
                        <p className="text-xs text-gray-500">Engineering Building parking is at capacity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10 text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-white text-sm">
                      {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-white/70">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 border-b">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge className={`mt-2 ${getRoleBadgeColor(user?.role || '')}`}>
                    {user?.role?.toUpperCase()}
                  </Badge>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings size={16} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-[73px] lg:mt-0
        `}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-[#003366] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info Card */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            <div className="text-sm">
              <p className="font-medium text-gray-800">{user?.fullName}</p>
              <p className="text-gray-500 text-xs">{user?.studentId || user?.department}</p>
              {user?.currentDebt !== undefined && user.currentDebt > 0 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Current Debt</span>
                  <span className="text-sm font-semibold text-red-600">
                    {user.currentDebt.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
