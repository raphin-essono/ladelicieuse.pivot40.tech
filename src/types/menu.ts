/**
 * Types et interfaces pour la gestion du menu du jour
 */

export interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'salad' | 'juice' | 'meal' | 'consultation';
  price: number;
  calories: number;
  protein: number; // en grammes
  carbs: number; // en grammes
  fat: number; // en grammes
  fiber: number; // en grammes
  portion: number; // en grammes
  available: boolean;
  image?: string;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number; // en grammes
  unit: 'g' | 'ml' | 'pcs';
  calories: number; // par 100g
}

export interface DailyMenu {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/**
 * Calcule les nutriments d'un repas basé sur les ingrédients
 */
export const calculateNutrients = (ingredients: Ingredient[]): NutrientInfo => {
  return ingredients.reduce(
    (total, ingredient) => {
      const quantity = ingredient.quantity / 100;
      const caloriesPerUnit = ingredient.calories;
      
      return {
        calories: total.calories + (caloriesPerUnit * quantity),
        protein: total.protein + (ingredient.quantity * 0.01), // À ajuster selon les données réelles
        carbs: total.carbs + (ingredient.quantity * 0.015),
        fat: total.fat + (ingredient.quantity * 0.005),
        fiber: total.fiber + (ingredient.quantity * 0.002),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
};

/**
 * Formate les calories en format lisible
 */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} kcal`;
};

/**
 * Formate les nutriments en format lisible
 */
export const formatNutrients = (nutrients: NutrientInfo): string => {
  return `${Math.round(nutrients.protein)}g P | ${Math.round(nutrients.carbs)}g C | ${Math.round(nutrients.fat)}g L`;
};
