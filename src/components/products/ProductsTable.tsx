import type { IProduct } from '../../types/product.type';
import { ProductRow } from './ProductRow';
import { TableEmpty } from './TableEmpty';
import { TableError } from './TableError';
import { TableSkeleton } from './TableSkeleton';

interface IProductsTableProps {
	products: IProduct[];
	isLoading: boolean;
	isError: boolean;
	onEdit: (product: IProduct) => void;
	onDelete: (product: IProduct) => void;
}

export const ProductsTable = ({
	products,
	isError,
	isLoading,
	onDelete,
	onEdit,
}: IProductsTableProps) => {
	if (isLoading) return <TableSkeleton />;
	if (isError) return <TableError />;
	if (products.length === 0) return <TableEmpty />;

	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			{/* Header */}
			<div className='grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-3 px-4 py-3 bg-[#161616] border-b border-[#222]'>
				{['Producto', 'Categoría', 'Precio', 'Stock', ''].map((col) => (
					<span
						key={col}
						className='text-[11px] font-mono text-[#555] uppercase tracking-wider'
					>
						{col}
					</span>
				))}
			</div>

			{/* Rows */}
			<div className='divide-y divide-[#1a1a1a]'>
				{products.map((product) => (
					<ProductRow
						key={product._id}
						product={product}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
};
