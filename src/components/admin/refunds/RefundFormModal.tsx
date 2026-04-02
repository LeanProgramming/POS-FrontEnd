import { useState } from 'react';
import { useCreateRefund } from '../../../queries/refunds.queries';
import type { ISale } from '../../../types/sales.type';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { getErrorMessage } from '../../../api/errors';

interface IRefundFormModalProps {
	sales: ISale[];
	onClose: () => void;
}

export const RefundFormModal = ({ sales, onClose }: IRefundFormModalProps) => {
	const createRefund = useCreateRefund();

	const [saleId, setSaleId] = useState('');
	const [reason, setReason] = useState('');
	const [selectedItems, setSelectedItems] = useState<
		{ product_id: string; quantity: number; name: string; maxQty: number }[]
	>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Venta seleccionada
	const selectedSale = sales.find((s) => s._id === saleId);

	const handleSaleChange = (id: string) => {
		setSaleId(id);
		setSelectedItems([]);
		setErrors({});
	};

	const handleToggleItem = (
		productId: string,
		name: string,
		maxQty: number,
	) => {
		setSelectedItems((prev) => {
			const exists = prev.find((i) => i.product_id === productId);
			if (exists) return prev.filter((i) => i.product_id !== productId);
			return [...prev, { product_id: productId, name, quantity: 1, maxQty }];
		});
	};

	const handleQtyChange = (productId: string, qty: number) => {
		setSelectedItems((prev) =>
			prev.map((i) =>
				i.product_id === productId ? { ...i, quantity: qty } : i,
			),
		);
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!saleId) newErrors.saleId = 'Seleccioná una venta';
		if (selectedItems.length === 0)
			newErrors.items = 'Seleccioná al menos un ítem';
		if (!reason.trim()) newErrors.reason = 'Ingresá el motivo';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		createRefund.mutate(
			{
				sale_id: saleId,
				items: selectedItems.map(({ product_id, quantity }) => ({
					product_id,
					quantity,
				})),
				reason: reason.trim(),
			},
			{ onSuccess: onClose },
		);
	};
	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-md bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<h2 className='text-[15px] font-semibold text-white'>
						Nueva devolución
					</h2>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-xl leading-none'
					>
						×
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className='p-5 space-y-4 max-h-[75vh] overflow-y-auto'
				>
					{/* Selector de venta */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Venta a devolver
						</label>
						<select
							value={saleId}
							onChange={(e) => handleSaleChange(e.target.value)}
							className={selectClass(!!errors.saleId)}
						>
							<option value=''>Seleccioná una venta...</option>
							{sales.map((s) => (
								<option key={s._id} value={s._id}>
									#{s._id.slice(-8).toUpperCase()} — {formatPrice(s.total)} —{' '}
									{formatDate(s.created_at)}
								</option>
							))}
						</select>
						{errors.saleId && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.saleId}
							</p>
						)}
					</div>

					{/* Ítems de la venta seleccionada */}
					{selectedSale && (
						<div>
							<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
								Ítems a devolver
							</label>
							<div className='space-y-1.5'>
								{selectedSale.items.map((item) => {
									const selected = selectedItems.find(
										(i) => i.product_id === item.product_id,
									);
									return (
										<div
											key={item.product_id}
											className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
												selected
													? 'bg-[#0f1f12] border-green-800'
													: 'bg-[#141414] border-[#252525] hover:border-[#444]'
											}`}
											onClick={() =>
												handleToggleItem(
													item.product_id,
													item.name,
													item.quantity,
												)
											}
										>
											{/* Checkbox visual */}
											<div
												className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
													selected
														? 'bg-green-500 border-green-500'
														: 'border-[#333]'
												}`}
											>
												{selected && (
													<svg
														className='w-2.5 h-2.5 text-black'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={3}
															d='M5 13l4 4L19 7'
														/>
													</svg>
												)}
											</div>

											<span className='flex-1 text-[13px] text-[#ccc]'>
												{item.name}
											</span>

											<span className='text-[11px] font-mono text-[#555]'>
												x{item.quantity}
											</span>

											{/* Selector de cantidad si está seleccionado */}
											{selected && (
												<select
													value={selected.quantity}
													onClick={(e) => e.stopPropagation()}
													onChange={(e) =>
														handleQtyChange(
															item.product_id,
															Number(e.target.value),
														)
													}
													className='bg-[#0d0d0d] border border-green-800 rounded px-1.5 py-0.5 text-[12px] font-mono text-green-400 outline-none'
												>
													{Array.from(
														{ length: item.quantity },
														(_, i) => i + 1,
													).map((n) => (
														<option key={n} value={n}>
															{n}
														</option>
													))}
												</select>
											)}
										</div>
									);
								})}
							</div>
							{errors.items && (
								<p className='text-[11px] font-mono text-red-500 mt-1'>
									{errors.items}
								</p>
							)}
						</div>
					)}

					{/* Motivo */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Motivo
						</label>
						<input
							type='text'
							value={reason}
							onChange={(e) => {
								setReason(e.target.value);
								setErrors((prev) => ({ ...prev, reason: '' }));
							}}
							placeholder='Ej: Producto dañado'
							className={inputClass(!!errors.reason)}
						/>
						{errors.reason && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>
								{errors.reason}
							</p>
						)}
					</div>

					{/* Error API */}
					{createRefund.isError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(createRefund.error)}
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
							disabled={createRefund.isPending}
							className='flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors'
						>
							{createRefund.isPending
								? 'Registrando...'
								: 'Registrar devolución'}
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

const selectClass = (hasError: boolean) =>
	`w-full bg-[#141414] border rounded-lg px-3 py-2.5 text-[13px] text-[#e5e5e5] outline-none transition-colors ${
		hasError
			? 'border-red-800 focus:border-red-600'
			: 'border-[#2a2a2a] focus:border-green-700'
	}`;
