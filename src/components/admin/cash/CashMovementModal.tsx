import { useState, type SubmitEvent } from 'react';
import { useCashIn, useCashOut } from '../../../queries/cash.queries';
import { useCashStore } from '../../../store/useCashStore.';
import { getErrorMessage } from '../../../api/errors';

interface ICashMovementModalProps {
	type: 'cash_in' | 'cash_out';
	onClose: () => void;
}

export const CashMovementModal = ({
	type,
	onClose,
}: ICashMovementModalProps) => {
	const { sessionId } = useCashStore();
	const cashIn = useCashIn();
	const cashOut = useCashOut();

	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');

	const mutation = type === 'cash_in' ? cashIn : cashOut;
	const isIncome = type === 'cash_in';

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		const parsed = parseFloat(amount.replace(',', '.'));
		if (isNaN(parsed) || parsed <= 0) {
			setError('Ingresá un monto válido');
			return;
		}
		setError('');
		mutation.mutate(
			{
				session_id: sessionId!,
				amount: parsed,
				description: description.trim() || undefined,
			},
			{ onSuccess: onClose },
		);
	};

	return (
		<div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
			<div className='bg-[#111] border border-[#1e1e1e] rounded-xl w-full max-w-sm p-6 space-y-4'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<h2 className='text-[15px] font-semibold text-white'>
						{isIncome ? 'Registrar ingreso' : 'Registrar egreso'}
					</h2>
					<button onClick={onClose} className='text-[#555] hover:text-white'>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Monto */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Monto
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
							className={`w-full bg-[#141414] border rounded-lg px-3 py-2.5 text-[14px] font-mono text-white placeholder-[#333] outline-none transition-colors ${isIncome ? 'border-[#2a2a2a] focus:border-green-700' : 'border-[#2a2a2a] focus:border-red-700'}`}
						/>
						{error && (
							<p className='text-[11px] font-mono text-red-500 mt-1'>{error}</p>
						)}
					</div>

					{/* Descripción */}
					<div>
						<label className='block text-[11px] font-mono text-[#555] uppercase tracking-widest mb-1.5'>
							Descripción <span className='text-[#333]'>(opcional)</span>
						</label>
						<input
							type='text'
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
								setError('');
							}}
							placeholder={
								isIncome
									? 'Ej. Cambio para caja chica'
									: 'Ej. Compra de insumos'
							}
							className={`w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#555] rounded-lg px-3 py-2.5 text-[13px] text-[#ccc] placeholder-[#333] outline-none transition-colors`}
						/>
					</div>

					{/* Errores del backend */}
					{mutation.isError && (
						<p className='text-[12px] font-mono text-red-500'>
							{getErrorMessage(mutation.error)}
						</p>
					)}

					<div className='flex gap-2 pt-2'>
						<button
							type='button'
							onClick={onClose}
							disabled={mutation.isPending}
							className='flex-1 py-2.5 bg-[#161616] border border-[#252525] hover:border-[#444] text-[13px] font-mono text-[#888] rounded-lg transition-colors disabled:opacity-50'
						>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={mutation.isPending}
							className={`flex-1 py-2.5 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors ${isIncome ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
						>
							{mutation.isPending
								? 'Registrando...'
								: isIncome
									? 'Registrar ingreso'
									: 'Registrar egreso'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
