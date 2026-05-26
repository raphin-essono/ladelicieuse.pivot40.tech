import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware de validation Zod.
 * Usage : router.post('/route', validate(MonSchema), handler)
 * En cas d'échec, renvoie 400 avec le détail des erreurs de validation.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors,
      });
      return;
    }
    req.body = result.data; // données nettoyées et typées
    next();
  };
}
