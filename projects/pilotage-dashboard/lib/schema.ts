import { z } from 'zod';
import { KPI_CODES, SCOPES } from './types';

export const importRowSchema = z.object({
  scope: z.enum(SCOPES),
  kpiCode: z.enum(KPI_CODES),
  period: z.string().min(1),
  value: z.coerce.number(),
});

export const overrideSchema = z.object({
  scope: z.enum(SCOPES),
  kpiCode: z.enum(KPI_CODES),
  period: z.string().min(1),
  value: z.coerce.number(),
  note: z.string().optional().transform((value) => value || ''),
});
