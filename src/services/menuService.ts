/**
 * Service de gestion du menu du jour
 */

import { Meal, DailyMenu, NutrientInfo, Ingredient, calculateNutrients } from '@/types/menu';
import { ls } from '@/lib/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const mealService = {
  /**
   * Récupère le menu du jour
   */
  getDailyMenu: async (date: string): Promise<DailyMenu | null> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/menu/daily?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error);
      return null;
    }
  },

  /**
   * Crée ou met à jour le menu du jour
   */
  saveDailyMenu: async (menu: DailyMenu): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/menu/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menu),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du menu:', error);
      return false;
    }
  },

  /**
   * Ajoute un repas à la base de données
   */
  addMeal: async (meal: Meal): Promise<Meal | null> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(meal),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du repas:', error);
      return null;
    }
  },

  /**
   * Met à jour un repas
   */
  updateMeal: async (id: string, meal: Partial<Meal>): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(meal),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du repas:', error);
      return false;
    }
  },

  /**
   * Récupère tous les repas
   */
  getAllMeals: async (): Promise<Meal[]> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/meals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des repas:', error);
      return [];
    }
  },

  /**
   * Supprime un repas
   */
  deleteMeal: async (id: string): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/meals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la suppression du repas:', error);
      return false;
    }
  },

  /**
   * Publie ou dépublie le menu du jour
   */
  publishDailyMenu: async (date: string, published: boolean): Promise<boolean> => {
    try {
      const token = ls.get('admin_token');
      const response = await fetch(`${API_URL}/api/menu/daily/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date, published }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la publication du menu:', error);
      return false;
    }
  },

  /**
   * Calcule automatiquement les nutriments
   */
  calculateMealNutrients: (ingredients: Ingredient[]): NutrientInfo => {
    return calculateNutrients(ingredients);
  },
};
