// Types renvoyés par l'API backend — miroir des modèles Mongoose

export interface ApiCategory {
  _id: string;
  nom: string;
  description: string;
  image: string;
  active: boolean;
  ordre: number;
}

export interface ApiMeal {
  _id: string;
  nom: string;
  categorie: string;
  description: string;
  prix: number;
  image: string;
  ingredients: Array<{ nom: string; quantite: number; unite: string }>;
  nutrition: { calories: number; proteines: number; glucides: number; lipides: number; fibres: number };
  popular: boolean;
  disponible: boolean;
  portions: number;
}

export interface ApiIngredient {
  _id: string;
  nom: string;
  categorie: string;
  image: string;
  unite: string;
  stock: number;
  stockMin: number;
  prixAchat: number;
  prixVente: number;
  nutrition: { calories: number; proteines: number; glucides: number; lipides: number; fibres: number };
  actif: boolean;
  stockLevel: string;
}

export interface ApiPromotion {
  _id: string;
  nom: string;
  type: 'pourcentage' | 'fixe' | 'bundle' | 'flash';
  valeur: number;
  categories: string[];
  dateDebut: string;
  dateFin: string;
  active: boolean;
}

export interface ApiDailyMenu {
  _id: string;
  date: string;
  repas: ApiMeal[];
  published: boolean;
}
