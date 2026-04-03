import type { IProduct } from '../../../types/product.type';
import { formatPrice } from '../../../utils/formatPrice';

interface IProductRowProps {
	product: IProduct;
	hasActions: boolean;
	cols: string;
	onEdit?: (p: IProduct) => void;
	onDelete?: (p: IProduct) => void;
}

export const ProductRow = ({
	product,
	hasActions,
	cols,
	onDelete,
	onEdit,
}: IProductRowProps) => {
	const stockStatus =
		product.stock === 0
			? { color: 'text-red-500', dot: 'bg-red-500', label: 'Sin stock' }
			: product.stock <= 5
				? {
						color: 'text-amber-500',
						dot: 'bg-amber-500',
						label: `${product.stock} uds`,
					}
				: {
						color: 'text-[#aaa]',
						dot: 'bg-green-500',
						label: `${product.stock} uds`,
					};
	return (
		<div
			className={`grid ${cols} gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors group`}
		>
			<div>
				<p className='text-[13px] text-[#ccc] font-medium'>{product.name}</p>
				<p className='text-[11px] font-mono text-[#444] mt-0.5'>
					{product.sku}
				</p>
			</div>

			<span className='inline-flex'>
				<span className='text-[11px] font-mono text-[#6b9] bg-[#0f2a1a] border border-[#1e4a2a] rounded px-2 py-0.5'>
					{product.category}
				</span>
			</span>

			<span className='text-[13px] font-mono text-[#aaa]'>
				{formatPrice(product.price)}
			</span>

			<div className='flex items-center gap-2'>
				<span
					className={`w-1.5 h-1.5 rounded-full shrink-0 ${stockStatus.dot}`}
				/>
				<span className={`text-[13px] font-mono ${stockStatus.color}`}>
					{stockStatus.label}
				</span>
			</div>

			{hasActions && (
				<div className='flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity'>
					{onEdit && (
						<button
							onClick={() => onEdit(product)}
							title='Editar'
							className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#252525] rounded transition-colors text-[#666] hover:text-[#ccc]'
						>
							<svg
								className='w-3.5 h-3.5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
								/>
							</svg>
						</button>
					)}
					{onDelete && (
						<button
							onClick={() => onDelete(product)}
							title='Eliminar'
							className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a1414] border border-[#252525] hover:border-red-900 rounded transition-colors text-[#666] hover:text-red-500'
						>
							<svg
								className='w-3.5 h-3.5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
						</button>
					)}
				</div>
			)}
		</div>
	);
};
