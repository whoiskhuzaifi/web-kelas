import { z } from 'zod';

// Aturan NIM sama dengan CHECK constraint di database (supabase/migrations/0001).
const NIM_PATTERN = /^[A-Za-z0-9.-]{3,30}$/;

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi.').max(100, 'Maksimal 100 karakter.'),
  nim: z
    .string()
    .trim()
    .refine((v) => v === '' || NIM_PATTERN.test(v), 'NIM hanya boleh huruf, angka, titik, atau strip (3–30 karakter).'),
});
