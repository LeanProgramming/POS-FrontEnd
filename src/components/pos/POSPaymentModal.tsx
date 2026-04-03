import { useState } from 'react';
import { usePOSStore } from '../../store/usePOSStore';
import { PAYMENT_METHODS, type TPaymentMethod } from '../../types/sales.type';
import { formatPrice } from '../../utils/formatPrice';

interface IPOSPaymentModalProps {
	total: number;
	onClose: () => void;
	onConfirm: () => void;
	isSubmitting: boolean;
	error: string | null;
}

export const POSPaymentModal = ({
	total,
	onClose,
	onConfirm,
	isSubmitting,
	error,
}: IPOSPaymentModalProps) => {
	const { payments, addPayment, removePayment, totalPaid, remainingAmount } =
		usePOSStore();

	const [selectedMethod, setSelectedMethod] = useState<TPaymentMethod>('cash');
	const [amount, setAmount] = useState<string>('');

	const paid = totalPaid();
	const remaining = remainingAmount();
	const isComplete = paid >= total && total > 0;

	const handleAddPayment = () => {
		const parsed = parseFloat(amount.replace(',', '.'));
		if (isNaN(parsed) || parsed <= 0) return;
		addPayment(selectedMethod, parsed);
		setAmount('');
	};

	const handleAmountKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleAddPayment();
	};

	const handleExactAmount = () => {
		setAmount(remaining.toFixed(0));
	};

	return (
		<div
			className='absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4'
			style={{ position: 'fixed' }}
		>
			<div className='w-full max-w-md bg-[#111] border border-[#252525] rounded-xl overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]'>
					<div>
						<h2 className='text-[15px] font-semibold text-white'>
							Registrar pago
						</h2>
						<p className='text-[12px] font-mono text-[#555] mt-0.5'>
							Total a cobrar: {formatPrice(total)}
						</p>
					</div>
					<button
						onClick={onClose}
						className='text-[#555] hover:text-white transition-colors text-lg font-mono'
					>
						×
					</button>
				</div>

				<div className='p-5 space-y-4'>
					{/* Métodos de pago */}
					<div>
						<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
							Método de pago
						</p>
						<div className='grid grid-cols-4 gap-2'>
							{PAYMENT_METHODS.map((m) => (
								<button
									key={m.value}
									onClick={() => setSelectedMethod(m.value)}
									className={`py-2 rounded-lg text-[12px] font-mono border transition-all ${
										selectedMethod === m.value
											? 'bg-[#0f1f12] border-green-700 text-green-400'
											: 'bg-[#161616] border-[#252525] text-[#666] hover:border-[#444]'
									}`}
								>
									{m.label}
								</button>
							))}
						</div>
					</div>

					{/* Monto */}
					<div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest'>
								Monto
							</p>
							{remaining > 0 && (
								<button
									onClick={handleExactAmount}
									className='text-[11px] font-mono text-green-700 hover:text-green-500 transition-colors'
								>
									Resto exacto ({formatPrice(remaining)})
								</button>
							)}
						</div>
						<div className='flex gap-2'>
							<input
								type='number'
								min='0'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								onKeyDown={handleAmountKey}
								placeholder='0'
								autoFocus
								className='flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none focus:border-green-700 transition-colors'
							/>
							<button
								onClick={handleAddPayment}
								disabled={!amount}
								className='px-4 py-2.5 bg-[#161616] border border-[#252525] hover:border-[#444] disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-mono text-[#aaa] rounded-lg transition-colors'
							>
								Agregar
							</button>
						</div>
					</div>

					{/* Pagos registrados */}
					{payments.length > 0 && (
						<div>
							<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
								Pagos registrados
							</p>
							<div className='space-y-1.5'>
								{payments.map((p, i) => (
									<div
										key={i}
										className='flex items-center justify-between bg-[#161616] border border-[#252525] rounded-lg px-3 py-2'
									>
										<span className='text-[12px] font-mono text-[#888] capitalize'>
											{
												PAYMENT_METHODS.find((pm) => pm.value === p.method)
													?.label
											}
										</span>
										<div className='flex items-center gap-3'>
											<span className='text-[13px] font-mono text-white'>
												{formatPrice(p.amount)}
											</span>
											<button
												onClick={() => removePayment(i)}
												className='text-[#444] hover:text-red-500 transition-colors text-sm'
											>
												×
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Resumen */}
					<div className='bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-3 space-y-1.5'>
						<div className='flex justify-between text-[12px] font-mono'>
							<span className='text-[#555]'>Total</span>
							<span className='text-[#aaa]'>{formatPrice(total)}</span>
						</div>
						<div className='flex justify-between text-[12px] font-mono'>
							<span className='text-[#555]'>Pagado</span>
							<span className={paid > 0 ? 'text-green-500' : 'text-[#aaa]'}>
								{formatPrice(paid)}
							</span>
						</div>
						{paid > total && (
							<div className='flex justify-between text-[12px] font-mono border-t border-[#1e1e1e] pt-1.5'>
								<span className='text-[#555]'>Vuelto</span>
								<span className='text-amber-500'>
									{formatPrice(paid - total)}
								</span>
							</div>
						)}
						{!isComplete && remaining > 0 && (
							<div className='flex justify-between text-[12px] font-mono border-t border-[#1e1e1e] pt-1.5'>
								<span className='text-[#555]'>Falta</span>
								<span className='text-red-500'>{formatPrice(remaining)}</span>
							</div>
						)}
					</div>

					{/* Error */}
					{error && (
						<p className='text-[12px] font-mono text-red-500'>{error}</p>
					)}

					{/* Confirmar */}
					<button
						onClick={onConfirm}
						disabled={!isComplete || isSubmitting}
						className={`w-full py-3 rounded-lg text-[13px] font-semibold font-mono transition-all ${
							isComplete && !isSubmitting
								? 'bg-green-500 hover:bg-green-400 text-black active:scale-[0.98]'
								: 'bg-[#161616] border border-[#252525] text-[#333] cursor-not-allowed'
						}`}
					>
						{isSubmitting
							? 'Confirmando...'
							: isComplete
								? 'Confirmar venta'
								: `Falta ${formatPrice(remaining)}`}
					</button>
				</div>
			</div>
		</div>
	);
};
