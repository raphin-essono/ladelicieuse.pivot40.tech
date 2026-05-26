/**
 * Types et interfaces pour la gestion des commandes
 */

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  priority: OrderPriority;
  notes?: string;
  deliveryAddress?: string;
  estimatedTime?: number; // en minutes
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderStatusDocument {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface OrderAlert {
  id: string;
  orderId: string;
  type: 'warning' | 'alert' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PRIORITY_LABELS: Record<OrderPriority, string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
  urgent: 'Urgente',
};

export const PRIORITY_ICONS: Record<OrderPriority, string> = {
  low: '🟢',
  normal: '🔵',
  high: '🟠',
  urgent: '🔴',
};
