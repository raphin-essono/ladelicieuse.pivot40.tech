import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  nom: string;
  contact: string;
  telephone: string;
  email: string;
  categories: string[];
  rating: number;
  delaiLivraison: string;
  notes: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    nom:            { type: String, required: true, trim: true },
    contact:        { type: String, default: '' },
    telephone:      { type: String, default: '' },
    email:          { type: String, default: '', lowercase: true },
    categories:     { type: [String], default: [] },
    rating:         { type: Number, default: 3, min: 1, max: 5 },
    delaiLivraison: { type: String, default: '2-3 jours' },
    notes:          { type: String, default: '' },
    actif:          { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
