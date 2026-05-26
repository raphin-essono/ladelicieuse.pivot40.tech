import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
  nom: string;
  type: 'pourcentage' | 'fixe' | 'bundle' | 'flash';
  valeur: number;
  categories: string[];
  dateDebut: Date;
  dateFin: Date;
  active: boolean;
  utilisations: number;
  limiteUtilisations?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    nom:               { type: String, required: true, trim: true },
    type:              { type: String, enum: ['pourcentage','fixe','bundle','flash'], required: true },
    valeur:            { type: Number, required: true, min: 0 },
    categories:        { type: [String], default: [] },
    dateDebut:         { type: Date, required: true },
    dateFin:           { type: Date, required: true },
    active:            { type: Boolean, default: true },
    utilisations:      { type: Number, default: 0, min: 0 },
    limiteUtilisations:{ type: Number, default: null },
  },
  { timestamps: true }
);

PromotionSchema.index({ active: 1 });
PromotionSchema.index({ dateFin: 1 });

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);
