import { useState } from 'react';
import { useGetRefunds } from '../../queries/refunds.queries';
import { useGetSales } from '../../queries/sales.queries';
import { RefundFormModal } from '../../components/admin/refunds/RefundFormModal';
import { RefundRow } from '../../components/admin/refunds/RefundRow';
import { TableSkeleton } from '../../components/admin/refunds/TableSkeleton';
import { TableError } from '../../components/admin/refunds/TableError';
import { TableEmpty } from '../../components/admin/refunds/TableEmpty';

const RefundsPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const { data: refunds = [], isLoading, isError } = useGetRefunds();
	const { data: sales = [] } = useGetSales();

	const toggleExpand = (id: string) =>
		setExpandedId((prev) => (prev === id ? null : id));

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Devoluciones</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Historial de devoluciones y reintegros
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] hover:bg-[#1e1e38] border border-blue-900 text-blue-400 text-[13px] font-semibold rounded-lg transition-colors'
				>
					<span className='text-base leading-none'>+</span>
					Nueva devolución
				</button>
			</div>

			{/* Métricas */}
			<div className='grid grid-cols-2 gap-3 max-w-xs'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Total</p>
					<p className='text-2xl font-mono font-semibold text-white'>
						{refunds.length}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Hoy</p>
					<p className='text-2xl font-mono font-semibold text-blue-400'>
						{
							refunds.filter(
								(r) =>
									new Date(r.created_at).toLocaleDateString('es-AR') ===
									new Date().toLocaleDateString('es-AR'),
							).length
						}
					</p>
				</div>
			</div>

			{/* Tabla */}
			{isLoading ? (
				<TableSkeleton />
			) : isError ? (
				<TableError />
			) : refunds.length === 0 ? (
				<TableEmpty />
			) : (
				<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
					<div className='grid grid-cols-[1fr_1fr_140px_32px] gap-3 px-4 py-3 bg-[#161616] border-b border-[#222]'>
						{['ID devolución', 'Venta original', 'Motivo', ''].map((col) => (
							<span
								key={col}
								className='text-[11px] font-mono text-[#555] uppercase tracking-wider'
							>
								{col}
							</span>
						))}
					</div>
					<div className='divide-y divide-[#1a1a1a]'>
						{refunds.map((refund) => (
							<RefundRow
								key={refund._id}
								refund={refund}
								isExpanded={expandedId === refund._id}
								onToggle={() => toggleExpand(refund._id)}
							/>
						))}
					</div>
				</div>
			)}

			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{refunds.length}{' '}
					{refunds.length === 1 ? 'devolución' : 'devoluciones'}
				</p>
			)}

			{/* Modal */}
			{showForm && (
				<RefundFormModal sales={sales} onClose={() => setShowForm(false)} />
			)}
		</div>
	);
};

export default RefundsPage;
