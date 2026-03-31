import { useEffect, useState } from 'react';
import type { IProduct } from '../../types/product.type';
import { getProducts } from '../../services/product.service';

const ProductsPage = () => {
	const [products, setProducts] = useState<IProduct[]>([]);

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		const data = await getProducts();
		if (data) setProducts(data);
	};
	return (
		<div>
			<h1>Productos</h1>

			{products.map((p) => (
				<div key={p._id} className='text-[#fff]'>
					{p.name} - ${p.price}
				</div>
			))}
		</div>
	);
};

export default ProductsPage;
