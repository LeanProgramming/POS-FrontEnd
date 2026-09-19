import { useState } from 'react';
import { useCashSessions } from '../../queries/cash.queries';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { MovementsSkeleton } from '../../components/admin/cash/MovementsSkeleton';
import { useNavigate } from 'react-router-dom';

const CashHistoryPage = () => {
	const navigate = useNavigate();
	const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>(
		undefined,
	);

	const { data, isLoading } = useCashSessions({
		is_open: isOpenFilter,
		limit: 50,
	});

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div>
				<h1 className='text-xl font-semibold text-white'>
					Historial de sesiones
				</h1>
				<p className='text-[13px] text-[#555] mt-0.5'>
					Sesiones de caja anteriores
				</p>
			</div>

			{/* Filtros */}
			<div className='flex gap-2'>
				<button
					onClick={() => setIsOpenFilter(undefined)}
					className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors ${
						isOpenFilter === undefined
							? 'bg-[#1a1a1a] border-[#444] text-white'
							: 'bg-[#111] border-[#252525] text-[#666] hover:text-[#888]'
					}`}
				>
					Todas
				</button>
				<button
					onClick={() => setIsOpenFilter(true)}
					className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors ${
						isOpenFilter === true
							? 'bg-[#0f1f12] border-green-900 text-green-500'
							: 'bg-[#111] border-[#252525] text-[#666] hover:text-[#888]'
					}`}
				>
					Abiertas
				</button>
				<button
					onClick={() => setIsOpenFilter(false)}
					className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors ${
						isOpenFilter === false
							? 'bg-[#1a0f0f] border-red-900 text-red-500'
							: 'bg-[#111] border-[#252525] text-[#666] hover:text-[#888]'
					}`}
				>
					Cerradas
				</button>
			</div>

			{/* Lista */}
			<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
				<div className='divide-y divide-[#1a1a1a]'>
					{isLoading ? (
						<MovementsSkeleton />
					) : !data?.sessions.length ? (
						<div className='flex items-center justify-center py-12'>
							<p className='text-[13px] font-mono text-[#444]'>
								No hay sesiones para este filtro
							</p>
						</div>
					) : (
						data.sessions.map((session) => (
							<div
								key={session._id}
								className='flex items-center justify-between px-4 py-3  transition-colors'
							>
								<div className='flex flex-col gap-0.5'>
									<div className='flex items-center gap-2'>
										<span
											className={`w-2 h-2 rounded-full ${
												session.is_open ? 'bg-green-500' : 'bg-red-500'
											}`}
										/>
										<p className='text-[13px] text-[#ccc]'>
											{session.is_open ? 'Abierta' : 'Cerrada'}
										</p>
									</div>
									<p className='text-[11px] font-mono text-[#444]'>
										Apertura: {formatDate(session.opened_at)}
										{session.closed_at &&
											` | Cierre: ${formatDate(session.closed_at)}`}
									</p>
								</div>
								<div className='flex items-center gap-3'>
									<div className='text-right'>
										<p className='text-[13px] font-mono text-white'>
											{formatPrice(session.opening_balance)}
										</p>
										{session.closing_balance !== null && (
											<p className='text-[11px] font-mono text-[#555]'>
												Cierre: {formatPrice(session.closing_balance)}
											</p>
										)}
									</div>

									<button
										className='px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors bg-[#252525] border-[#111] text-[#666] hover:text-[#888]'
										onClick={() => navigate(`/cash/history/${session._id}`)}
									>
										Ver detalle
									</button>
								</div>
							</div>
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

export default CashHistoryPage;
