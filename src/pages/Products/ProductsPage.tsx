import { useState } from 'react';
import type { IProduct } from '../../types/product.type';
import {
	useDeleteProduct,
	useGetProducts,
} from '../../queries/products.queries';
import { useGetCategories } from '../../queries/categories.queries';
import { ProductsMetrics } from '../../components/products/ProductsMetrics';
import { ProductsTable } from '../../components/products/ProductsTable';
import { ProductFormModal } from '../../components/products/ProductFormModal';
import { DeleteConfirmModal } from '../../components/products/DeleteConfirmModal';

const STOCK_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'low', label: 'Stock bajo' },
	{ value: 'out', label: 'Sin stock' },
];

const ProductsPage = () => {
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
	const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

	const { data, isLoading, isError } = useGetProducts();
	const products = data?.data ?? [];
	const { data: categories = [] } = useGetCategories();
	const deleteProduct = useDeleteProduct();

	const filtered = products.filter((p) => {
		const matchSearch =
			!search ||
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.sku.toLowerCase().includes(search.toLowerCase());

		const matchCategory = !categoryFilter || p.category === categoryFilter;

		const matchStock =
			stockFilter === 'all' ||
			(stockFilter === 'low' && p.stock > 0 && p.stock <= 5) ||
			(stockFilter === 'out' && p.stock === 0);

		return matchSearch && matchCategory && matchStock;
	});

	const handleEdit = (product: IProduct) => {
		setEditingProduct(product);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingProduct(null);
	};

	const handleDeleteConfirm = () => {
		if (!deletingProduct) return;
		deleteProduct.mutate(deletingProduct._id, {
			onSuccess: () => setDeletingProduct(null),
		});
	};

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Productos</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Gestioná el catálogo de productos
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold rounded-lg transition-colors'
				>
					<span className='text-base leading-none'>+</span>
					Nuevo producto
				</button>
			</div>

			{/* Métricas */}
			<ProductsMetrics products={products} />

			{/* Toolbar */}
			<div className='flex gap-2'>
				{/* Búsqueda */}
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
						placeholder='Buscar por nombre o SKU...'
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

				{/* Filtro categoría */}
				<select
					value={categoryFilter}
					onChange={(e) => setCategoryFilter(e.target.value)}
					className='bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2 text-[13px] text-[#aaa] outline-none focus:border-[#333] transition-colors'
				>
					<option value=''>Todas las categorías</option>
					{categories.map((c) => (
						<option key={c._id} value={c.name}>
							{c.name}
						</option>
					))}
				</select>

				{/* Filtro stock */}
				<div className='flex bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
					{STOCK_FILTERS.map((f) => (
						<button
							key={f.value}
							onClick={() => setStockFilter(f.value as typeof stockFilter)}
							className={`px-3 py-2 text-[12px] font-mono transition-colors ${
								stockFilter === f.value
									? 'bg-[#1a1a1a] text-[#ccc]'
									: 'text-[#555] hover:text-[#888]'
							}`}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			{/* Tabla */}
			<ProductsTable
				products={filtered}
				isLoading={isLoading}
				isError={isError}
				onEdit={handleEdit}
				onDelete={setDeletingProduct}
			/>

			{/* Contador */}
			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{filtered.length} de {products.length} productos
				</p>
			)}

			{/* Modal form */}
			{showForm && (
				<ProductFormModal
					product={editingProduct}
					categories={categories}
					onClose={handleCloseForm}
				/>
			)}

			{/* Modal eliminar */}
			{deletingProduct && (
				<DeleteConfirmModal
					title='Eliminar producto'
					description={`¿Seguro que querés eliminar "${deletingProduct.name}"? Esta acción no se puede deshacer.`}
					isLoading={deleteProduct.isPending}
					onConfirm={handleDeleteConfirm}
					onClose={() => setDeletingProduct(null)}
				/>
			)}
		</div>
	);
};

export default ProductsPage;
