import mongoose, { Schema, Document } from 'mongoose';

export type HistoryType = 'commande' | 'utilisateur' | 'stock' | 'facture' | 'parametre' | 'menu' | 'promotion' | 'notification';

export interface IHistoryLog extends Document {
  action: string;
  type: HistoryType;
  user: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const HistoryLogSchema = new Schema<IHistoryLog>(
  {
    action: { type: String, required: true },
    type:   { type: String, enum: ['commande','utilisateur','stock','facture','parametre','menu','promotion','notification'], required: true },
    user:   { type: String, default: 'Système' },
    meta:   { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

HistoryLogSchema.index({ type: 1 });
HistoryLogSchema.index({ createdAt: -1 });

export async function logAction(
  action: string,
  type: HistoryType,
  user = 'Système',
  meta?: Record<string, unknown>
): Promise<void> {
  try {
    await mongoose.model('HistoryLog').create({ action, type, user, meta });
  } catch {
    // Non-blocking — log failures must not break main flow
  }
}

export default mongoose.model<IHistoryLog>('HistoryLog', HistoryLogSchema);
