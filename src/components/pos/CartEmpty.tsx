export const CartEmpty = () => {
	return (
		<div className='flex flex-col items-center justify-center h-full gap-2 py-12'>
			<div className='w-10 h-10 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center'>
				<svg
					className='w-5 h-5 text-[#333]'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
					/>
				</svg>
			</div>
			<p className='text-[12px] font-mono text-[#444]'>Carrito vacío</p>
			<p className='text-[11px] text-[#333]'>
				Hacé click en un producto para agregarlo
			</p>
		</div>
	);
};
