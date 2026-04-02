export const TableEmpty = ({ hasFilters }: { hasFilters: boolean }) => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg py-16 flex flex-col items-center gap-2'>
			<p className='text-[13px] font-mono text-[#444]'>
				{hasFilters
					? 'Sin resultados para esos filtros'
					: 'No hay ventas registradas'}
			</p>
		</div>
	);
};
