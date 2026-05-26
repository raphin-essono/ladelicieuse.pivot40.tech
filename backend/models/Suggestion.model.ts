import mongoose, { Schema, Document } from 'mongoose';

export interface ISuggestion extends Document {
  nom: string;
  description: string;
  type: 'crudites' | 'fruits';
  base?: string;
  ingredients: string[];
  image?: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    nom:         { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type:        { type: String, enum: ['crudites', 'fruits'], required: true },
    base:        { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    image:       { type: String, default: '' },
    actif:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

SuggestionSchema.index({ type: 1, actif: 1 });

export default mongoose.model<ISuggestion>('Suggestion', SuggestionSchema);
