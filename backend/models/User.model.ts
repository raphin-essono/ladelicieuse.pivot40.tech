import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nom: string;
  prenoms: string;
  email: string;
  password: string;
  telephone: string;
  adresse: string;
  points: number;
  tier: 'bronze' | 'argent' | 'or' | 'platine';
  statut: 'actif' | 'inactif';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  subscription?: {
    planId: string;
    planName: string;
    status: 'active' | 'paused' | 'cancelled';
    billing: 'monthly' | 'annual';
    startDate: Date;
    endDate: Date;
  };
  // Suivi diététique — objectifs personnels
  taille?:            number;
  objectifPoids?:     number;
  objectifCalories?:  number;
  objectifProteines?: number;
  objectifGlucides?:  number;
  objectifLipides?:   number;
  objectifEau?:       number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    nom:       { type: String, required: true, trim: true },
    prenoms:   { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, default: '' },
    telephone: { type: String, default: '', trim: true },
    adresse:   { type: String, default: '' },
    points:    { type: Number, default: 0, min: 0 },
    tier:      { type: String, enum: ['bronze', 'argent', 'or', 'platine'], default: 'bronze' },
    statut:    { type: String, enum: ['actif', 'inactif'], default: 'inactif' },
    emailVerified:             { type: Boolean, default: false },
    emailVerificationToken:    { type: String },
    emailVerificationExpires:  { type: Date },
    passwordResetToken:        { type: String },
    passwordResetExpires:      { type: Date },
    subscription: {
      planId:    String,
      planName:  String,
      status:    { type: String, enum: ['active', 'paused', 'cancelled'] },
      billing:   { type: String, enum: ['monthly', 'annual'] },
      startDate: Date,
      endDate:   Date,
    },
    taille:            { type: Number, min: 50, max: 250 },
    objectifPoids:     { type: Number, min: 20, max: 300 },
    objectifCalories:  { type: Number, min: 500, max: 8000 },
    objectifProteines: { type: Number, min: 0, max: 500 },
    objectifGlucides:  { type: Number, min: 0, max: 1000 },
    objectifLipides:   { type: Number, min: 0, max: 500 },
    objectifEau:       { type: Number, min: 0, max: 15 },
  },
  { timestamps: true }
);

UserSchema.index({ statut: 1 });

// Hash le mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export function computeTier(points: number): IUser['tier'] {
  if (points >= 3500) return 'platine';
  if (points >= 1500) return 'or';
  if (points >= 500)  return 'argent';
  return 'bronze';
}

export default mongoose.model<IUser>('User', UserSchema);
