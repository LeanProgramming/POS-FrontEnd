import { useEffect, useState } from 'react';
import {
	useCreateProduct,
	useUpdateProduct,
} from '../../../queries/products.queries';
import type { ICategory } from '../../../types/categories.type';
import type {
	ICreateProductPayload,
	IProduct,
} from '../../../types/product.type';
import { getErrorMessage } from '../../../api/errors';

interface IProductFormModalProps {
	product: IProduct | null;
	categories: ICategory[];
	onClose: () => void;
}

type FormData = {
	name: string;
	sku: string;
	price: string;
	cost: string;
	stock: string;
	category: string;
	barcode: string;
};

const EMPTY_FORM: FormData = {
	name: '',
	sku: '',
	price: '',
	cost: '',
	stock: '',
	category: '',
	barcode: '',
};

export const ProductFormModal = ({
	product,
	categories,
	onClose,
}: IProductFormModalProps) => {
	const isEditing = !!product;
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();

	const isPending = createProduct.isPending || updateProduct.isPending;
	const mutationError = createProduct.error || updateProduct.error;

	const [form, setForm] = useState<FormData>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<FormData>>({});

	useEffect(() => {
		if (product) {
			setForm({
				name: product.name,
				sku: product.sku,
				price: String(product.price),
				cost: String(product.cost),
				stock: String(product.stock),
				category: product.category,
				barcode: product.barcode ?? '',
			});
		}
	}, [product]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<FormData> = {};
		if (!form.name.trim()) newErrors.name = 'Requerido';
		if (!form.sku.trim()) newErrors.sku = 'Requerido';
		if (!form.price || isNaN(Number(form.price)))
			newErrors.price = 'Precio inválido';
		if (!form.cost || isNaN(Number(form.cost)))
			newErrors.cost = 'Costo inválido';
		if (!form.stock || isNaN(Number(form.stock)))
			newErrors.stock = 'Stock inválido';
		if (!form.category) newErrors.category = 'Requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const buildPayload = (): ICreateProductPayload => ({
		name: form.name.trim(),
		sku: form.sku.trim().toUpperCase(),
		price: Number(form.price),
		cost: Number(form.cost),
		stock: Number(form.stock),
		category: form.category,
		...(form.barcode.trim() && { barcode: form.barcode.trim() }),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const payload = buildPayload();

		if (isEditing) {
			updateProduct.mutate(
				{ id: product._id, payload },
				{ onSuccess: onClose },
			);
		} else {
			createProduct.mutate(payload, { onSuccess: onClose });
		}
	};
	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-lg bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						{isEditing ? 'Editar producto' : 'Nuevo producto'}
					</h2>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-xl leading-none'
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					{/* Nombre */}
					<FormField label='Nombre' error={errors.name}>
						<input
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder='Ej: Camisa manga larga'
							className={inputClass(!!errors.name)}
						/>
					</FormField>

					{/* SKU + Barcode */}
					<div className='grid grid-cols-2 gap-3'>
						<FormField label='SKU' error={errors.sku}>
							<input
								name='sku'
								value={form.sku}
								onChange={handleChange}
								placeholder='Ej: ROP0001'
								className={inputClass(!!errors.sku)}
							/>
						</FormField>
						<FormField label='Código de barras' error={errors.barcode}>
							<input
								name='barcode'
								value={form.barcode}
								onChange={handleChange}
								placeholder='Opcional'
								className={inputClass(false)}
							/>
						</FormField>
					</div>

					{/* Categoría */}
					<FormField label='Categoría' error={errors.category}>
						<select
							name='category'
							value={form.category}
							onChange={handleChange}
							className={inputClass(!!errors.category)}
						>
							<option value=''>Seleccioná una categoría</option>
							{categories.map((c) => (
								<option key={c._id} value={c.name}>
									{c.name}
								</option>
							))}
						</select>
					</FormField>

					{/* Precio + Costo */}
					<div className='grid grid-cols-2 gap-3'>
						<FormField label='Precio de venta' error={errors.price}>
							<input
								name='price'
								type='number'
								min='0'
								value={form.price}
								onChange={handleChange}
								placeholder='0'
								className={inputClass(!!errors.price)}
							/>
						</FormField>
						<FormField label='Costo' error={errors.cost}>
							<input
								name='cost'
								type='number'
								min='0'
								value={form.cost}
								onChange={handleChange}
								placeholder='0'
								className={inputClass(!!errors.cost)}
							/>
						</FormField>
					</div>

					{/* Stock */}
					<FormField label='Stock inicial' error={errors.stock}>
						<input
							name='stock'
							type='number'
							min='0'
							value={form.stock}
							onChange={handleChange}
							placeholder='0'
							className={inputClass(!!errors.stock)}
						/>
					</FormField>

					{/* Error de API */}
					{mutationError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(mutationError)}
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
							disabled={isPending}
							className='flex-1 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							{isPending
								? 'Guardando...'
								: isEditing
									? 'Guardar cambios'
									: 'Crear producto'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

function FormField({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
				{label}
			</label>
			{children}
			{error && (
				<p className='text-[11px] font-mono text-red-500 mt-1'>{error}</p>
			)}
		</div>
	);
}

const inputClass = (hasError: boolean) =>
	`w-full bg-[#141414] border rounded-lg px-3 py-2.5 text-[13px] text-[#e5e5e5] placeholder-[#333] outline-none transition-colors ${
		hasError
			? 'border-red-800 focus:border-red-600'
			: 'border-[#2a2a2a] focus:border-green-700'
	}`;
