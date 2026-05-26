import mongoose, { Schema, Document, Types } from 'mongoose';

export type FideliteOp = 'gain' | 'rachat' | 'ajustement' | 'expiration';

export interface IFideliteTransaction extends Document {
  userId:     Types.ObjectId;
  orderId?:   Types.ObjectId;
  type:       FideliteOp;
  points:     number;          // positif = gain, négatif = dépense
  soldeApres: number;
  description: string;
  createdAt:  Date;
}

const FideliteTransactionSchema = new Schema<IFideliteTransaction>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId:     { type: Schema.Types.ObjectId, ref: 'Order' },
    type:        { type: String, enum: ['gain', 'rachat', 'ajustement', 'expiration'], required: true },
    points:      { type: Number, required: true },
    soldeApres:  { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

FideliteTransactionSchema.index({ userId: 1, createdAt: -1 });
// Empêche la double-attribution pour la même commande — idempotence sans transaction ACID
FideliteTransactionSchema.index({ userId: 1, orderId: 1, type: 1 }, { unique: true, sparse: true });

export default mongoose.model<IFideliteTransaction>('FideliteTransaction', FideliteTransactionSchema);
