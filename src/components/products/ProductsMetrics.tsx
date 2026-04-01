import type { IProduct } from '../../types/product.type';

interface IProductsMetricsProps {
	products: IProduct[];
}

export const ProductsMetrics = ({ products }: IProductsMetricsProps) => {
	const total = products.length;
	const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
	const outOfStock = products.filter((p) => p.stock === 0).length;
	const categories = new Set(products.map((p) => p.category)).size;

	const metrics = [
		{ label: 'Total productos', value: total, accent: 'text-white' },
		{ label: 'Stock bajo', value: lowStock, accent: 'text-amber-500' },
		{ label: 'Sin stock', value: outOfStock, accent: 'text-red-500' },
		{ label: 'Categorías', value: categories, accent: 'text-green-500' },
	];

	return (
		<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
			{metrics.map((m) => (
				<div
					key={m.label}
					className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'
				>
					<p className='text-[12px] font-mono text-[#555] mb-1'>{m.label}</p>
					<p className={`text-2xl font-mono font-semibold ${m.accent}`}>
						{m.value}
					</p>
				</div>
			))}
		</div>
	);
};
