export const EmptyState = () => {
	return (
		<div className='flex flex-col items-center justify-center h-full gap-2 py-16'>
			<svg
				className='w-8 h-8 text-[#2a2a2a]'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={1.5}
					d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'
				/>
			</svg>
			<p className='text-[13px] text-[#444] font-mono'>Sin resultados</p>
		</div>
	);
};
