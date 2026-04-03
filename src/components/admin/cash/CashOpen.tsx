import { useState } from 'react';
import {
	useCashMovements,
	useCloseCash,
	useGetCashStatus,
} from '../../../queries/cash.queries';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { MetricCard } from './MetricCard';
import { getErrorMessage } from '../../../api/errors';
import { MovementsSkeleton } from './MovementsSkeleton';
import { MovementRow } from './MovementRow';
import { useCashStore } from '../../../store/useCashStore.';

interface ICashOpenProps {
	cashStatus: NonNullable<ReturnType<typeof useGetCashStatus>['data']>;
}

export const CashOpen = ({ cashStatus }: ICashOpenProps) => {
	const { data: cashStatusResponse } = useGetCashStatus();
	const closeCash = useCloseCash();
	const { data: movements = [], isLoading: loadingMovements } =
		useCashMovements();
	const [confirmClose, setConfirmClose] = useState(false);
	const { setSessionId } = useCashStore();

	const handleClose = () => {
		if (!cashStatusResponse) return;

		closeCash.mutate(
			{
				session_id: cashStatusResponse.session._id,
				closing_balance: cashStatusResponse.current_balance,
			},
			{
				onSuccess: () => {
					setConfirmClose(false);
					setSessionId(null);
				},
			},
		);
	};

	const totalIngresos = movements
		.filter((m) => m.type === 'cash_in')
		.reduce((acc, m) => acc + m.amount, 0);

	const totalEgresos = movements
		.filter((m) => m.type === 'cash_out')
		.reduce((acc, m) => acc + m.amount, 0);
	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Caja</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Control de efectivo y movimientos
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<span className='w-2 h-2 rounded-full bg-green-500' />
					<span className='text-[12px] font-mono text-green-500'>
						Caja abierta
					</span>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				{/* Panel izquierdo: resumen */}
				<div className='flex flex-col gap-4'>
					{/* Métricas */}
					<div className='grid grid-cols-2 gap-3'>
						<MetricCard
							label='Monto inicial'
							value={formatPrice(cashStatus.initial_balance)}
							accent='text-[#aaa]'
						/>
						<MetricCard
							label='Monto actual'
							value={formatPrice(cashStatus.current_balance)}
							accent='text-white'
						/>
						<MetricCard
							label='Ingresos'
							value={formatPrice(totalIngresos)}
							accent='text-green-500'
						/>
						<MetricCard
							label='Egresos'
							value={formatPrice(totalEgresos)}
							accent='text-red-500'
						/>
					</div>

					{/* Info apertura */}
					{cashStatus.openedAt && (
						<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-3 flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<span className='w-1.5 h-1.5 rounded-full bg-green-500' />
								<span className='text-[12px] font-mono text-[#555]'>
									Abierta el {formatDate(cashStatus.openedAt)}
								</span>
							</div>
							<span className='text-[11px] font-mono text-[#444]'>
								Inicial: {formatPrice(cashStatus.initial_balance)}
							</span>
						</div>
					)}

					{/* Cerrar caja */}
					{!confirmClose ? (
						<button
							onClick={() => setConfirmClose(true)}
							className='w-full py-3 bg-[#2a1414] hover:bg-[#3a1a1a] border border-red-900 text-red-500 text-[13px] font-semibold rounded-lg transition-colors'
						>
							Cerrar caja
						</button>
					) : (
						<div className='bg-[#1a0f0f] border border-red-900 rounded-lg p-4 space-y-3'>
							<p className='text-[13px] text-[#ccc]'>
								¿Confirmás el cierre de caja?
							</p>
							<p className='text-[12px] font-mono text-[#555]'>
								Se registrarán todos los movimientos del día.
							</p>
							{closeCash.isError && (
								<p className='text-[12px] font-mono text-red-500'>
									{getErrorMessage(closeCash.error)}
								</p>
							)}
							<div className='flex gap-2'>
								<button
									onClick={() => setConfirmClose(false)}
									className='flex-1 py-2 bg-[#161616] border border-[#252525] hover:border-[#444] text-[13px] font-mono text-[#888] rounded-lg transition-colors'
								>
									Cancelar
								</button>
								<button
									onClick={handleClose}
									disabled={closeCash.isPending}
									className='flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors'
								>
									{closeCash.isPending ? 'Cerrando...' : 'Confirmar cierre'}
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Panel derecho: movimientos */}
				<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden flex flex-col'>
					<div className='px-4 py-3 border-b border-[#1e1e1e] bg-[#161616] shrink-0'>
						<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
							Movimientos del día
						</p>
					</div>

					<div className='flex-1 overflow-y-auto divide-y divide-[#1a1a1a]'>
						{loadingMovements ? (
							<MovementsSkeleton />
						) : movements.length === 0 ? (
							<div className='flex items-center justify-center py-12'>
								<p className='text-[13px] font-mono text-[#444]'>
									Sin movimientos aún
								</p>
							</div>
						) : (
							movements.map((m) => <MovementRow key={m._id} movement={m} />)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
