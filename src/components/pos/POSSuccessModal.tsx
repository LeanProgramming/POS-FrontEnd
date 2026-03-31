interface IPOSSuccessModalProps {
	saleId: string | null;
	onClose: () => void;
}

export const POSSuccessModal = ({ saleId, onClose }: IPOSSuccessModalProps) => {
	return (
		<div
			className='absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4'
			style={{ position: 'fixed' }}
		>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl p-8 text-center'>
				{/* Check animado */}
				<div className='w-16 h-16 rounded-full bg-[#0f1f12] border border-green-800 flex items-center justify-center mx-auto mb-4'>
					<svg
						className='w-8 h-8 text-green-500'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 13l4 4L19 7'
						/>
					</svg>
				</div>

				<h2 className='text-[16px] font-semibold text-white mb-1'>
					Venta confirmada
				</h2>

				{saleId && (
					<p className='text-[11px] font-mono text-[#444] mb-6'>
						#{saleId.slice(-8).toUpperCase()}
					</p>
				)}

				<button
					onClick={onClose}
					className='w-full py-2.5 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold font-mono rounded-lg transition-colors active:scale-[0.98]'
				>
					Nueva venta
				</button>
			</div>
		</div>
	);
};
