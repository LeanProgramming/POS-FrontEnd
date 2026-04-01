import { useEffect, useState } from 'react';
import {
	useCreateCategory,
	useUpdateCategory,
} from '../../queries/categories.queries';
import type { ICategory } from '../../types/categories.type';
import { getErrorMessage } from '../../api/errors';

interface ICategoryFormModalProps {
	category: ICategory | null;
	onClose: () => void;
}

type FormData = { name: string; prefix: string };
const EMPTY_FORM: FormData = { name: '', prefix: '' };

export const CategoryFormModal = ({
	category,
	onClose,
}: ICategoryFormModalProps) => {
	const isEditing = !!category;
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const isPending = createCategory.isPending || updateCategory.isPending;
	const mutationError = createCategory.error || updateCategory.error;
	const [form, setForm] = useState<FormData>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<FormData>>({});

	useEffect(() => {
		if (category) setForm({ name: category.name, prefix: category.prefix });
	}, [category]);

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
		if (!form.prefix.trim()) newErrors.prefix = 'Requerido';
		else if (form.prefix.length < 2) newErrors.prefix = 'Mínimo 2 letras';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		const payload = { name: form.name.trim(), prefix: form.prefix.trim() };
		if (isEditing) {
			updateCategory.mutate(
				{ id: category._id, payload },
				{ onSuccess: onClose },
			);
		} else {
			createCategory.mutate(payload, { onSuccess: onClose });
		}
	};

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						{isEditing ? 'Editar categoría' : 'Nueva categoría'}
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
							placeholder='Ej: Ropa'
							autoFocus
							className={inputClass(!!errors.name)}
						/>
						{errors.name && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.name}
							</p>
						)}
					</div>

					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Prefijo de SKU
						</label>
						<input
							name='prefix'
							value={form.prefix}
							onChange={handleChange}
							placeholder='Ej: ROP'
							maxLength={4}
							className={inputClass(!!errors.prefix)}
						/>
						{errors.prefix ? (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.prefix}
							</p>
						) : (
							<p className='text-[11px] font-mono text-[#444] mt-1'>
								Solo letras, máximo 4 caracteres
							</p>
						)}
					</div>

					<div className='bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-3'>
						<p className='text-[11px] font-mono text-[#555] mb-1'>
							Preview del SKU
						</p>
						<p className='text-[14px] font-mono text-green-500'>
							{form.prefix ? `${form.prefix}0001` : '---'}
						</p>
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
									: 'Crear categoría'}
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
