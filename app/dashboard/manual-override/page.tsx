'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

// Dữ liệu Mock để test tính năng Lookup
const MOCK_USERS: Record<string, { name: string; role: string; status: string }> = {
    '2313292': { name: 'Nguyễn Hữu Thịnh', role: 'Learner', status: 'SUSPENDED' },
    '2312549': { name: 'Mai Xuân Nhựt', role: 'Learner', status: 'ACTIVE' },
    '2312995': { name: 'Lê Đức Tài', role: 'Staff', status: 'ACTIVE' },
};

interface OverrideLog {
    id: string;
    time: string;
    status: 'granted' | 'denied' | 'pending';
    reason: string;
    userName: string;
    userInfo: string;
}

export default function ManualOverridePage() {
    // 1. Quản lý State
    const [exceptionType, setExceptionType] = useState('forgot-entry');
    const [gate, setGate] = useState('gate-a');
    const [userId, setUserId] = useState('');
    const [plateNumber, setPlateNumber] = useState(''); // Thêm state cho biển số
    const [notes, setNotes] = useState('');

    // State lưu kết quả lookup để hiển thị UI
    const [lookupResult, setLookupResult] = useState<{ type: 'success' | 'error'; data?: any; message?: string } | null>(null);

    const [logs, setLogs] = useState<OverrideLog[]>([
        { id: '1', time: '09:31:07', status: 'granted', reason: 'Lost Ticket • Gate B Exit • LP: 51B-23456 • Fee: 15,000đ + penalty', userName: 'Trần Văn Minh', userInfo: 'Lost Ticket' },
        { id: '2', time: '08:55:22', status: 'granted', reason: 'Forgot ID • Gate A Entry • User: 2311066 (Nguyễn Việt Hoàng)', userName: 'Trần Văn Minh', userInfo: 'Forgot ID' },
        { id: '3', time: '08:10:05', status: 'denied', reason: 'Auth Failure • Gate A Entry • No valid ID provided', userName: 'Trần Văn Minh', userInfo: 'Authentication Error' }
    ]);

    const exceptionTypes = [
        { value: 'forgot-entry', label: 'Forgot ID Card (Entry)' },
        { value: 'lost-exit', label: 'Lost Ticket (Exit)' },
        { value: 'auth-failure', label: 'Authentication Failure' },
        { value: 'hardware-malfunction', label: 'Hardware Malfunction' }
    ];

    const gates = [
        { value: 'gate-a', label: 'Gate A – Entry' },
        { value: 'gate-b', label: 'Gate B – Exit' },
        { value: 'gate-c', label: 'Gate C – Entry' },
        { value: 'gate-d', label: 'Gate D – Exit' }
    ];

    // Xác định xem ngoại lệ này là của khách vãng lai hay thành viên
    const isVisitorException = exceptionType === 'lost-exit';

    // 2. Logic Xử lý
    const handleExceptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExceptionType(e.target.value);
        setLookupResult(null); // Reset kết quả tra cứu khi đổi loại ngoại lệ
    };

    const handleLookup = () => {
        if (isVisitorException) {
            if (!plateNumber.trim()) return alert('Vui lòng nhập biển số xe.');
            // Giả lập tìm thấy xe trong bãi
            setLookupResult({
                type: 'success',
                data: { title: 'VEHICLE LOOKUP', plate: plateNumber, info: 'Entry: 07:17:09 | Fee: 12,000đ + Penalty' }
            });
        } else {
            if (!userId.trim()) return alert('Vui lòng nhập User ID.');
            const user = MOCK_USERS[userId.trim()];

            if (user) {
                setLookupResult({ type: 'success', data: { title: 'USER FOUND', id: userId, ...user } });
            } else {
                setLookupResult({ type: 'error', message: `✕ USER NOT FOUND — ID: ${userId}` });
            }
        }
    };

    const clearForm = () => {
        setUserId('');
        setPlateNumber('');
        setNotes('');
        setLookupResult(null);
    };

    const handleGrant = () => {
        if (!notes.trim()) return alert('Vui lòng nhập Verification Notes (lý do mở cổng).');

        const gateLabel = gates.find(g => g.value === gate)?.label;
        const targetInfo = isVisitorException ? `LP: ${plateNumber}` : `User: ${userId}`;

        const newLog: OverrideLog = {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString('en-GB'),
            status: 'granted',
            reason: `${exceptionTypes.find(t => t.value === exceptionType)?.label} • ${gateLabel} • ${targetInfo}`,
            userName: 'Current Operator', // Thay bằng tên User đang đăng nhập thực tế
            userInfo: targetInfo
        };

        setLogs([newLog, ...logs]);
        clearForm();

        // TODO: Gắn API gọi MQTT mở Barie ở đây
    };

    const handleDeny = () => {
        const gateLabel = gates.find(g => g.value === gate)?.label;
        const targetInfo = isVisitorException ? `LP: ${plateNumber}` : `User: ${userId}`;

        const newLog: OverrideLog = {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString('en-GB'),
            status: 'denied',
            reason: `${exceptionTypes.find(t => t.value === exceptionType)?.label} • ${gateLabel} • ${targetInfo}`,
            userName: 'Current Operator',
            userInfo: targetInfo
        };

        setLogs([newLog, ...logs]);
        clearForm();
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-blue-950">Manual Override</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <Alert className="mb-6 border-blue-200 bg-blue-50">
                                <AlertTriangle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-700 ml-2 font-mono text-sm tracking-tight">
                                    ALL manual override actions are logged and audited. Ensure proper verification before granting access.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Exception Type */}
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2 font-mono">
                                            Exception Type
                                        </label>
                                        <select
                                            value={exceptionType}
                                            onChange={handleExceptionChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        >
                                            {exceptionTypes.map((type) => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Gate Selection */}
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2 font-mono">
                                            Gate
                                        </label>
                                        <select
                                            value={gate}
                                            onChange={(e) => setGate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        >
                                            {gates.map((g) => (
                                                <option key={g.value} value={g.value}>{g.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic Input: User ID or License Plate */}
                                {!isVisitorException ? (
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2 font-mono">
                                            User ID / Student ID
                                        </label>
                                        <input
                                            type="text"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder="e.g. 2313292"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2 font-mono">
                                            License Plate Number
                                        </label>
                                        <input
                                            type="text"
                                            value={plateNumber}
                                            onChange={(e) => setPlateNumber(e.target.value)}
                                            placeholder="e.g. 51A-123.45"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                )}

                                {/* Verification Notes */}
                                <div>
                                    <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2 font-mono">
                                        Verification Notes / Reason
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Describe the situation and verification performed..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                                    />
                                </div>

                                {/* 3. Khối Hiển thị kết quả tra cứu (Lookup Result) */}
                                {lookupResult && (
                                    <div className={`p-4 rounded-lg border ${lookupResult.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                                        {lookupResult.type === 'error' ? (
                                            <div className="text-red-600 font-mono text-xs font-bold tracking-wide">
                                                {lookupResult.message}
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-mono text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                                    {lookupResult.data.title}
                                                </div>
                                                {!isVisitorException ? (
                                                    <>
                                                        <div className="text-lg font-bold text-blue-950">{lookupResult.data.name}</div>
                                                        <div className="text-sm text-gray-600 font-mono mt-1">
                                                            ID: <span className="text-blue-950 font-semibold">{lookupResult.data.id}</span> |
                                                            Role: <span className="text-blue-950 font-semibold">{lookupResult.data.role}</span> |
                                                            Status: <span className={`font-bold ${lookupResult.data.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{lookupResult.data.status}</span>
                                                        </div>
                                                        {lookupResult.data.status === 'SUSPENDED' && (
                                                            <div className="text-xs text-red-600 font-bold mt-2">
                                                                ⚠ Account suspended — unpaid debt. Override will be audited.
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-sm text-gray-700">LP: <strong className="text-lg text-blue-950">{lookupResult.data.plate}</strong></div>
                                                        <div className="text-xs text-gray-500 font-mono mt-1">{lookupResult.data.info}</div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={handleLookup}
                                        variant="outline"
                                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-xs font-bold uppercase tracking-wider font-mono"
                                    >
                                        ⊕ LOOKUP
                                    </Button>
                                    <Button
                                        onClick={handleGrant}
                                        className="flex-1 bg-green-100 border border-green-400 text-green-700 hover:bg-green-500 hover:text-white py-6 text-xs font-bold uppercase tracking-wider font-mono transition-colors"
                                    >
                                        ✓ GRANT ACCESS
                                    </Button>
                                    <Button
                                        onClick={handleDeny}
                                        className="flex-1 bg-red-100 border border-red-300 text-red-700 hover:bg-red-500 hover:text-white py-6 text-xs font-bold uppercase tracking-wider font-mono transition-colors"
                                    >
                                        ✕ DENY
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Activity Log */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 h-full border-gray-200">
                            <h2 className="text-sm font-bold text-blue-950 mb-4 uppercase tracking-wider font-mono border-b pb-2">Recent Overrides</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {logs.map((log) => (
                                    <div key={log.id} className="pb-4 border-b last:border-b-0">
                                        <div className="flex items-start gap-3">
                                            {log.status === 'granted' && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />}
                                            {log.status === 'denied' && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                                            {log.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-sm font-semibold ${log.status === 'granted' ? 'text-blue-950' : 'text-red-600'}`}>
                                                        {log.status === 'granted' ? '✓ Access Granted' : log.status === 'denied' ? '✕ Access Denied' : '⏱ Pending'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono leading-relaxed mt-1 break-words">{log.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}