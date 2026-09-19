import { useNavigate } from 'react-router-dom';
import { useDailySummary, useGetCashStatus } from '../../queries/cash.queries';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { MovementsSkeleton } from '../../components/admin/cash/MovementsSkeleton';
import { useState } from 'react';
import { exportDailySummaryCsv } from '../../services/cash.service';
import { generateCashCountPdf } from '../../utils/generateCashCountPdf';

const CashDailySummaryPage = () => {
	const navigate = useNavigate();
	const { data: cashStatus } = useGetCashStatus();
	const sessionId = cashStatus?.session?._id ?? null;
	const { data: summary, isLoading } = useDailySummary(sessionId);
	const [exporting, setExporting] = useState(false);

	const handleExportCsv = async () => {
		if (!summary) return;
		setExporting(true);
		try {
			await exportDailySummaryCsv(summary.session_id);
		} finally {
			setExporting(false);
		}
	};

	const handleExportPdf = () => {
		if (!summary) return;
		generateCashCountPdf(summary);
	};

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Corte Z</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>Resumen del día</p>
				</div>
				<MovementsSkeleton />
			</div>
		);
	}

	if (!summary) {
		return (
			<div className='flex flex-col gap-6'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Corte Z</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>Resumen del día</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-8 text-center'>
					<p className='text-[13px] font-mono text-[#444]'>
						No hay datos disponibles para esta sesión
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Corte Z</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>Resumen del día</p>
				</div>
				<div className='flex flex-col items-center gap-2'>
					<p className='text-[13px] text-white mt-0.5'>Exportar</p>
					<div className='flex items-center gap-2 ml-auto'>
						<button
							onClick={handleExportCsv}
							disabled={exporting}
							className='px-3 py-1.5 bg-[#161616] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#444] text-[12px] font-mono text-[#666] hover:text-white rounded transition-colors disabled:opacity-50'
						>
							{exporting ? 'Exportando...' : 'CSV'}
						</button>
						<button
							onClick={handleExportPdf}
							className='px-3 py-1.5 bg-[#161616] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#444] text-[12px] font-mono text-[#666] hover:text-white rounded transition-colors'
						>
							PDF
						</button>
					</div>
				</div>
			</div>

			{/* Info general */}
			<div className='grid grid-cols-2 gap-3'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Caja</p>
					<p className='text-[14px] font-mono font-semibold text-white'>
						{summary.register_name}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Cajero</p>
					<p className='text-[14px] font-mono font-semibold text-white'>
						{summary.cashier_name}
					</p>
				</div>
			</div>

			{/* Totales */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Ventas</p>
					<p className='text-[14px] font-mono font-semibold text-green-500'>
						{formatPrice(summary.total_sales)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Devoluciones</p>
					<p className='text-[14px] font-mono font-semibold text-red-500'>
						-{formatPrice(summary.total_refunds)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Neto</p>
					<p className='text-[14px] font-mono font-semibold text-white'>
						{formatPrice(summary.net_sales)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>
						Saldo teórico
					</p>
					<p className='text-[14px] font-mono font-semibold text-white'>
						{formatPrice(summary.expected_cash_balance)}
					</p>
				</div>
			</div>

			{/* Métodos de pago */}
			<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
				<div className='px-4 py-3 border-b border-[#1e1e1e] bg-[#161616]'>
					<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
						Desglose por método de pago
					</p>
				</div>
				<div className='divide-y divide-[#1a1a1a]'>
					{summary.payment_methods.map((pm) => (
						<div
							key={pm.method}
							className='flex items-center justify-between px-4 py-3'
						>
							<div className='flex flex-col gap-0.5'>
								<p className='text-[13px] text-[#ccc]'>{pm.label}</p>
								<p className='text-[11px] font-mono text-[#444]'>
									{pm.count} operaciones
								</p>
							</div>
							<span className='text-[13px] font-mono font-semibold text-white'>
								{formatPrice(pm.total)}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Diferencias (si hay cierre) */}
			{summary.cash_difference !== null && (
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4 space-y-3'>
					<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
						Diferencias
					</p>
					<div className='flex justify-between items-center'>
						<span className='text-[13px] font-mono text-[#555]'>Efectivo</span>
						<span
							className={`text-[14px] font-mono font-semibold ${
								summary.cash_difference === 0
									? 'text-green-500'
									: summary.cash_difference > 0
										? 'text-yellow-500'
										: 'text-red-500'
							}`}
						>
							{summary.cash_difference > 0 ? '+' : ''}
							{formatPrice(summary.cash_difference)}
							{summary.cash_difference !== 0 && (
								<span className='text-[10px] ml-1'>
									{summary.cash_difference > 0 ? 'Sobrante' : 'Faltante'}
								</span>
							)}
						</span>
					</div>
					{summary.transfer_difference !== null && (
						<div className='flex justify-between items-center'>
							<span className='text-[13px] font-mono text-[#555]'>
								Transferencia
							</span>
							<span
								className={`text-[14px] font-mono font-semibold ${
									summary.transfer_difference === 0
										? 'text-green-500'
										: summary.transfer_difference > 0
											? 'text-yellow-500'
											: 'text-red-500'
								}`}
							>
								{summary.transfer_difference > 0 ? '+' : ''}
								{formatPrice(summary.transfer_difference)}
							</span>
						</div>
					)}
				</div>
			)}

			{/* Horarios */}
			<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4 space-y-2 text-[12px] font-mono'>
				<div className='flex justify-between'>
					<span className='text-[#555]'>Apertura</span>
					<span className='text-[#888]'>{formatDate(summary.opened_at)}</span>
				</div>
				{summary.closed_at && (
					<div className='flex justify-between'>
						<span className='text-[#555]'>Cierre</span>
						<span className='text-[#888]'>{formatDate(summary.closed_at)}</span>
					</div>
				)}
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

export default CashDailySummaryPage;
