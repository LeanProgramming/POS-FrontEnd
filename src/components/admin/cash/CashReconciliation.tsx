import { useState } from 'react';
import { useCashBalance } from '../../../queries/cash.queries';
import { MovementsSkeleton } from './MovementsSkeleton';
import { formatPrice } from '../../../utils/formatPrice';
import { CashCounter } from './CashCounter';

export const CashReconciliation = () => {
	const { data: balance, isLoading } = useCashBalance();
	const [showDetails, setShowDetails] = useState(false);
	const [showCounter, setShowCounter] = useState(false);
	const [countedAmount, setCountedAmount] = useState('');

	if (isLoading) {
		return (
			<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
				<MovementsSkeleton />
			</div>
		);
	}

	if (!balance) return null;

	const difference = countedAmount
		? parseFloat(countedAmount.replace(',', '.')) -
			balance.expected_cash_balance
		: 0;

	return (
		<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4 space-y-3'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest'>
					Arqueo de caja
				</p>
				<button
					onClick={() => setShowDetails(!showDetails)}
					className='p-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#252525] hover:border-[#444] text-[12px] font-mono text-[#666] hover:text-white rounded-lg transition-colors'
				>
					{showDetails ? 'Ocultar' : 'Ver detalle'}
				</button>
			</div>

			{/* Detalle expandible */}
			{showDetails && (
				<div className='space-y-3'>
					{/* Desgloce */}
					<div className='space-y-2 text-[12px] font-mono'>
						<div className='flex justify-between'>
							<span className='text-[#555]'>Apertura</span>

							<span className='text-[#888] text-green-500'>
								+{formatPrice(balance.opening_balance)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-[#555]'>Ventas (efectivo)</span>
							<span className='text-green-500'>
								+{formatPrice(balance.total_cash_sales)}
							</span>
						</div>

						{balance.total_cash_in > 0 && (
							<div className='flex justify-between'>
								<span className='text-[#555]'>Ingresos manuales</span>
								<span className='text-green-500'>
									+{formatPrice(balance.total_cash_in)}
								</span>
							</div>
						)}
						{balance.total_cash_out > 0 && (
							<div className='flex justify-between'>
								<span className='text-[#555]'>Egresos manuales</span>
								<span className='text-red-500'>
									-{formatPrice(balance.total_cash_out)}
								</span>
							</div>
						)}
						<div className='border-t border-[#252525] pt-2 flex justify-between'>
							<span className='text-[#888] font-semibold'>
								Saldo teórico en efectivo
							</span>
							<span className='text-white font-semibold'>
								{formatPrice(balance.expected_cash_balance)}
							</span>
						</div>
						<div className='border-t border-[#252525] pt-2 flex justify-between'>
							<span className='text-[#888] font-semibold'>
								Saldo teórico no en efectivo
							</span>
							<span className='text-white font-semibold'>
								{formatPrice(balance.total_non_cash_sales)}
							</span>
						</div>

						{/* Contador de efectivo */}
						<div className='border-t border-[#252525] pt-3'>
							{!showCounter ? (
								<button
									onClick={() => setShowCounter(true)}
									className='w-full py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#252525] hover:border-[#444] text-[12px] font-mono text-[#666] hover:text-white rounded-lg transition-colors'
								>
									Usar contador de efectivo
								</button>
							) : (
								<CashCounter
									onUseAmount={(amount) => {
										setCountedAmount(amount.toString());
										setShowCounter(false);
									}}
									onClose={() => setShowCounter(false)}
								/>
							)}
						</div>

						{/* Input de efectivo contado */}
						<div className='border-t border-[#252525] pt-3 space-y-2'>
							<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest'>
								Efectivo contado
							</label>
							<input
								type='number'
								min='0'
								value={countedAmount}
								onChange={(e) => setCountedAmount(e.target.value)}
								placeholder='Ingresá el monto contado'
								className='w-full bg-[#141414] border border-[#2a2a2a] focus:border-green-70 rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none transition-colors'
							/>

							{/* Diferencia */}
							{countedAmount && (
								<div className='flex justify-between items-center'>
									<span className='text-[12px] font-mono text-[#555]'>
										Diferencia
									</span>
									<span
										className={`text-[14px] font-mono font-semibold ${difference === 0 ? 'text-green-500' : difference > 0 ? 'text-yellow-500' : 'text-red-500'}`}
									>
										{difference > 0 ? '+' : ''}
										{formatPrice(difference)}
									</span>
								</div>
							)}
							{countedAmount && difference !== 0 && (
								<p className='text-[11px] font-mono text-[#555]'>
									{difference > 0 ? 'Sobrante' : 'Faltante'} en caja
								</p>
							)}
							{countedAmount && difference === 0 && (
								<p className='text-[11px] font-mono text-green-500'>
									¡Caja cuadrada!
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
