import { formatPrice } from '../../utils/formatPrice';
import type { IProduct } from '../../types/product.type';

interface IProductCardProps {
	product: IProduct;
	onAdd: () => void;
}

export const ProductCard = ({ product, onAdd }: IProductCardProps) => {
	const outOfStock = product.stock <= 0;

	return (
		<button
			onClick={onAdd}
			disabled={outOfStock}
			className={`
        w-full text-left bg-[#161616] border rounded-lg p-3
        transition-all duration-100 group
        ${
					outOfStock
						? 'border-[#1e1e1e] opacity-40 cursor-not-allowed'
						: 'border-[#252525] hover:border-green-800 hover:bg-[#111f14] active:scale-[0.98] cursor-pointer'
				}
      `}
		>
			{/* SKU badge */}
			<span className='text-[10px] font-mono text-[#444] group-hover:text-green-800 transition-colors'>
				{product.sku}
			</span>

			{/* Nombre */}
			<p className='text-[13px] text-[#ccc] font-medium mt-1 leading-tight line-clamp-2'>
				{product.name}
			</p>

			{/* Precio + stock */}
			<div className='flex items-end justify-between mt-2'>
				<span className='text-[14px] font-mono font-semibold text-green-500'>
					{formatPrice(product.price)}
				</span>
				<span
					className={`text-[10px] font-mono ${
						product.stock <= 3 ? 'text-amber-600' : 'text-[#444]'
					}`}
				>
					{outOfStock ? 'sin stock' : `x${product.stock}`}
				</span>
			</div>
		</button>
	);
};
