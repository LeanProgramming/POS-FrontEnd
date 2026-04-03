import { useState } from 'react';
import { useCreateRefund } from '../../../queries/refunds.queries';
import { PAYMENT_METHODS, type ISale } from '../../../types/sales.type';
import { formatDate } from '../../../utils/formatDate';
import { formatPrice } from '../../../utils/formatPrice';
import { getErrorMessage } from '../../../api/errors';

interface ISaleRowProps {
	sale: ISale;
	isAdmin: boolean;
	isExpanded: boolean;
	isRefunding: boolean;
	onToggle: () => void;
	onRefundOpen: () => void;
	onRefundClose: () => void;
}

export const SaleRow = ({
	sale,
	isAdmin,
	isExpanded,
	isRefunding,
	onToggle,
	onRefundOpen,
	onRefundClose,
}: ISaleRowProps) => {
	const createRefund = useCreateRefund();
	const [selectedItems, setSelectedItems] = useState<
		{ product_id: string; quantity: number; maxQty: number }[]
	>([]);
	const [reason, setReason] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleToggleItem = (productId: string, maxQty: number) => {
		setSelectedItems((prev) => {
			const exists = prev.find((i) => i.product_id === productId);
			return exists
				? prev.filter((i) => i.product_id !== productId)
				: [...prev, { product_id: productId, quantity: 1, maxQty }];
		});
	};

	const handleQtyChange = (productId: string, qty: number) => {
		setSelectedItems((prev) =>
			prev.map((i) =>
				i.product_id === productId ? { ...i, quantity: qty } : i,
			),
		);
	};

	const handleRefundClose = () => {
		setSelectedItems([]);
		setReason('');
		setErrors({});
		onRefundClose();
	};

	const handleRefundSubmit = () => {
		const newErrors: Record<string, string> = {};
		if (selectedItems.length === 0)
			newErrors.items = 'Seleccioná al menos un ítem';
		if (!reason.trim()) newErrors.reason = 'Ingresá el motivo';
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		createRefund.mutate(
			{
				sale_id: sale._id,
				items: selectedItems.map(({ product_id, quantity }) => ({
					product_id,
					quantity,
				})),
				reason: reason.trim(),
			},
			{ onSuccess: handleRefundClose },
		);
	};

	return (
		<div>
			<button
				onClick={onToggle}
				className='w-full grid grid-cols-[1fr_100px_140px_32px] gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors text-left'
			>
				<div className='flex flex-col gap-0.5'>
					<span className='text-[12px] font-mono text-[#888]'>
						#{sale._id.slice(-8).toUpperCase()}
					</span>
					<span className='text-[11px] font-mono text-[#444]'>
						{formatDate(sale.created_at)}
					</span>
				</div>
				<span className='text-[13px] font-mono text-[#666]'>
					{sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
				</span>
				<span className='text-[14px] font-mono font-semibold text-green-500'>
					{formatPrice(sale.total)}
				</span>
				<span
					className={`text-[#444] transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
				>
					<svg
						className='w-4 h-4'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</span>
			</button>

			{isExpanded && (
				<div className='bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 py-4 space-y-4'>
					{/* Productos */}
					<div>
						<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
							Productos
						</p>
						<div className='space-y-1'>
							{sale.items.map((item, i) => (
								<div key={i} className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<span className='text-[11px] font-mono text-[#444] w-5'>
											x{item.quantity}
										</span>
										<span className='text-[13px] text-[#ccc]'>{item.name}</span>
									</div>
									<span className='text-[13px] font-mono text-[#888]'>
										{formatPrice(item.price * item.quantity)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Pagos */}
					<div>
						<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
							Pagos
						</p>
						<div className='flex gap-1.5 flex-wrap'>
							{sale.payment_methods.map((p, i) => (
								<span
									key={i}
									className='text-[13px] font-mono text-[#eee] bg-[#161616] border border-[#252525] rounded px-2 py-0.5 capitalize'
								>
									{PAYMENT_METHODS.find((pm) => pm.value === p.method)?.label} ·{' '}
									{formatPrice(p.amount)}
								</span>
							))}
						</div>
					</div>

					<div className='flex justify-between items-center border-t border-[#1e1e1e] pt-3'>
						<span className='text-[12px] font-mono text-[#555]'>Total</span>
						<span className='text-[15px] font-mono font-semibold text-green-500'>
							{formatPrice(sale.total)}
						</span>
					</div>

					{/* Devolución parcial — disponible para todos */}
					{!isRefunding ? (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onRefundOpen();
							}}
							className='w-full py-2 bg-[#1a1a1a] hover:bg-[#2a1414] border border-[#252525] hover:border-red-900 text-[12px] font-mono text-[#666] hover:text-red-500 rounded-lg transition-colors'
						>
							{isAdmin ? 'Registrar devolución' : 'Cancelar / devolver ítems'}
						</button>
					) : (
						<div className='bg-[#111] border border-[#1e1e1e] rounded-lg p-4 space-y-3'>
							<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
								Seleccioná los ítems a devolver
							</p>

							{/* Selector de ítems */}
							<div className='space-y-1.5'>
								{sale.items.map((item) => {
									const selected = selectedItems.find(
										(i) => i.product_id === item.product_id,
									);
									return (
										<div
											key={item.product_id}
											onClick={() =>
												handleToggleItem(item.product_id, item.quantity)
											}
											className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
												selected
													? 'bg-[#0f1f12] border-green-800'
													: 'bg-[#141414] border-[#252525] hover:border-[#444]'
											}`}
										>
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
											<span className='flex-1 text-[12px] text-[#ccc]'>
												{item.name}
											</span>
											<span className='text-[11px] font-mono text-[#555]'>
												x{item.quantity}
											</span>
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
													className='bg-[#0d0d0d] border border-green-800 rounded px-1.5 py-0.5 text-[11px] font-mono text-green-400 outline-none'
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
								<p className='text-[11px] font-mono text-red-500'>
									{errors.items}
								</p>
							)}

							{/* Motivo */}
							<div>
								<input
									type='text'
									value={reason}
									onChange={(e) => {
										setReason(e.target.value);
										setErrors((p) => ({ ...p, reason: '' }));
									}}
									placeholder='Motivo de la devolución'
									className={`w-full bg-[#141414] border rounded-lg px-3 py-2 text-[12px] text-[#e5e5e5] placeholder-[#333] outline-none transition-colors ${
										errors.reason
											? 'border-red-800'
											: 'border-[#2a2a2a] focus:border-green-700'
									}`}
								/>
								{errors.reason && (
									<p className='text-[11px] font-mono text-red-500 mt-1'>
										{errors.reason}
									</p>
								)}
							</div>

							{createRefund.isError && (
								<p className='text-[11px] font-mono text-red-500'>
									{getErrorMessage(createRefund.error)}
								</p>
							)}

							<div className='flex gap-2'>
								<button
									onClick={handleRefundClose}
									disabled={createRefund.isPending}
									className='flex-1 py-2 bg-[#161616] border border-[#252525] text-[12px] font-mono text-[#888] rounded-lg transition-colors hover:border-[#444] disabled:opacity-50'
								>
									Cancelar
								</button>
								<button
									onClick={handleRefundSubmit}
									disabled={createRefund.isPending}
									className='flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg transition-colors'
								>
									{createRefund.isPending
										? 'Registrando...'
										: 'Confirmar devolución'}
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
