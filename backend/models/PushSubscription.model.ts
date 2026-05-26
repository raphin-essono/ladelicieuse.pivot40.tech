import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPushSubscription extends Document {
  userId?:   Types.ObjectId;
  endpoint:  string;
  keys: {
    p256dh: string;
    auth:   string;
  };
  userAgent?: string;
  createdAt:  Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User' },
    endpoint:  { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth:   { type: String, required: true },
    },
    userAgent: String,
  },
  { timestamps: true }
);

PushSubscriptionSchema.index({ userId: 1 });

export default mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
