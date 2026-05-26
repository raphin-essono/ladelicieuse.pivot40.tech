import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  reduction: number;
  typeReduction: 'pourcentage' | 'fixe';
  minCommande: number;
  maxUtilisations: number;
  utilisations: number;
  active: boolean;
  expiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code:            { type: String, required: true, unique: true, uppercase: true, trim: true },
    reduction:       { type: Number, required: true, min: 0 },
    typeReduction:   { type: String, enum: ['pourcentage','fixe'], default: 'pourcentage' },
    minCommande:     { type: Number, default: 0, min: 0 },
    maxUtilisations: { type: Number, default: 100, min: 1 },
    utilisations:    { type: Number, default: 0, min: 0 },
    active:          { type: Boolean, default: true },
    expiry:          { type: Date, default: null },
  },
  { timestamps: true }
);

PromoCodeSchema.index({ active: 1 });

export default mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
