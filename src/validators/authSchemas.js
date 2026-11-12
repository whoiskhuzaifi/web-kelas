import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email wajib diisi.')
  .max(254, 'Email terlalu panjang.')
  .email('Format email tidak valid.');

// Batas 72 karakter mengikuti batas bcrypt yang dipakai Supabase Auth.
export const newPasswordSchema = z
  .string()
  .min(8, 'Minimal 8 karakter.')
  .max(72, 'Maksimal 72 karakter.')
  .regex(/[A-Za-z]/, 'Harus mengandung huruf.')
  .regex(/\d/, 'Harus mengandung angka.');

const passwordsMatch = (d) => d.password === d.confirmPassword;
const confirmMismatch = { path: ['confirmPassword'], message: 'Konfirmasi password tidak cocok.' };

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password wajib diisi.'),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: newPasswordSchema, confirmPassword: z.string() })
  .refine(passwordsMatch, confirmMismatch);

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi.'),
    password: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, confirmMismatch)
  .refine((d) => d.password !== d.currentPassword, {
    path: ['password'],
    message: 'Password baru harus berbeda dari password saat ini.',
  });
