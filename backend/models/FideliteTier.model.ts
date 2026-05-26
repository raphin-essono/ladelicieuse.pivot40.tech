import mongoose, { Schema, Document } from 'mongoose';

export interface IFideliteTier extends Document {
  nom: string;
  slug: string;
  pointsMin: number;
  pointsMax: number | null;
  couleur: string;
  ordre: number;
}

const FideliteTierSchema = new Schema<IFideliteTier>(
  {
    nom:       { type: String, required: true, trim: true },
    slug:      { type: String, required: true, unique: true, trim: true, lowercase: true },
    pointsMin: { type: Number, required: true, min: 0 },
    pointsMax: { type: Number, default: null },
    couleur:   { type: String, default: 'bronze' },
    ordre:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

FideliteTierSchema.index({ ordre: 1 });

export default mongoose.model<IFideliteTier>('FideliteTier', FideliteTierSchema);
