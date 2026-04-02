export const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg py-16 flex flex-col items-center gap-2'>
			<p className='text-[13px] font-mono text-[#444]'>
				{hasSearch ? 'Sin resultados' : 'No hay categorías'}
			</p>
			{!hasSearch && (
				<p className='text-[12px] text-[#333]'>
					Creá la primera categoría con el botón de arriba
				</p>
			)}
		</div>
	);
};
