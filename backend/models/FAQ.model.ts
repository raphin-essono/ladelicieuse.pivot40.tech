import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  reponse: string;
  page: 'consultations' | 'abonnement';
  ordre: number;
  actif: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    reponse:  { type: String, required: true, trim: true },
    page:     { type: String, enum: ['consultations', 'abonnement'], required: true },
    ordre:    { type: Number, default: 0 },
    actif:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

FAQSchema.index({ page: 1, ordre: 1 });
FAQSchema.index({ actif: 1 });

export default mongoose.model<IFAQ>('FAQ', FAQSchema);
