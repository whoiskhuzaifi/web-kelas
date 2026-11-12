import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/common/FormField';
import FullScreenLoader from '../components/common/FullScreenLoader';
import PasswordInput from '../components/common/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { updatePassword } from '../services/authService';
import { resetPasswordSchema } from '../validators/authSchemas';

// Tujuan tautan di email reset password. Supabase menukar kode di URL menjadi sesi sementara,
// sehingga halaman ini hanya bisa dipakai jika sesi tersebut ada.
export default function ResetPasswordPage() {
  useDocumentTitle('Atur ulang password');
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '', confirmPassword: '' } });

  const onSubmit = async ({ password }) => {
    try {
      await updatePassword(password);
      toast.success('Password berhasil diubah.');
      navigate('/', { replace: true });
    } catch (err) {
      setError('root.server', { message: err.message });
    }
  };

  if (loading) return <FullScreenLoader />;

  if (!session) {
    return (
      <AuthLayout
        title="Tautan tidak valid"
        subtitle="Tautan reset password ini tidak valid atau sudah kedaluwarsa."
        footer={
          <Link to="/lupa-password" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Minta tautan baru
          </Link>
        }
      />
    );
  }

  return (
    <AuthLayout title="Atur ulang password" subtitle="Buat password baru untuk akun Anda.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root?.server && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errors.root.server.message}</span>
          </div>
        )}
        <FormField
          id="password"
          label="Password baru"
          error={errors.password?.message}
          hint="Minimal 8 karakter, mengandung huruf dan angka."
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            hasError={Boolean(errors.password)}
            describedBy={errors.password ? 'password-error' : 'password-hint'}
            {...register('password')}
          />
        </FormField>
        <FormField id="confirmPassword" label="Konfirmasi password baru" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            hasError={Boolean(errors.confirmPassword)}
            describedBy={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
          />
        </FormField>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Simpan password baru
        </button>
      </form>
    </AuthLayout>
  );
}
