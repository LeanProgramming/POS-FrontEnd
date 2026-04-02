export const SkeletonGrid = () => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4 animate-pulse h-28'
				/>
			))}
		</div>
	);
};
