/**
 * Service de gestion des commandes
 * Support du temps réel via polling
 */

import { Order, OrderAlert, OrderStatusDocument, ORDER_STATUS_LABELS } from '@/types/order';
import { ls } from '@/lib/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const orderService = {
  /**
   * Récupère toutes les commandes
   */
  getOrders: async (filters?: { status?: string; priority?: string }): Promise<Order[]> => {
    try {
      const token = ls.get('admin_token');
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);

      const response = await fetch(`${API_URL}/api/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }
  },

  /**
   * Récupère une commande par ID
   */
  getOrder: async (id: string): Promise<Order | null> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      return null;
    }
  },

  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus: async (id: string, status: string): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }
  },

  /**
   * Met à jour la priorité d'une commande
   */
  updateOrderPriority: async (id: string, priority: string): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/orders/${id}/priority`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la priorité:', error);
      return false;
    }
  },

  /**
   * Récupère les alertes pour une commande
   */
  getOrderAlerts: async (orderId: string): Promise<OrderAlert[]> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/orders/${orderId}/alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      return [];
    }
  },

  /**
   * Résout une alerte
   */
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte:', error);
      return false;
    }
  },

  /**
   * Récupère les commandes en retard
   */
  getLateOrders: async (): Promise<Order[]> => {
    try {
      const orders = await orderService.getOrders();
      const now = Date.now();
      return orders.filter(order => {
        if (!order.estimatedTime) return false;
        const completionTime = new Date(order.createdAt).getTime() + (order.estimatedTime * 60000);
        return completionTime < now && order.status !== 'delivered' && order.status !== 'cancelled';
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes en retard:', error);
      return [];
    }
  },

  /**
   * Récupère les statistiques des commandes
   */
  getOrderStats: async () => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  },

  /**
   * Configure un polling pour les mises à jour en temps réel
   */
  subscribeToOrderUpdates: (callback: (orders: Order[]) => void, interval: number = 5000) => {
    const poll = async () => {
      const orders = await orderService.getOrders();
      callback(orders);
    };

    poll(); // Appel immédiat
    const intervalId = setInterval(poll, interval);

    // Retourner une fonction pour arrêter le polling
    return () => clearInterval(intervalId);
  },
};
