import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FormField from '../components/common/FormField';
import PasswordInput from '../components/common/PasswordInput';
import { ROLE_LABEL } from '../config/nav';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { updatePassword, verifyCurrentPassword } from '../services/authService';
import { updateMyProfile } from '../services/profileService';
import { changePasswordSchema } from '../validators/authSchemas';
import { profileSchema } from '../validators/profileSchemas';

function ProfileForm({ user }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, nim: user.nim ?? '' },
  });

  const mutation = useMutation({
    mutationFn: (values) => updateMyProfile(user.id, values),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user.id], data);
      reset({ name: data.name, nim: data.nim ?? '' });
      toast.success('Profil berhasil diperbarui.');
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="card space-y-4">
      <h2 className="text-lg font-semibold">Data diri</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="email" label="Email">
          <input id="email" readOnly value={user.email} className="input bg-slate-50 dark:bg-slate-800/50" />
        </FormField>
        <FormField id="role" label="Peran">
          <input id="role" readOnly value={ROLE_LABEL[user.role]} className="input bg-slate-50 dark:bg-slate-800/50" />
        </FormField>
      </div>

      <FormField id="name" label="Nama lengkap" error={errors.name?.message}>
        <input
          id="name"
          autoComplete="name"
          className="input"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
      </FormField>

      <FormField id="nim" label="NIM (opsional)" error={errors.nim?.message}>
        <input
          id="nim"
          autoComplete="off"
          className="input"
          aria-invalid={errors.nim ? 'true' : 'false'}
          aria-describedby={errors.nim ? 'nim-error' : undefined}
          {...register('nim')}
        />
      </FormField>

      <div className="flex justify-end">
        <button type="submit" disabled={!isDirty || mutation.isPending} className="btn btn-primary">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Simpan perubahan
        </button>
      </div>
    </form>
  );
}

function PasswordForm({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: async ({ currentPassword, password }) => {
      await verifyCurrentPassword(user.email, currentPassword);
      await updatePassword(password);
    },
    onSuccess: () => {
      reset();
      toast.success('Password berhasil diubah.');
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="card space-y-4">
      <h2 className="text-lg font-semibold">Ubah password</h2>

      <FormField id="currentPassword" label="Password saat ini" error={errors.currentPassword?.message}>
        <PasswordInput
          id="currentPassword"
          autoComplete="current-password"
          hasError={Boolean(errors.currentPassword)}
          describedBy={errors.currentPassword ? 'currentPassword-error' : undefined}
          {...register('currentPassword')}
        />
      </FormField>

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

      <div className="flex justify-end">
        <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Ubah password
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  useDocumentTitle('Profil');
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm user={user} />
        <PasswordForm user={user} />
      </div>
    </div>
  );
}
