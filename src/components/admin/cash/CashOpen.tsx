import { useState } from 'react';
import {
	useCashMovements,
	useGetCashStatus,
} from '../../../queries/cash.queries';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { MetricCard } from './MetricCard';
import { MovementsSkeleton } from './MovementsSkeleton';
import { MovementRow } from './MovementRow';
import { CashMovementModal } from './CashMovementModal';
import { useNavigate } from 'react-router-dom';

interface ICashOpenProps {
	cashStatus: NonNullable<ReturnType<typeof useGetCashStatus>['data']>;
}

export const CashOpen = ({ cashStatus }: ICashOpenProps) => {
	const navigate = useNavigate();
	const { data: movements = [], isLoading: loadingMovements } =
		useCashMovements();
	const [movementModal, setMovementModal] = useState<
		'cash_in' | 'cash_out' | null
	>(null);

	const totalIncome = movements
		.filter((m) => m.type === 'cash_in')
		.reduce((acc, m) => acc + m.amount, 0);

	const totalOutcome = movements
		.filter((m) => m.type === 'cash_out')
		.reduce((acc, m) => acc + m.amount, 0);

	const recentMovements = movements.slice(0, 5);

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

			{/* Metricas */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
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
					value={formatPrice(totalIncome)}
					accent='text-green-500'
				/>
				<MetricCard
					label='Egresos'
					value={formatPrice(totalOutcome)}
					accent='text-red-500'
				/>
			</div>

			{/* Info apertura */}
			{cashStatus.session.opened_at && (
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-3 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<span className='w-1.5 h-1.5 rounded-full bg-green-500' />
						<span className='text-[12px] font-mono text-[#555]'>
							Abierto el {formatDate(cashStatus.session.opened_at)}
						</span>
					</div>
					<span className='text-[11px] font-mono text-[#444]'>
						Inicial: {formatPrice(cashStatus.initial_balance)}
					</span>
				</div>
			)}

			{/* Botones de acción */}
			<div className='flex gap-2'>
				<button
					onClick={() => setMovementModal('cash_in')}
					className='flex-1 py-2.5 bg-[#0f1f12] hover:bg-[#142a18] border border-green-900 text-green-500 text-[12px] font-semibold rounded-lg transition-colors'
				>
					+ Ingreso
				</button>
				<button
					onClick={() => setMovementModal('cash_out')}
					className='flex-1 py-2.5 bg-[#1a0f0f] hover:bg-[#2a1414] border border-red-900 text-red-500 text-[12px] font-semibold rounded-lg transition-colors'
				>
					- Egreso
				</button>
			</div>

			{/* Últimos movimientos */}
			<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
				<div className='px-4 py-3 border-b border-[#1e1e1e] bg-[#161616] flex items-center justify-between'>
					<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
						Últimos movimientos
					</p>
					<button
						onClick={() => navigate('/cash/movements')}
						className='p-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#252525] hover:border-[#444] text-[12px] font-mono text-[#666] hover:text-white rounded-lg transition-colors'
					>
						Ver todos →
					</button>
				</div>

				<div className='divide-y divide-[#1a1a1a]'>
					{loadingMovements ? (
						<MovementsSkeleton />
					) : recentMovements.length === 0 ? (
						<div className='flex items-center justify-center py-8'>
							<p className='text-[13px] font-mono text-[#444]'>
								Sin movimientos
							</p>
						</div>
					) : (
						recentMovements.map((m) => <MovementRow key={m._id} movement={m} />)
					)}
				</div>
			</div>

			{/* Link a arqueo */}
			<button
				onClick={() => navigate('/cash/cash-count')}
				className='w-full py-3 bg-[#161616] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#444] text-[13px] font-mono text-[#888] hover:text-white rounded-lg transition-colors'
			>
				Ir al arqueo de caja →
			</button>

			{/* Modal */}
			{movementModal && (
				<CashMovementModal
					type={movementModal}
					onClose={() => setMovementModal(null)}
				/>
			)}
		</div>
	);
};
