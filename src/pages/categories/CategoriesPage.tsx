import { useState } from 'react';
import type { ICategory } from '../../types/categories.type';
import {
	useDeleteCategory,
	useGetCategories,
} from '../../queries/categories.queries';
import { SkeletonGrid } from '../../components/categories/SkeletonGrid';
import { ErrorState } from '../../components/categories/ErrorState';
import { EmptyState } from '../../components/categories/EmptyState';
import { CategoryCard } from '../../components/categories/CategoryCard';
import { CategoryFormModal } from '../../components/categories/CategoryFormModal';
import { DeleteConfirmModal } from '../../components/products/DeleteConfirmModal';

const CategoriesPage = () => {
	const [search, setSearch] = useState('');
	const [editingCategory, setEditingCategory] = useState<ICategory | null>(
		null,
	);
	const [showForm, setShowForm] = useState(false);
	const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(
		null,
	);

	const { data: categories = [], isLoading, isError } = useGetCategories();
	const deleteCategory = useDeleteCategory();

	const filtered = categories.filter(
		(c) =>
			!search ||
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.prefix.toLowerCase().includes(search.toLowerCase()),
	);

	const handleEdit = (category: ICategory) => {
		setEditingCategory(category);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingCategory(null);
	};

	const handleDeleteConfirm = () => {
		if (!deletingCategory) return;
		deleteCategory.mutate(deletingCategory._id, {
			onSuccess: () => setDeletingCategory(null),
		});
	};
	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Categorías</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Organizá los productos por categoría
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold rounded-lg transition-colors'
				>
					<span className='text-base leading-none'>+</span>
					Nueva categoría
				</button>
			</div>

			{/* Métricas */}
			<div className='grid grid-cols-2 gap-3 max-w-xs'>
				<div className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'>
					<p className='text-[12px] font-mono text-[#555] mb-1'>Total</p>
					<p className='text-2xl font-mono font-semibold text-white'>
						{categories.length}
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
					placeholder='Buscar por nombre o prefijo...'
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
					{filtered.map((category) => (
						<CategoryCard
							key={category._id}
							category={category}
							onEdit={handleEdit}
							onDelete={setDeletingCategory}
						/>
					))}
				</div>
			)}

			{/* Contador */}
			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{filtered.length} de {categories.length} categorías
				</p>
			)}

			{/* Modal form */}
			{showForm && (
				<CategoryFormModal
					category={editingCategory}
					onClose={handleCloseForm}
				/>
			)}

			{/* Modal eliminar */}
			{deletingCategory && (
				<DeleteConfirmModal
					title='Eliminar categoría'
					description={`¿Seguro que querés eliminar "${deletingCategory.name}"? Los productos asociados quedarán sin categoría.`}
					isLoading={deleteCategory.isPending}
					onConfirm={handleDeleteConfirm}
					onClose={() => setDeletingCategory(null)}
				/>
			)}
		</div>
	);
};

export default CategoriesPage;
