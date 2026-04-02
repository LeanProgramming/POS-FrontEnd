export const MovementsSkeleton = () => {
	return (
		<>
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={i}
					className='flex items-center justify-between px-4 py-3 animate-pulse'
				>
					<div className='flex flex-col gap-1.5'>
						<div className='h-3 w-32 bg-[#1e1e1e] rounded' />
						<div className='h-2 w-20 bg-[#1a1a1a] rounded' />
					</div>
					<div className='h-3 w-16 bg-[#1e1e1e] rounded' />
				</div>
			))}
		</>
	);
};
