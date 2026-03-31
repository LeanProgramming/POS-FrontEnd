export const SkeletonGrid = () => {
	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
			{Array.from({ length: 15 }).map((_, i) => (
				<div
					key={i}
					className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-3 animate-pulse'
				>
					<div className='h-2 w-14 bg-[#222] rounded mb-2' />
					<div className='h-3 w-full bg-[#222] rounded mb-1' />
					<div className='h-3 w-2/3 bg-[#222] rounded mb-3' />
					<div className='h-3 w-1/2 bg-[#1e3a1e] rounded' />
				</div>
			))}
		</div>
	);
};
