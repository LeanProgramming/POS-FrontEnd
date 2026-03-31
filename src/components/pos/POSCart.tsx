import { usePOSStore } from '../../store/usePOSStore';
import { formatPrice } from '../../utils/formatPrice';
import { CartEmpty } from './CartEmpty';
import { CartItem } from './CartItem';

interface IPOSCartProps {
	onCheckout: () => void;
}

export const POSCart = ({ onCheckout }: IPOSCartProps) => {
	const { items, total, removeItem, updateQuantity, clearCart } = usePOSStore();

	const isEmpty = items.length === 0;
	return (
		<aside className='w-[320px] shrink-0 flex flex-col bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] shrink-0'>
				<div className='flex items-center gap-2'>
					<span className='text-[13px] font-semibold text-white'>Carrito</span>
					{!isEmpty && (
						<span className='text-[11px] font-mono text-[#555] bg-[#1a1a1a] border border-[#252525] rounded px-1.5 py-0.5'>
							{items.length} {items.length === 1 ? 'item' : 'items'}
						</span>
					)}
				</div>
				{!isEmpty && (
					<button
						onClick={clearCart}
						className='text-[11px] font-mono text-[#555] hover:text-red-500 transition-colors'
					>
						limpiar
					</button>
				)}
			</div>

			{/* Items */}
			<div className='flex-1 overflow-y-auto p-2 space-y-1.5'>
				{isEmpty ? (
					<CartEmpty />
				) : (
					items.map((item) => (
						<CartItem
							key={item.product_id + item.name}
							item={item}
							onRemove={() => removeItem(item.product_id)}
							onQuantityChange={(q) => updateQuantity(item.product_id, q)}
						/>
					))
				)}
			</div>

			{/* Totales + acción */}
			<div className='border-t border-[#1e1e1e] p-4 space-y-3 shrink-0'>
				<div className='flex justify-between items-center'>
					<span className='text-[12px] font-mono text-[#555]'>Subtotal</span>
					<span className='text-[13px] font-mono text-[#aaa]'>
						{formatPrice(total)}
					</span>
				</div>

				<div className='flex justify-between items-center border-t border-[#1e1e1e] pt-3'>
					<span className='text-[13px] font-mono text-[#aaa]'>Total</span>
					<span className='text-[20px] font-mono font-semibold text-white'>
						{formatPrice(total)}
					</span>
				</div>

				<button
					onClick={onCheckout}
					disabled={isEmpty}
					className={`
            w-full py-3 rounded-lg text-[13px] font-semibold font-mono transition-all
            ${
							isEmpty
								? 'bg-[#161616] text-[#333] cursor-not-allowed border border-[#252525]'
								: 'bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black cursor-pointer'
						}
          `}
				>
					{isEmpty ? 'Carrito vacío' : `Cobrar ${formatPrice(total)}`}
				</button>
			</div>
		</aside>
	);
};
