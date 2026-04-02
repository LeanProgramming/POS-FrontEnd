interface IDeleteConfirmModalProps {
	title: string;
	description: string;
	isLoading: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export const DeleteConfirmModal = ({
	title,
	description,
	isLoading,
	onClose,
	onConfirm,
}: IDeleteConfirmModalProps) => {
	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
			<div className='w-full max-w-sm bg-[#111] border border-[#252525] rounded-xl p-6'>
				{/* Ícono */}
				<div className='w-10 h-10 rounded-full bg-[#2a1414] border border-red-900 flex items-center justify-center mb-4'>
					<svg
						className='w-5 h-5 text-red-500'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
						/>
					</svg>
				</div>

				<h2 className='text-[15px] font-semibold text-white mb-1'>{title}</h2>
				<p className='text-[13px] text-[#666] leading-relaxed mb-6'>
					{description}
				</p>

				<div className='flex gap-2'>
					<button
						onClick={onClose}
						disabled={isLoading}
						className='flex-1 py-2.5 bg-[#161616] border border-[#252525] hover:border-[#444] disabled:opacity-50 text-[13px] font-mono text-[#888] rounded-lg transition-colors'
					>
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className='flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors'
					>
						{isLoading ? 'Eliminando...' : 'Eliminar'}
					</button>
				</div>
			</div>
		</div>
	);
};
