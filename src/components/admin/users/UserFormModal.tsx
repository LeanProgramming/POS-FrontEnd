import { useState } from 'react';
import type { TUserRole } from '../../../types/auth.type';
import { useCreateUser } from '../../../queries/users.queries';
import { getErrorMessage } from '../../../api/errors';

interface IUserFormModalProps {
	onClose: () => void;
}

type FormData = {
	username: string;
	password: string;
	confirmPassword: string;
	role: TUserRole;
};

const EMPTY_FORM: FormData = {
	username: '',
	password: '',
	confirmPassword: '',
	role: 'cashier',
};

export const UserFormModal = ({ onClose }: IUserFormModalProps) => {
	const [form, setForm] = useState<FormData>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<FormData>>({});
	const [showPassword, setShowPassword] = useState(false);
	const createUser = useCreateUser();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleRoleChange = (role: TUserRole) => {
		setForm((prev) => ({ ...prev, role }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<FormData> = {};
		if (!form.username.trim()) {
			newErrors.username = 'Requerido';
		} else if (form.username.trim().length < 3) {
			newErrors.username = 'Mínimo 3 caracteres';
		}
		if (!form.password) {
			newErrors.password = 'Requerido';
		} else if (form.password.length < 6) {
			newErrors.password = 'Mínimo 6 caracteres';
		}
		if (form.password !== form.confirmPassword) {
			newErrors.confirmPassword = 'Las contraseñas no coinciden';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		createUser.mutate(
			{
				username: form.username.trim().toLowerCase(),
				password: form.password,
				role: form.role,
			},
			{ onSuccess: onClose },
		);
	};

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						Nuevo usuario
					</h2>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-xl leading-none'
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					{/* Username */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Nombre de usuario
						</label>
						<input
							name='username'
							value={form.username}
							onChange={handleChange}
							placeholder='Ej: maria'
							autoFocus
							autoComplete='off'
							className={inputClass(!!errors.username)}
						/>
						{errors.username && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.username}
							</p>
						)}
					</div>

					{/* Rol */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Rol
						</label>
						<div className='grid grid-cols-2 gap-2'>
							{ROLES.map((r) => (
								<button
									key={r.value}
									type='button'
									onClick={() => handleRoleChange(r.value)}
									className={`py-2.5 rounded-lg border text-[12px] font-mono transition-all ${
										form.role === r.value
											? r.activeClass
											: 'bg-[#141414] border-[#2a2a2a] text-[#666] hover:border-[#444]'
									}`}
								>
									{r.label}
								</button>
							))}
						</div>
					</div>

					{/* Contraseña */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Contraseña
						</label>
						<div className='relative'>
							<input
								name='password'
								type={showPassword ? 'text' : 'password'}
								value={form.password}
								onChange={handleChange}
								placeholder='Mínimo 6 caracteres'
								autoComplete='new-password'
								className={inputClass(!!errors.password)}
							/>
							<button
								type='button'
								onClick={() => setShowPassword((v) => !v)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[#444] hover:text-[#888] transition-colors'
							>
								{showPassword ? 'ocultar' : 'mostrar'}
							</button>
						</div>
						{errors.password && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.password}
							</p>
						)}
					</div>

					{/* Confirmar contraseña */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Confirmar contraseña
						</label>
						<input
							name='confirmPassword'
							type={showPassword ? 'text' : 'password'}
							value={form.confirmPassword}
							onChange={handleChange}
							placeholder='Repetí la contraseña'
							autoComplete='new-password'
							className={inputClass(!!errors.confirmPassword)}
						/>
						{errors.confirmPassword && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.confirmPassword}
							</p>
						)}
					</div>

					{/* Error API */}
					{createUser.isError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(createUser.error)}
						</p>
					)}

					{/* Acciones */}
					<div className='flex gap-2 pt-1'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 py-2.5 bg-[#161616] border border-[#252525] hover:border-[#444] text-[13px] font-mono text-[#888] rounded-lg transition-colors'
						>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={createUser.isPending}
							className='flex-1 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							{createUser.isPending ? 'Creando...' : 'Crear usuario'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const inputClass = (hasError: boolean) =>
	`w-full bg-[#141414] border rounded-lg px-3 py-2.5 text-[13px] text-[#e5e5e5] placeholder-[#333] outline-none transition-colors ${
		hasError
			? 'border-red-800 focus:border-red-600'
			: 'border-[#2a2a2a] focus:border-green-700'
	}`;

const ROLES: {
	value: TUserRole;
	label: string;
	activeClass: string;
}[] = [
	{
		value: 'cashier',
		label: 'Cajero',
		activeClass: 'bg-[#0f1f12] border-green-700 text-green-400',
	},
	{
		value: 'admin',
		label: 'Admin',
		activeClass: 'bg-[#0f1525] border-blue-700 text-blue-400',
	},
];
