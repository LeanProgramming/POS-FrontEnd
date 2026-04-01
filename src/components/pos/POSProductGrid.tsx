import { useEffect, useState } from 'react';
import { usePOSStore } from '../../store/usePOSStore';
import { POSSearch } from './POSSearch';
import { SkeletonGrid } from './SkeletonGrid';
import { EmptyState } from './EmptyState';
import { ProductCard } from './ProductCard';
import {
	useGetProducts,
	useProductSearch,
} from '../../queries/products.queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { IProduct, IProductResponse } from '../../types/product.type';

export const POSProductGrid = () => {
	const [query, setQuery] = useState('');
	const { addItem } = usePOSStore();
	const debounceQuery = useDebounce(query, 300);

	const isSearching = debounceQuery.trim().length > 0;
	const allProducts = useGetProducts();
	const searchResults = useProductSearch(debounceQuery);

	const [products, setProducts] = useState<IProduct[]>([]);

	const { data, isLoading, isError } = isSearching
		? searchResults
		: allProducts;

	useEffect(() => {
		if (isSearching) {
			setProducts((data as IProduct[]) ?? []);
		} else {
			setProducts((data as IProductResponse)?.data ?? []);
		}
	}, [data]);

	return (
		<div className='flex flex-col flex-1 bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			<div className='p-2 border-b border-[#1e1e1e] shrink-0'>
				<POSSearch query={query} setQuery={setQuery} />
			</div>

			<div className='flex-1 overflow-y-auto p-2'>
				{isLoading ? (
					<SkeletonGrid />
				) : isError ? (
					<ErrorState />
				) : products.length === 0 ? (
					<EmptyState />
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
						{products.map((product) => (
							<ProductCard
								key={product._id}
								product={product}
								onAdd={() => {
									addItem(product);
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

function ErrorState() {
	return (
		<div className='flex flex-col items-center justify-center h-full gap-2 py-16'>
			<p className='text-[13px] text-red-600 font-mono'>
				Error al cargar productos
			</p>
		</div>
	);
}
