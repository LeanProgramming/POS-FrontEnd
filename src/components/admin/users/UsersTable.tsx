import type { IUser } from '../../../types/users.type';
import { UserRow } from './UserRow';

interface IUserTableProps {
	users: IUser[];
	onDelete: (user: IUser) => void;
}

export const UsersTable = ({ users, onDelete }: IUserTableProps) => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			{/* Header */}
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

			{/* Rows */}
			<div className='divide-y divide-[#1a1a1a]'>
				{users.map((user) => (
					<UserRow key={user._id} user={user} onDelete={onDelete} />
				))}
			</div>
		</div>
	);
};
