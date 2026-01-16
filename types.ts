export enum UserRole {
  ADMIN = 'ADMIN',
  BUYER = 'BUYER',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  password?: string; // In a real app, never store plain text
  mobile: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currentBid: number;
  imageUrl: string;
  endTime: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface Bid {
  id: string;
  productId: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}