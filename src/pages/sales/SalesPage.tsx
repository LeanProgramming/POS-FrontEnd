import { useState } from 'react';
import { useGetSales } from '../../queries/sales.queries';
import { formatDateShort } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { TableSkeleton } from '../../components/admin/sales/TableSkeleton';
import { TableError } from '../../components/admin/sales/TableError';
import { TableEmpty } from '../../components/admin/sales/TableEmpty';
import { SalesTable } from '../../components/admin/sales/SalesTable';

const SalesPage = () => {
	const [search, setSearch] = useState('');
	const [dateFilter, setDateFilter] = useState('');
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const { data: sales = [], isLoading, isError } = useGetSales();

	// ─── Filtros ──────────────────────────────────────────────────────────────

	const filtered = sales.filter((s) => {
		const matchSearch =
			!search || s._id.toLowerCase().includes(search.toLowerCase());

		const matchDate =
			!dateFilter ||
			formatDateShort(s.created_at) === formatDateShort(dateFilter);

		return matchSearch && matchDate;
	});

	// ─── Métricas del día ─────────────────────────────────────────────────────

	const today = new Date().toLocaleDateString('es-AR');
	const todaySales = sales.filter(
		(s) => new Date(s.created_at).toLocaleDateString('es-AR') === today,
	);
	const totalToday = todaySales.reduce((acc, s) => acc + s.total, 0);

	const toggleExpand = (id: string) =>
		setExpandedId((prev) => (prev === id ? null : id));

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div>
				<h1 className='text-xl font-semibold text-white'>Ventas</h1>
				<p className='text-[13px] text-[#555] mt-0.5'>
					Historial de ventas del sistema
				</p>
			</div>

			{/* Métricas */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
				{[
					{
						label: 'Total ventas',
						value: sales.length,
						display: String(sales.length),
						accent: 'text-white',
					},
					{
						label: 'Ventas hoy',
						value: todaySales.length,
						display: String(todaySales.length),
						accent: 'text-green-500',
					},
					{
						label: 'Facturado hoy',
						value: totalToday,
						display: formatPrice(totalToday),
						accent: 'text-green-400',
					},
					{
						label: 'Ticket promedio',
						value: 0,
						display: todaySales.length
							? formatPrice(totalToday / todaySales.length)
							: '—',
						accent: 'text-[#aaa]',
					},
				].map((m) => (
					<div
						key={m.label}
						className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'
					>
						<p className='text-[12px] font-mono text-[#555] mb-1'>{m.label}</p>
						<p className={`text-[18px] font-mono font-semibold ${m.accent}`}>
							{m.display}
						</p>
					</div>
				))}
			</div>

			{/* Toolbar */}
			<div className='flex gap-2'>
				<div className='flex items-center gap-2 flex-1 bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2'>
					<svg
						className='w-4 h-4 text-[#555] shrink-0'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'
						/>
					</svg>
					<input
						type='text'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Buscar por ID de venta...'
						className='flex-1 bg-transparent text-sm text-[#e5e5e5] placeholder-[#444] outline-none'
					/>
					{search && (
						<button
							onClick={() => setSearch('')}
							className='text-[11px] font-mono text-[#555] hover:text-[#aaa]'
						>
							limpiar
						</button>
					)}
				</div>

				{/* Filtro fecha */}
				<input
					type='date'
					value={dateFilter}
					onChange={(e) => setDateFilter(e.target.value)}
					className='bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-[13px] text-[#aaa] outline-none focus:border-[#333] transition-colors'
				/>
				{dateFilter && (
					<button
						onClick={() => setDateFilter('')}
						className='px-3 py-2 bg-[#111] border border-[#1e1e1e] rounded-lg text-[12px] font-mono text-[#555] hover:text-[#aaa] transition-colors'
					>
						limpiar fecha
					</button>
				)}
			</div>

			{/* Tabla */}
			{isLoading ? (
				<TableSkeleton />
			) : isError ? (
				<TableError />
			) : filtered.length === 0 ? (
				<TableEmpty hasFilters={!!search || !!dateFilter} />
			) : (
				<SalesTable
					sales={filtered}
					expandedId={expandedId}
					onToggle={toggleExpand}
				/>
			)}

			{/* Contador */}
			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{filtered.length} de {sales.length} ventas
				</p>
			)}
		</div>
	);
};

export default SalesPage;
