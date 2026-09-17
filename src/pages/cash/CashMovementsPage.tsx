import { useState } from 'react';
import { useCashMovements } from '../../queries/cash.queries';
import { formatPrice } from '../../utils/formatPrice';
import { MovementsSkeleton } from '../../components/admin/cash/MovementsSkeleton';
import { MovementRow } from '../../components/admin/cash/MovementRow';
import { useNavigate } from 'react-router-dom';

type FilterType = 'all' | 'sale' | 'refund' | 'cash_in' | 'cash_out';

const FILTERS: { value: FilterType; label: string }[] = [
	{ value: 'all', label: 'Todos' },
	{ value: 'sale', label: 'Ventas' },
	{ value: 'refund', label: 'Devoluciones' },
	{ value: 'cash_in', label: 'Ingresos' },
	{ value: 'cash_out', label: 'Egresos' },
];

export const CashMovementsPage = () => {
	const navigate = useNavigate();
	const { data: movements = [], isLoading } = useCashMovements();
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');

	const filteredMovements =
		activeFilter === 'all'
			? movements
			: movements.filter((m) => m.type === activeFilter);

	// Resumen
	const summary = {
		sales: movements
			.filter((m) => m.type === 'sale')
			.reduce((acc, m) => acc + m.amount, 0),
		salesCount: movements.filter((m) => m.type === 'sale').length,
		refunds: movements
			.filter((m) => m.type === 'refund')
			.reduce((acc, m) => acc + Math.abs(m.amount), 0),
		refundsCount: movements.filter((m) => m.type === 'refund').length,
		cashIn: movements
			.filter((m) => m.type === 'cash_in')
			.reduce((acc, m) => acc + m.amount, 0),
		cashInCount: movements.filter((m) => m.type === 'cash_in').length,
		cashOut: movements
			.filter((m) => m.type === 'cash_out')
			.reduce((acc, m) => acc + m.amount, 0),
		cashOutCount: movements.filter((m) => m.type === 'cash_out').length,
	};

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div>
				<h1 className='text-xl font-semibold text-white'>Movimientos</h1>
				<p className='text-[13px] text-[#555] mt-0.5'>
					Historial de movimientos de la sesión actual
				</p>
			</div>

			{/* Resumen */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Ventas</p>
					<p className='text-[14px] font-mono font-semibold text-green-500'>
						+{formatPrice(summary.sales)}
					</p>
					<p className='text-[10px] font-mono text-[#444]'>
						{summary.salesCount} ventas
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Devoluciones</p>
					<p className='text-[14px] font-mono font-semibold text-red-500'>
						-{formatPrice(summary.refunds)}
					</p>
					<p className='text-[10px] font-mono text-[#444]'>
						{summary.refundsCount} devoluciones
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Ingresos</p>
					<p className='text-[14px] font-mono font-semibold text-green-500'>
						+{formatPrice(summary.cashIn)}
					</p>
					<p className='text-[10px] font-mono text-[#444]'>
						{summary.cashInCount} ingresos
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Egresos</p>
					<p className='text-[14px] font-mono font-semibold text-red-500'>
						-{formatPrice(summary.cashOut)}
					</p>
					<p className='text-[10px] font-mono text-[#444]'>
						{summary.cashOutCount} egresos
					</p>
				</div>
			</div>

			{/* Filtros */}
			<div className='flex gap-2 flex-wrap'>
				{FILTERS.map((filter) => (
					<button
						key={filter.value}
						onClick={() => setActiveFilter(filter.value)}
						className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors ${activeFilter === filter.value ? 'bg-[#1a1a1a border-[#444] text-white' : 'bg-[#111] border-[#252525] text-[#666] hover:text-[#888]'}`}
					>
						{filter.label}
					</button>
				))}
			</div>

			{/* Lista */}
			<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
				<div className='divide-y divide-[#1a1a1a]'>
					{isLoading ? (
						<MovementsSkeleton />
					) : filteredMovements.length === 0 ? (
						<div className='flex items-center justify-center py-12'>
							<p className='text-[13px] font-mono text-[#444]'>
								Sin movimientos para este filtro
							</p>
						</div>
					) : (
						filteredMovements.map((m) => (
							<MovementRow key={m._id} movement={m} />
						))
					)}
				</div>
			</div>

			{/* Botón volver */}
			<button
				onClick={() => navigate('/cash')}
				className='text-[12px] font-mono text-[#555] hover:text-white transition-colors'
			>
				← Volver a estado de caja
			</button>
		</div>
	);
};

export default CashMovementsPage;
