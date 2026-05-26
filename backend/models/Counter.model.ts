import mongoose, { Schema, Document } from 'mongoose';

interface ICounter extends Document<string> {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model<ICounter>('Counter', CounterSchema);

/**
 * Incrémente atomiquement un compteur et retourne la nouvelle valeur.
 * L'opération $inc + upsert est garantie atomique par MongoDB — aucune race condition possible.
 */
export async function nextSequence(name: string): Promise<number> {
  const result = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return result!.seq;
}
