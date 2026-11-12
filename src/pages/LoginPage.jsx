import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/common/FormField';
import PasswordInput from '../components/common/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { signInWithPassword } from '../services/authService';
import { loginSchema } from '../validators/authSchemas';

export default function LoginPage() {
  useDocumentTitle('Masuk');
  const { notice, clearNotice } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    clearNotice();
    try {
      await signInWithPassword(values);
      // Sesi baru diterima AuthContext; GuestRoute lalu mengarahkan ke halaman tujuan.
    } catch (err) {
      setError('root.server', { message: err.message });
    }
  };

  const message = errors.root?.server?.message ?? notice;

  return (
    <AuthLayout
      title="Masuk ke ClassPortal"
      subtitle="Gunakan akun yang diberikan oleh pengurus kelas."
      footer="Akun dibuat oleh pengurus kelas. Belum punya akun? Hubungi pengurus kelas."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {message && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}

        <FormField id="email" label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="input"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            hasError={Boolean(errors.password)}
            describedBy={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </FormField>

        <div className="text-right">
          <Link to="/lupa-password" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Lupa password?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Masuk
        </button>
      </form>
    </AuthLayout>
  );
}
