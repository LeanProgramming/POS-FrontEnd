import { useEffect, useState } from 'react';
import {
	useCreateCashRegister,
	useUpdateCashRegister,
} from '../../../queries/cash.queries';
import type { ICashRegister } from '../../../types/cash.type';
import { getErrorMessage } from '../../../api/errors';

interface ICashRegisterFormModalProps {
	cashRegister: ICashRegister | null;
	onClose: () => void;
}

type FormData = { name: string };
const EMPTY_FORM: FormData = { name: '' };

export const CashRegisterFormModal = ({
	cashRegister,
	onClose,
}: ICashRegisterFormModalProps) => {
	const isEditing = !!cashRegister;
	const createCashRegister = useCreateCashRegister();
	const updateCashRegister = useUpdateCashRegister();
	const isPending =
		createCashRegister.isPending || updateCashRegister.isPending;
	const mutationError = createCashRegister.error || updateCashRegister.error;
	const [form, setForm] = useState<FormData>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<FormData>>({});

	useEffect(() => {
		if (cashRegister) setForm({ name: cashRegister.name });
	}, [cashRegister]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const sanitized =
			name === 'prefix'
				? value
						.toUpperCase()
						.replace(/[^A-Z]/g, '')
						.slice(0, 4)
				: value;
		setForm((prev) => ({ ...prev, [name]: sanitized }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<FormData> = {};
		if (!form.name.trim()) newErrors.name = 'Requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		const payload = { name: form.name.trim() };
		if (isEditing) {
			updateCashRegister.mutate(
				{ _id: cashRegister._id, ...payload },
				{ onSuccess: onClose },
			);
		} else {
			createCashRegister.mutate(payload, { onSuccess: onClose });
		}
	};
	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						{isEditing ? 'Editar caja registradora' : 'Nueva caja registradora'}
					</h2>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-xl leading-none'
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Nombre
						</label>
						<input
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder='Ej: Caja Local 2'
							autoFocus
							className={inputClass(!!errors.name)}
						/>
						{errors.name && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.name}
							</p>
						)}
					</div>

					{mutationError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(mutationError)}
						</p>
					)}

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
							disabled={isPending}
							className='flex-1 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							{isPending
								? 'Guardando...'
								: isEditing
									? 'Guardar cambios'
									: 'Crear caja registradora'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const inputClass = (hasError: boolean) =>
	`w-full bg-[#141414] border rounded-lg px-3 py-2.5 text-[13px] text-[#e5e5e5] placeholder-[#333] outline-none transition-colors font-mono ${
		hasError
			? 'border-red-800 focus:border-red-600'
			: 'border-[#2a2a2a] focus:border-green-700'
	}`;
