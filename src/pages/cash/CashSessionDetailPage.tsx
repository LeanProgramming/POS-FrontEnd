import { useParams, useNavigate } from 'react-router-dom';
import { useCashSessionDetail } from '../../queries/cash.queries';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { MovementRow } from '../../components/admin/cash/MovementRow';
import { MovementsSkeleton } from '../../components/admin/cash/MovementsSkeleton';

const CashSessionDetailPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();
	const { data, isLoading } = useCashSessionDetail(sessionId ?? null);

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6'>
				<h1 className='text-xl font-semibold text-white'>Detalle de sesión</h1>
				<MovementsSkeleton />
			</div>
		);
	}

	if (!data) {
		return (
			<div className='flex flex-col gap-6'>
				<h1 className='text-xl font-semibold text-white'>Detalle de sesión</h1>
				<p className='text-[13px] font-mono text-[#444]'>
					Sesión no encontrada
				</p>
			</div>
		);
	}

	const { session, movements } = data;
	const summary = {
		sales: movements
			.filter((m) => m.type === 'sale')
			.reduce((a, m) => a + m.amount, 0),
		refunds: movements
			.filter((m) => m.type === 'refund')
			.reduce((a, m) => a + Math.abs(m.amount), 0),
		cashIn: movements
			.filter((m) => m.type === 'cash_in')
			.reduce((a, m) => a + m.amount, 0),
		cashOut: movements
			.filter((m) => m.type === 'cash_out')
			.reduce((a, m) => a + m.amount, 0),
	};

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<h1 className='text-xl font-semibold text-white'>Detalle de sesión</h1>
				<p className='text-[13px] text-[#555] mt-0.5'>
					{formatDate(session.opened_at)}
					{session.closed_at && ` — ${formatDate(session.closed_at)}`}
				</p>
			</div>

			<div className='flex items-center gap-2'>
				<span
					className={`w-2 h-2 rounded-full ${session.is_open ? 'bg-green-500' : 'bg-red-500'}`}
				/>
				<span
					className={`text-[12px] font-mono ${session.is_open ? 'text-green-500' : 'text-red-500'}`}
				>
					{session.is_open ? 'Abierta' : 'Cerrada'}
				</span>
			</div>

			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Apertura</p>
					<p className='text-[14px] font-mono font-semibold text-white'>
						{formatPrice(session.opening_balance)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Ventas</p>
					<p className='text-[14px] font-mono font-semibold text-green-500'>
						+{formatPrice(summary.sales)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Ingresos</p>
					<p className='text-[14px] font-mono font-semibold text-green-500'>
						+{formatPrice(summary.cashIn)}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Egresos</p>
					<p className='text-[14px] font-mono font-semibold text-red-500'>
						-{formatPrice(summary.cashOut)}
					</p>
				</div>
			</div>

			<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
				<div className='px-4 py-3 border-b border-[#1e1e1e] bg-[#161616]'>
					<p className='text-[12px] font-mono text-[#555] uppercase tracking-widest'>
						Movimientos
					</p>
				</div>
				<div className='divide-y divide-[#1a1a1a]'>
					{movements.length === 0 ? (
						<div className='flex items-center justify-center py-8'>
							<p className='text-[13px] font-mono text-[#444]'>
								Sin movimientos
							</p>
						</div>
					) : (
						movements.map((m) => <MovementRow key={m._id} movement={m} />)
					)}
				</div>
			</div>

			<button
				onClick={() => navigate('/cash/history')}
				className='text-[12px] font-mono text-[#555] hover:text-white transition-colors'
			>
				← Volver al historial
			</button>
		</div>
	);
};

export default CashSessionDetailPage;
