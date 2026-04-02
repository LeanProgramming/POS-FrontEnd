import type { IRefund } from '../../../types/refunds.type';
import { formatDate } from '../../../utils/formatDate';

interface IRefundRowProps {
	refund: IRefund;
	isExpanded: boolean;
	onToggle: () => void;
}

export const RefundRow = ({
	refund,
	isExpanded,
	onToggle,
}: IRefundRowProps) => {
	return (
		<div>
			<button
				onClick={onToggle}
				className='w-full grid grid-cols-[1fr_1fr_140px_32px] gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors text-left'
			>
				<div className='flex flex-col gap-0.5'>
					<span className='text-[12px] font-mono text-[#888]'>
						#{refund._id.slice(-8).toUpperCase()}
					</span>
					<span className='text-[11px] font-mono text-[#444]'>
						{formatDate(refund.created_at)}
					</span>
				</div>

				<span className='text-[12px] font-mono text-[#666]'>
					#{refund.sale_id.slice(-8).toUpperCase()}
				</span>

				<span className='text-[12px] text-[#888] truncate'>
					{refund.reason}
				</span>

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
				<div className='bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 py-4 space-y-3'>
					<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest mb-2'>
						Ítems devueltos
					</p>
					{refund.items.map((item, i) => (
						<div key={i} className='flex items-center gap-2'>
							<span className='text-[11px] font-mono text-[#444] w-5'>
								x{item.quantity}
							</span>
							<span className='text-[12px] font-mono text-[#888]'>
								{item.product_id}
							</span>
						</div>
					))}
					<div className='border-t border-[#1e1e1e] pt-3'>
						<p className='text-[11px] font-mono text-[#555] mb-1'>Motivo</p>
						<p className='text-[13px] text-[#ccc]'>{refund.reason}</p>
					</div>
				</div>
			)}
		</div>
	);
};
