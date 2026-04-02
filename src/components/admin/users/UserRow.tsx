import type { IUser } from '../../../types/users.type';

interface IUserRowProps {
	user: IUser;
	onDelete: (user: IUser) => void;
}

export const UserRow = ({ user, onDelete }: IUserRowProps) => {
	const initials = user.username.slice(0, 2).toUpperCase();
	const isAdmin = user.role === 'admin';

	return (
		<div className='grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors group'>
			{/* Avatar + username */}
			<div className='flex items-center gap-3'>
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-mono font-semibold
                    ${
											isAdmin
												? 'bg-blue-900/40 border border-blue-800 text-blue-300'
												: 'bg-green-900/30 border border-green-900 text-green-400'
										}`}
				>
					{initials}
				</div>
				<span className='text-[13px] text-[#ccc] font-medium'>
					{user.username}
				</span>
			</div>

			{/* Rol */}
			<span
				className={`inline-flex w-fit text-[11px] font-mono px-2 py-0.5 rounded capitalize
                ${
									isAdmin
										? 'bg-blue-900/30 border border-blue-800/50 text-blue-300'
										: 'bg-green-900/20 border border-green-900/50 text-green-500'
								}`}
			>
				{user.role}
			</span>

			{/* Acciones */}
			<div className='flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
				<button
					onClick={() => onDelete(user)}
					title='Eliminar'
					className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a1414] border border-[#252525] hover:border-red-900 rounded transition-colors text-[#666] hover:text-red-500'
				>
					<svg
						className='w-3.5 h-3.5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
