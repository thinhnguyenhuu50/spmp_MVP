export type UserRole = 'admin' | 'learner' | 'faculty' | 'staff' | 'operator' | 'visitor';

export interface SSOUser {
  username: string;
  password: string;
  userId: string;
  isActive: boolean;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  studentId?: string;
  cardId: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: 'car' | 'motorbike';
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
  currentDebt?: number;
}

export interface ParkingZone {
  zoneId: string;
  zoneName: string;
  totalSlots: number;
  availableSlots: number;
  vehicleTypes: ('car' | 'motorbike')[];
  status: 'available' | 'nearly_full' | 'full';
}

export interface ParkingSession {
  sessionId: string;
  userId: string;
  zoneId: string;
  slotId: string;
  entryTime: string;
  exitTime: string | null;
  vehiclePlate: string;
  ticketId?: string;
  status: 'active' | 'completed';
  fee: number;
  isVisitor?: boolean;
}

export interface ParkingHistory {
  sessionId: string;
  userId: string;
  zoneId: string;
  entryTime: string;
  exitTime: string;
  fee: number;
  status: 'completed';
}

export interface PricingPolicy {
  policyId: string;
  name: string;
  userRole: UserRole | 'visitor';
  vehicleType: 'car' | 'motorbike';
  ratePerHour: number;
  flatRate: number | null;
  maxDailyRate: number;
  billingType: 'accumulated' | 'immediate' | 'exempt';
  billingCycle: 'monthly' | 'weekly' | null;
  isActive: boolean;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  amount: number;
  type: 'debt' | 'payment';
  method?: 'cash' | 'bkpay' | 'qr';
  description: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SystemNotification {
  notificationId: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
