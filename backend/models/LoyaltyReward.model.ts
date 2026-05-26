import mongoose, { Schema, Document } from 'mongoose';

export interface ILoyaltyReward extends Document {
  nom: string;
  description: string;
  points: number;
  actif: boolean;
  ordre: number;
}

const LoyaltyRewardSchema = new Schema<ILoyaltyReward>(
  {
    nom:         { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    points:      { type: Number, required: true, min: 1 },
    actif:       { type: Boolean, default: true },
    ordre:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

LoyaltyRewardSchema.index({ actif: 1, points: 1 });

export default mongoose.model<ILoyaltyReward>('LoyaltyReward', LoyaltyRewardSchema);
