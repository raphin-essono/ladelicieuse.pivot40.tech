import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  userId?: Types.ObjectId;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  planId: string;
  planName: string;
  billing: 'monthly' | 'annual';
  price: number;
  statut: 'active' | 'paused' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: 'User', default: null },
    clientNom:       { type: String, required: true },
    clientEmail:     { type: String, required: true, lowercase: true },
    clientTelephone: { type: String, required: true },
    planId:          { type: String, required: true },
    planName:        { type: String, required: true },
    billing:         { type: String, enum: ['monthly','annual'], required: true },
    price:           { type: Number, required: true, min: 0 },
    statut:          { type: String, enum: ['active','paused','cancelled'], default: 'active' },
    startDate:       { type: Date, default: Date.now },
    endDate:         { type: Date, required: true },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ clientEmail: 1 });
SubscriptionSchema.index({ statut: 1 });
SubscriptionSchema.index({ planId: 1 });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
