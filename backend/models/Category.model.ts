import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  nom: string;
  description: string;
  image: string;
  active: boolean;
  ordre: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    nom:         { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    image:       { type: String, default: '' },
    active:      { type: Boolean, default: true },
    ordre:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ active: 1 });
CategorySchema.index({ ordre: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);
