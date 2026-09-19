import type { IUser } from '../../../types/users.type';

interface IUserRowProps {
	user: IUser;
	onEdit: (user: IUser) => void;
	onDelete: (user: IUser) => void;
}

export const UserRow = ({ user, onEdit, onDelete }: IUserRowProps) => {
	const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
	const fullName = `${user.first_name} ${user.last_name}`;
	const isAdmin = user.role === 'admin';

	return (
		<div className='grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-3 items-center hover:bg-[#161616] transition-colors group'>
			{/* Avatar + nombre completo */}
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
				<div className='min-w-0'>
					<span className='text-[13px] text-[#ccc] font-medium block truncate'>
						{fullName}
					</span>
					<span className='text-[11px] text-[#555] font-mono'>
						{user.username}
					</span>
				</div>
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
			<div className='flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
				<button
					onClick={() => onEdit(user)}
					title='Editar'
					className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#1a1a2a] border border-[#252525] hover:border-blue-900 rounded transition-colors text-[#666] hover:text-blue-400'
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
							d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
						/>
					</svg>
				</button>
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
