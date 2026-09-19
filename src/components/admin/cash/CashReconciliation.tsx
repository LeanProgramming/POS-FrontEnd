import { useState } from 'react';
import { useCashBalance, useCloseCash } from '../../../queries/cash.queries';
import { MovementsSkeleton } from './MovementsSkeleton';
import { formatPrice } from '../../../utils/formatPrice';
import { CashCounter } from './CashCounter';
import { useNavigate } from 'react-router-dom';
import { useCashStore } from '../../../store/useCashStore.';
import { getErrorMessage } from '../../../api/errors';
import toast from 'react-hot-toast';

export const CashReconciliation = () => {
	const navigate = useNavigate();
	const { data: balance, isLoading } = useCashBalance();
	const closeCash = useCloseCash();
	const { setSessionId } = useCashStore();

	const [showCounter, setShowCounter] = useState(false);
	const [closingBalance, setClosingBalance] = useState('');
	const [closingTransferBalance, setClosingTransferBalance] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);

	if (isLoading) {
		return (
			<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
				<MovementsSkeleton />
			</div>
		);
	}

	if (!balance) return null;

	const cashDifference = closingBalance
		? parseFloat(closingBalance.replace(',', '.')) -
			balance.expected_cash_balance
		: 0;

	const transferDifference = closingTransferBalance
		? parseFloat(closingTransferBalance.replace(',', '.')) -
			balance.total_non_cash_sales
		: 0;

	const handleCloseCash = () => {
		closeCash.mutate(
			{
				session_id: balance.session_id,
				closing_balance: parseFloat(closingBalance.replace(',', '.')) || 0,
				closing_transfer_balance:
					parseFloat(closingTransferBalance.replace(',', '.')) || 0,
			},
			{
				onSuccess: () => {
					setSessionId(null);
					navigate('/cash');
				},
			},
		);
	};

	return (
		<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4 space-y-3'>
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
									setClosingBalance(amount.toString());
									setShowCounter(false);
								}}
								onClose={() => setShowCounter(false)}
							/>
						)}
					</div>

					{/* Input de efectivo contado */}
					<div className='border-t border-[#252525] pt-3 space-y-2'>
						<p className='text-[10px] font-mono text-[#444] uppercase tracking-wider'>
							Ingresá los montos contados
						</p>

						{/* Efectivo contado */}
						<div>
							<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest'>
								Efectivo contado
							</label>
							<input
								type='number'
								min='0'
								value={closingBalance}
								onChange={(e) => setClosingBalance(e.target.value)}
								placeholder='Monto en efectivo'
								className='w-full bg-[#141414] border border-[#2a2a2a] focus:border-green-70 rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none transition-colors'
							/>
						</div>

						{/* Transferencias contadas */}
						<div>
							<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest'>
								Transferencias contadas
							</label>
							<input
								type='number'
								min='0'
								value={closingTransferBalance}
								onChange={(e) => setClosingTransferBalance(e.target.value)}
								placeholder='Monto en transferencias'
								className='w-full bg-[#141414] border border-[#2a2a2a] focus:border-green-70 rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none transition-colors'
							/>
						</div>

						{/* Diferencias */}
						{(closingBalance || closingTransferBalance) && (
							<div className='border-t border-[#252525] pt-3 space-y-2'>
								<p className='text-[10px] font-mono text-[#444] uppercase tracking-wider'>
									Diferencia
								</p>
								<div className='flex justify-between items-center'>
									<span className='text-[12px] font-mono text-[#555]'>
										Efectivo
									</span>
									<span
										className={`text-[13px] font-mono font-semibold ${cashDifference === 0 ? 'text-green-500' : cashDifference > 0 ? 'text-yellow-500' : 'text-red-500'}`}
									>
										{cashDifference > 0 ? '+' : ''}
										{formatPrice(cashDifference)}
										{cashDifference !== 0 && (
											<p className='text-[10px] ml-1'>
												{cashDifference > 0 ? 'Sobrante' : 'Faltante'} en caja
											</p>
										)}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-[12px] font-mono text-[#555]'>
										Transferencia
									</span>
									<span
										className={`text-[13px] font-mono font-semibold ${transferDifference === 0 ? 'text-green-500' : transferDifference > 0 ? 'text-yellow-500' : 'text-red-500'}`}
									>
										{transferDifference > 0 ? '+' : ''}
										{formatPrice(transferDifference)}
										{transferDifference !== 0 && (
											<p className='text-[10px] ml-1'>
												{transferDifference > 0 ? 'Sobrante' : 'Faltante'} en
												caja
											</p>
										)}
									</span>
								</div>
								{cashDifference === 0 &&
									transferDifference === 0 &&
									closingBalance &&
									closingTransferBalance && (
										<p className='text-[11px] font-mono text-green-500'>
											¡Caja cuadrada!
										</p>
									)}
							</div>
						)}

						{/* Errores del backed */}
						{closeCash.isError && (
							<p className='text-[12px] font-mono text-red-500'>
								{getErrorMessage(closeCash.error)}
							</p>
						)}

						{/* Botón cerrar caja */}
						{!showConfirm ? (
							<button
								onClick={() => {
									if (!closingBalance) {
										toast.error(
											'Debes ingresar los montos de efectivo y transferencias.',
										);
										return;
									}
									setShowConfirm(true);
								}}
								className='w-full py-3 bg-[#2a1414] hover:bg-[#3a1a1a] border border-red-900 text-red-500 text-[13px] font-semibold rounded-lg transition-colors'
							>
								Cerrar caja
							</button>
						) : (
							<div className='bg-[#1a0f0f] border border-red-900 rounded-lg p-4 space-y-3'>
								<p className='text-[13px] text-[#ccc]'>
									¿Confirmás el cierre de caja?
								</p>
								<div className='flex gap-2'>
									<button
										onClick={() => setShowConfirm(false)}
										disabled={closeCash.isPending}
										className='flex-1 py-2 bg-[#161616] border border-[#252525] hover:border-[#444] text-[13px] font-mono text-[#888] rounded-lg transition-colors'
									>
										Cancelar
									</button>
									<button
										onClick={handleCloseCash}
										disabled={closeCash.isPending}
										className='flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors'
									>
										{closeCash.isPending ? 'Cerrando...' : 'Confirmar cierre'}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
