export const CashSkeleton = () => {
	return (
		<div className='flex flex-col gap-6 animate-pulse'>
			<div className='h-7 w-24 bg-[#1e1e1e] rounded' />
			<div className='grid grid-cols-2 gap-3 max-w-sm'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='h-20 bg-[#161616] border border-[#1e1e1e] rounded-lg'
					/>
				))}
			</div>
		</div>
	);
};
