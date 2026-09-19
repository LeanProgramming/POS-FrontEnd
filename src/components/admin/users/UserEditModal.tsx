import { useState } from 'react';
import type { IUser } from '../../../types/users.type';
import { useUpdateUser } from '../../../queries/users.queries';
import { getErrorMessage } from '../../../api/errors';

interface IUserEditModalProps {
	user: IUser;
	onClose: () => void;
}

type FormData = {
	first_name: string;
	last_name: string;
	password: string;
	confirmPassword: string;
};

export const UserEditModal = ({ user, onClose }: IUserEditModalProps) => {
	const [form, setForm] = useState<FormData>({
		first_name: user.first_name,
		last_name: user.last_name,
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<Partial<FormData>>({});
	const [showPassword, setShowPassword] = useState(false);
	const updateUser = useUpdateUser();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<FormData> = {};
		if (!form.first_name.trim()) {
			newErrors.first_name = 'Requerido';
		}
		if (!form.last_name.trim()) {
			newErrors.last_name = 'Requerido';
		}
		if (form.password) {
			if (form.password.length < 6) {
				newErrors.password = 'Mínimo 6 caracteres';
			}
			if (form.password !== form.confirmPassword) {
				newErrors.confirmPassword = 'Las contraseñas no coinciden';
			}
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const payload: { first_name?: string; last_name?: string; password?: string } = {};

		if (form.first_name.trim() !== user.first_name) {
			payload.first_name = form.first_name.trim();
		}
		if (form.last_name.trim() !== user.last_name) {
			payload.last_name = form.last_name.trim();
		}
		if (form.password) {
			payload.password = form.password;
		}

		if (Object.keys(payload).length === 0) {
			onClose();
			return;
		}

		updateUser.mutate(
			{ userId: user._id, payload },
			{ onSuccess: onClose },
		);
	};

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						Editar usuario
					</h2>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-xl leading-none'
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					{/* Username (readonly) */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Usuario
						</label>
						<input
							value={user.username}
							disabled
							className='w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-[#666] cursor-not-allowed'
						/>
					</div>

					{/* Nombre */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Nombre
						</label>
						<input
							name='first_name'
							value={form.first_name}
							onChange={handleChange}
							placeholder='Ej: María'
							autoFocus
							autoComplete='off'
							className={inputClass(!!errors.first_name)}
						/>
						{errors.first_name && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.first_name}
							</p>
						)}
					</div>

					{/* Apellido */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Apellido
						</label>
						<input
							name='last_name'
							value={form.last_name}
							onChange={handleChange}
							placeholder='Ej: García'
							autoComplete='off'
							className={inputClass(!!errors.last_name)}
						/>
						{errors.last_name && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.last_name}
							</p>
						)}
					</div>

					{/* Contraseña */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Nueva contraseña
						</label>
						<div className='relative'>
							<input
								name='password'
								type={showPassword ? 'text' : 'password'}
								value={form.password}
								onChange={handleChange}
								placeholder='Dejar vacío para no cambiar'
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
					{form.password && (
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
					)}

					{/* Error API */}
					{updateUser.isError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(updateUser.error)}
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
							disabled={updateUser.isPending}
							className='flex-1 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							{updateUser.isPending ? 'Guardando...' : 'Guardar'}
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
