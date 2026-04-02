export const TableSkeleton = () => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			<div className='grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-3 bg-[#161616] border-b border-[#222]'>
				{['Usuario', 'Rol', ''].map((col) => (
					<span
						key={col}
						className='text-[11px] font-mono text-[#555] uppercase tracking-wider'
					>
						{col}
					</span>
				))}
			</div>
			<div className='divide-y divide-[#1a1a1a]'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-3 animate-pulse items-center'
					>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-full bg-[#1e1e1e]' />
							<div className='h-3 w-28 bg-[#1e1e1e] rounded' />
						</div>
						<div className='h-5 w-16 bg-[#1a1a1a] rounded' />
						<div />
					</div>
				))}
			</div>
		</div>
	);
};
