import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface ClientRequest extends Request {
  clientId?:    string;
  clientEmail?: string;
  clientRole?:  string;
}

interface ClientPayload {
  id:    string;
  email: string;
  role:  string;
}

export function requireClient(req: ClientRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token manquant' });
    return;
  }

  const token = header.slice(7);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET absent');

    const payload = jwt.verify(token, secret) as ClientPayload;
    if (payload.role !== 'client') {
      res.status(403).json({ success: false, message: 'Accès refusé' });
      return;
    }
    req.clientId    = payload.id;
    req.clientEmail = payload.email;
    req.clientRole  = payload.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
}
