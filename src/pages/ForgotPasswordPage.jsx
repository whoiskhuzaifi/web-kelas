import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/common/FormField';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { requestPasswordReset } from '../services/authService';
import { forgotPasswordSchema } from '../validators/authSchemas';

export default function ForgotPasswordPage() {
  useDocumentTitle('Lupa password');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError('root.server', { message: err.message });
    }
  };

  const backLink = (
    <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
      Kembali ke halaman masuk
    </Link>
  );

  if (sent) {
    return (
      <AuthLayout title="Periksa email Anda" footer={backLink}>
        <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300" role="status">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <p>Jika email tersebut terdaftar, tautan untuk mengatur ulang password telah dikirim. Tautan berlaku terbatas.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa password"
      subtitle="Masukkan email akun Anda. Kami akan mengirim tautan untuk mengatur ulang password."
      footer={backLink}
    >
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
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Kirim tautan
        </button>
      </form>
    </AuthLayout>
  );
}
