import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMealIngredient {
  ingredientId: Types.ObjectId;
  nom: string;
  quantite: number;
  unite: string;
}

export interface IMeal extends Document {
  nom: string;
  categorieId: Types.ObjectId | null;
  categorie: string;
  description: string;
  prix: number;
  image: string;
  ingredients: IMealIngredient[];
  nutrition: {
    calories: number;
    proteines: number;
    glucides: number;
    lipides: number;
    fibres: number;
  };
  popular: boolean;
  disponible: boolean;
  date: string | null;
  portions: number;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    nom:         { type: String, required: true, trim: true },
    categorieId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    categorie:   { type: String, required: true },
    description: { type: String, default: '' },
    prix:        { type: Number, required: true, min: 0 },
    image:       { type: String, default: '' },
    ingredients: [
      {
        ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
        nom:          { type: String, required: true },
        quantite:     { type: Number, required: true, min: 0 },
        unite:        { type: String, default: 'portion' },
      },
    ],
    nutrition: {
      calories:  { type: Number, default: 0 },
      proteines: { type: Number, default: 0 },
      glucides:  { type: Number, default: 0 },
      lipides:   { type: Number, default: 0 },
      fibres:    { type: Number, default: 0 },
    },
    popular:    { type: Boolean, default: false },
    disponible: { type: Boolean, default: true },
    date:       { type: String, default: null },
    portions:   { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

MealSchema.index({ categorieId: 1 });
MealSchema.index({ disponible: 1 });
MealSchema.index({ popular: -1 });

export default mongoose.model<IMeal>('Meal', MealSchema);
