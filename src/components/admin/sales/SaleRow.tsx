import type { ISale } from '../../../types/sales.type';
import { formatDate } from '../../../utils/formatDate';
import { formatPrice } from '../../../utils/formatPrice';

interface ISaleRowProps {
	sale: ISale;
	isExpanded: boolean;
	onToggle: () => void;
}

export const SaleRow = ({ sale, isExpanded, onToggle }: ISaleRowProps) => {
	return (
		<div>
			{/* Fila principal */}
			<button
				onClick={onToggle}
				className='w-full grid grid-cols-[1fr_100px_140px_32px] gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors text-left'
			>
				{/* ID */}
				<div className='flex flex-col gap-0.5'>
					<span className='text-[12px] font-mono text-[#888]'>
						#{sale._id.slice(-8).toUpperCase()}
					</span>
					<span className='text-[11px] font-mono text-[#444]'>
						{formatDate(sale.created_at)}
					</span>
				</div>

				{/* Items */}
				<span className='text-[13px] font-mono text-[#666]'>
					{sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
				</span>

				{/* Total */}
				<span className='text-[14px] font-mono font-semibold text-green-500'>
					{formatPrice(sale.total)}
				</span>

				{/* Chevron */}
				<span
					className={`text-[#444] transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
				>
					<svg
						className='w-4 h-4'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</span>
			</button>

			{/* Detalle expandido */}
			{isExpanded && (
				<div className='bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 py-4 space-y-4'>
					{/* Items de la venta */}
					<div>
						<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
							Productos
						</p>
						<div className='space-y-1'>
							{sale.items.map((item, i) => (
								<div key={i} className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<span className='text-[11px] font-mono text-[#444] w-5'>
											x{item.quantity}
										</span>
										<span className='text-[13px] text-[#ccc]'>{item.name}</span>
									</div>
									<span className='text-[13px] font-mono text-[#888]'>
										{formatPrice(item.price * item.quantity)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Pagos */}
					<div>
						<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
							Pagos
						</p>
						<div className='space-y-1'>
							{sale.payment_methods.map((payment, i) => (
								<div key={i} className='flex items-center justify-between'>
									<span className='text-[12px] font-mono text-[#666] capitalize'>
										{payment.method}
									</span>
									<span className='text-[13px] font-mono text-[#aaa]'>
										{formatPrice(payment.amount)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Total */}
					<div className='flex items-center justify-between border-t border-[#1e1e1e] pt-3'>
						<span className='text-[12px] font-mono text-[#555]'>Total</span>
						<span className='text-[15px] font-mono font-semibold text-green-500'>
							{formatPrice(sale.total)}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};
