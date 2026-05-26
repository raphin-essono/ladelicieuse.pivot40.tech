import { Schema, model, Document, Types } from 'mongoose';

export type BookingMode   = 'presentiel' | 'virtuel';
export type BookingStatut = 'en_attente' | 'confirme' | 'effectue' | 'annule';

export interface IConsultationBooking extends Document {
  userId?:          Types.ObjectId;
  userNom:          string;
  userPrenoms?:     string;
  userEmail:        string;
  userTelephone:    string;
  consultationId?:  Types.ObjectId;
  titre:            string;
  prix:             number;
  date:             Date;
  creneau:          string;
  mode:             BookingMode;
  statut:           BookingStatut;
  notes?:           string;
  planAlimentaire?: string;
  createdAt:        Date;
  updatedAt:        Date;
}

const consultationBookingSchema = new Schema<IConsultationBooking>(
  {
    userId:         { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userNom:        { type: String, required: true, trim: true, maxlength: 100 },
    userPrenoms:    { type: String, trim: true, maxlength: 150 },
    userEmail:      { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    userTelephone:  { type: String, required: true, trim: true, maxlength: 30 },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    titre:          { type: String, required: true, trim: true, maxlength: 200 },
    prix:           { type: Number, required: true, min: 0 },
    date:           { type: Date, required: true },
    creneau:        { type: String, required: true, trim: true, maxlength: 20 },
    mode:           { type: String, enum: ['presentiel', 'virtuel'], default: 'virtuel' },
    statut:         { type: String, enum: ['en_attente', 'confirme', 'effectue', 'annule'], default: 'en_attente', index: true },
    notes:          { type: String, trim: true, maxlength: 1000 },
    planAlimentaire:{ type: String, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

consultationBookingSchema.index({ createdAt: -1 });
consultationBookingSchema.index({ date: 1, statut: 1 });

export default model<IConsultationBooking>('ConsultationBooking', consultationBookingSchema);
