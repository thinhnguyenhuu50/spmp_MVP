'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Receipt, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import datacoreData from '@/data/hcmut_datacore.json';
import type { Transaction, ParkingHistory } from '@/lib/types';

export default function BillingPage() {
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

  const transactions = datacoreData.transactions as Transaction[];
  const history = datacoreData.parkingHistory as ParkingHistory[];
  
  const userTransactions = transactions.filter(t => t.userId === user?.userId);
  const userHistory = history.filter(h => h.userId === user?.userId);
  
  const currentDebt = user?.currentDebt || 0;
  const totalPaid = userTransactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);
  const pendingAmount = userTransactions
    .filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-500 mt-1">Manage your parking fees and BKPay transactions (UC-FO-01, UC-FO-03)</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={currentDebt > 0 ? 'border-red-200' : 'border-green-200'}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Current Debt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${currentDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {currentDebt.toLocaleString('vi-VN')} VND
              </p>
              {currentDebt > 0 ? (
                <p className="text-sm text-red-600 mt-1">
                  Will be charged via BKPay at end of billing cycle
                </p>
              ) : (
                <p className="text-sm text-green-600 mt-1">No outstanding balance</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Total Paid (This Year)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {totalPaid.toLocaleString('vi-VN')} VND
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {userHistory.length} parking sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-gray-900">BKPay</p>
              <p className="text-sm text-gray-500 mt-1">
                Linked to your HCMUT account
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Billing Explanation */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              How Accumulated Billing Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="font-semibold mb-1">1. Park Your Vehicle</p>
                <p className="text-sm">Tap your ID card at entry/exit. Your parking fee is calculated automatically.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="font-semibold mb-1">2. Fees Accumulate</p>
                <p className="text-sm">Each parking session adds to your monthly debt balance.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="font-semibold mb-1">3. Monthly Billing</p>
                <p className="text-sm">At month end, total debt is charged to your BKPay account automatically.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Billing Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Current Billing Period
              </span>
              <Badge variant="outline">March 2026</Badge>
            </CardTitle>
            <CardDescription>
              Parking fees accumulated this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No parking sessions this month</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Zone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userHistory.map((session) => {
                        const entryTime = new Date(session.entryTime);
                        const exitTime = new Date(session.exitTime);
                        const durationMinutes = Math.round((exitTime.getTime() - entryTime.getTime()) / (1000 * 60));
                        const hours = Math.floor(durationMinutes / 60);
                        const minutes = durationMinutes % 60;

                        return (
                          <tr key={session.sessionId} className="border-b">
                            <td className="py-3 px-4">
                              {entryTime.toLocaleDateString('vi-VN')}
                            </td>
                            <td className="py-3 px-4">{session.zoneId}</td>
                            <td className="py-3 px-4">{hours}h {minutes}m</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {session.fee.toLocaleString('vi-VN')} VND
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="py-3 px-4 font-semibold">
                          Total This Period
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-lg">
                          {userHistory.reduce((acc, h) => acc + h.fee, 0).toLocaleString('vi-VN')} VND
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Your BKPay payment records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTransactions.map((transaction) => (
                  <div 
                    key={transaction.transactionId}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'payment' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'payment' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Receipt className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'payment' ? '-' : '+'}{transaction.amount.toLocaleString('vi-VN')} VND
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pay Now Button */}
        {currentDebt > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Pay Outstanding Balance Early</p>
                  <p className="text-sm text-gray-500">
                    Clear your debt before the automatic billing cycle
                  </p>
                </div>
                <Button className="bg-[#003366] hover:bg-[#002244]">
                  <Wallet className="w-4 h-4 mr-2" />
                  Pay {currentDebt.toLocaleString('vi-VN')} VND via BKPay
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
