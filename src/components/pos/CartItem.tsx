import { formatPrice } from '../../utils/formatPrice';

interface ICartItemProps {
	item: {
		product_id: string;
		name: string;
		quantity: number;
		price: number;
		subtotal: number;
	};
	onRemove: () => void;
	onQuantityChange: (quantity: number) => void;
}

export const CartItem = ({
	item,
	onRemove,
	onQuantityChange,
}: ICartItemProps) => {
	return (
		<div className='flex items-center gap-2 bg-[#161616] border border-[#252525] rounded-lg px-3 py-2 group'>
			<div className='flex-1 min-w-0'>
				<p className='text-[12px] text-[#ccc] font-medium truncate'>
					{item.name}
				</p>
				<p className='text-[11px] font-mono text-green-600 mt-0.5'>
					{formatPrice(item.subtotal)}
				</p>
			</div>

			<div className='flex items-center gap-1.5 shrink-0'>
				<button
					onClick={() => onQuantityChange(item.quantity - 1)}
					className='w-6 h-6 flex items-center justify-center bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#888] hover:text-white rounded transition-colors text-sm font-mono'
				>
					−
				</button>
				<span className='text-[12px] font-mono text-white w-5 text-center'>
					{item.quantity}
				</span>
				<button
					onClick={() => onQuantityChange(item.quantity + 1)}
					className='w-6 h-6 flex items-center justify-center bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#888] hover:text-white rounded transition-colors text-sm font-mono'
				>
					+
				</button>
				<button
					onClick={onRemove}
					className='w-6 h-6 flex items-center justify-center text-[#333] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-1'
				>
					<svg
						className='w-3 h-3'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
