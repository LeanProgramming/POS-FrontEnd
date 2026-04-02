export const TableSkeleton = () => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			<div className='grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-3 px-4 py-3 bg-[#161616] border-b border-[#222]'>
				{['Producto', 'Categoría', 'Precio', 'Stock', ''].map((col) => (
					<span
						key={col}
						className='text-[11px] font-mono text-[#555] uppercase tracking-wider'
					>
						{col}
					</span>
				))}
			</div>
			<div className='divide-y divide-[#1a1a1a]'>
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className='grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-3 px-4 py-3 animate-pulse'
					>
						<div className='flex flex-col gap-2'>
							<div className='h-3 w-32 bg-[#1e1e1e] rounded' />
							<div className='h-2 w-16 bg-[#1a1a1a] rounded' />
						</div>
						<div className='h-5 w-16 bg-[#1a1a1a] rounded' />
						<div className='h-3 w-14 bg-[#1a1a1a] rounded' />
						<div className='h-3 w-12 bg-[#1a1a1a] rounded' />
						<div />
					</div>
				))}
			</div>
		</div>
	);
};
