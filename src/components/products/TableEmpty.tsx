export const TableEmpty = () => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg py-16 flex flex-col items-center gap-2'>
			<p className='text-[13px] font-mono text-[#444]'>No hay productos</p>
			<p className='text-[12px] text-[#333]'>
				Creá el primer producto con el botón de arriba
			</p>
		</div>
	);
};
