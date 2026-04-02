import React, { useState } from 'react';
import { useOpenCash } from '../../../queries/cash.queries';
import { getErrorMessage } from '../../../api/errors';
import { useCashStore } from '../../../store/useCashStore.';

export const CashClosed = () => {
	const openCash = useOpenCash();
	const [amount, setAmount] = useState('');
	const [error, setError] = useState('');
	const { cashRegisterSelected, setSessionId } = useCashStore();

	const handleOpen = (e: React.FormEvent) => {
		e.preventDefault();
		const parsed = parseFloat(amount.replace(',', '.'));
		if (isNaN(parsed) || parsed < 0) {
			setError('Ingresá un monto válido');
			return;
		}
		if (!cashRegisterSelected) {
			setError('No existe caja registradora seleccionada');
			return;
		}
		setError('');
		openCash.mutate(
			{
				register_id: cashRegisterSelected._id,
				opening_balance: parsed,
			},
			{
				onSuccess: (data) => {
					setSessionId(data.session._id);
				},
			},
		);
	};

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<h1 className='text-xl font-semibold text-white'>Caja</h1>
				<p className='text-[13px] text-[#555] mt-0.5'>
					Control de efectivo y movimientos
				</p>
			</div>

			<div className='flex items-center justify-center py-12'>
				<div className='w-full max-w-sm bg-[#111] border border-[#1e1e1e] rounded-xl p-8'>
					{/* Indicador */}
					<div className='flex items-center gap-2 mb-6'>
						<span className='w-2.5 h-2.5 rounded-full bg-red-500' />
						<span className='text-[13px] font-mono text-red-500'>
							Caja cerrada
						</span>
					</div>

					<h2 className='text-[16px] font-semibold text-white mb-1'>
						Abrir caja
					</h2>
					<p className='text-[13px] text-[#555] mb-6'>
						Ingresá el monto inicial en efectivo para comenzar el día.
					</p>

					<form onSubmit={handleOpen} className='space-y-4'>
						<div>
							<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
								Monto inicial
							</label>
							<input
								type='number'
								min='0'
								value={amount}
								onChange={(e) => {
									setAmount(e.target.value);
									setError('');
								}}
								placeholder='0'
								autoFocus
								className='w-full bg-[#141414] border border-[#2a2a2a] focus:border-green-700 rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none transition-colors'
							/>
							{error && (
								<p className='text-[11px] font-mono text-red-500 mt-1'>
									{error}
								</p>
							)}
						</div>

						{openCash.isError && (
							<p className='text-[12px] font-mono text-red-500'>
								{getErrorMessage(openCash.error)}
							</p>
						)}

						<button
							type='submit'
							disabled={openCash.isPending}
							className='w-full py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							{openCash.isPending ? 'Abriendo...' : 'Abrir caja'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
