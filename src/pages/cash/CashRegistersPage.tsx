import { useState } from 'react';
import type { ICashRegister } from '../../types/cash.type';
import {
	useGetCashRegisters,
	useToggleCashRegisterState,
} from '../../queries/cash.queries';
import { SkeletonGrid } from '../../components/admin/categories/SkeletonGrid';
import { CashRegisterCard } from '../../components/admin/cash/CashRegisterCard';
import { CashRegisterFormModal } from '../../components/admin/cash/CashRegisterFormModal';
import { DeleteConfirmModal } from '../../components/admin/products/DeleteConfirmModal';

const CashRegistersPage = () => {
	const [search, setSearch] = useState('');
	const [editingRegister, setEditingRegister] = useState<ICashRegister | null>(
		null,
	);
	const [showForm, setShowForm] = useState(false);
	const [deletingRegister, setDeletingRegister] =
		useState<ICashRegister | null>(null);

	const {
		data: cashRegisters = [],
		isLoading,
		isError,
	} = useGetCashRegisters();
	const deleteCategory = useToggleCashRegisterState();

	const filtered = cashRegisters.filter(
		(c) => !search || c.name.toLowerCase().includes(search.toLowerCase()),
	);

	const handleEdit = (cashRegister: ICashRegister) => {
		setEditingRegister(cashRegister);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingRegister(null);
	};

	const handleDeleteConfirm = () => {
		if (!deletingRegister) return;
		deleteCategory.mutate(
			{ active: !deletingRegister.active },
			{
				onSuccess: () => setDeletingRegister(null),
			},
		);
	};
	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>
						Cajas Registradas
					</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Organizá los cajas físicas disponibles
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold rounded-lg transition-colors'
				>
					<span className='text-base leading-none'>+</span>
					Nueva caja
				</button>
			</div>

			{/* Métricas */}
			<div className='grid grid-cols-2 gap-3 max-w-xs'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Total</p>
					<p className='text-2xl font-mono font-semibold text-white'>
						{cashRegisters.length}
					</p>
				</div>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Filtradas</p>
					<p className='text-2xl font-mono font-semibold text-green-500'>
						{filtered.length}
					</p>
				</div>
			</div>

			{/* Búsqueda */}
			<div className='flex items-center gap-2 bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 max-w-sm'>
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
					placeholder='Buscar por nombre...'
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

			{/* Grid de cards */}
			{isLoading ? (
				<SkeletonGrid />
			) : isError ? (
				<ErrorState />
			) : filtered.length === 0 ? (
				<EmptyState hasSearch={!!search} />
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
					{filtered.map((cashRegister) => (
						<CashRegisterCard
							key={cashRegister._id}
							cashRegister={cashRegister}
							onEdit={handleEdit}
							onDelete={setDeletingRegister}
						/>
					))}
				</div>
			)}

			{/* Contador */}
			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{filtered.length} de {cashRegisters.length} cajas registradoras.
				</p>
			)}

			{/* Modal form */}
			{showForm && (
				<CashRegisterFormModal
					cashRegister={editingRegister}
					onClose={handleCloseForm}
				/>
			)}

			{/* Modal eliminar */}
			{deletingRegister && (
				<DeleteConfirmModal
					title='Eliminar caja registradora'
					description={`¿Seguro que querés eliminar la caja "${deletingRegister?.name}"?`}
					isLoading={deleteCategory.isPending}
					onConfirm={handleDeleteConfirm}
					onClose={() => setDeletingRegister(null)}
				/>
			)}
		</div>
	);
};

const ErrorState = () => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg py-16 flex items-center justify-center'>
			<p className='text-[13px] font-mono text-red-600'>
				Error al cargar las cajas registradoras
			</p>
		</div>
	);
};

const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg py-16 flex flex-col items-center gap-2'>
			<p className='text-[13px] font-mono text-[#444]'>
				{hasSearch ? 'Sin resultados' : 'No hay cajas registradoras'}
			</p>
			{!hasSearch && (
				<p className='text-[12px] text-[#333]'>
					Creá la primera caja registradora con el botón de arriba
				</p>
			)}
		</div>
	);
};

export default CashRegistersPage;
