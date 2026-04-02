import { useState } from 'react';
import type { IUser } from '../../types/users.type';
import { useGetUsers } from '../../queries/users.queries';
import { TableSkeleton } from '../../components/admin/users/TableSkeleton';
import { TableError } from '../../components/admin/users/TableError';
import { TableEmpty } from '../../components/admin/users/TableEmpty';
import { UsersTable } from '../../components/admin/users/UsersTable';
import { UserFormModal } from '../../components/admin/users/UserFormModal';
import { DeleteConfirmModal } from '../../components/admin/products/DeleteConfirmModal';

const UsersPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

	const { data: users = [], isLoading, isError } = useGetUsers();

	const admins = users.filter((u) => u.role === 'admin').length;
	const cashiers = users.filter((u) => u.role === 'cashier').length;

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Usuarios</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Gestioná el acceso al sistema
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold rounded-lg transition-colors'
				>
					<span className='text-base leading-none'>+</span>
					Nuevo usuario
				</button>
			</div>

			{/* Métricas */}
			<div className='grid grid-cols-3 gap-3 max-w-sm'>
				{[
					{ label: 'Total', value: users.length, color: 'text-white' },
					{ label: 'Admins', value: admins, color: 'text-blue-400' },
					{ label: 'Cajeros', value: cashiers, color: 'text-green-500' },
				].map((m) => (
					<div
						key={m.label}
						className='bg-[#161616] border border-[#1e1e1e] rounded-lg p-4'
					>
						<p className='text-[12px] font-mono text-[#555] mb-1'>{m.label}</p>
						<p className={`text-2xl font-mono font-semibold ${m.color}`}>
							{m.value}
						</p>
					</div>
				))}
			</div>

			{/* Tabla */}
			{isLoading ? (
				<TableSkeleton />
			) : isError ? (
				<TableError />
			) : users.length === 0 ? (
				<TableEmpty />
			) : (
				<UsersTable users={users} onDelete={setDeletingUser} />
			)}

			{/* Contador */}
			{!isLoading && (
				<p className='text-[12px] font-mono text-[#444]'>
					{users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
				</p>
			)}

			{/* Modal crear */}
			{showForm && <UserFormModal onClose={() => setShowForm(false)} />}

			{/* Modal eliminar */}
			{deletingUser && (
				<DeleteConfirmModal
					title='Eliminar usuario'
					description={`¿Seguro que querés eliminar a "${deletingUser.username}"? Esta acción no se puede deshacer.`}
					isLoading={false}
					onConfirm={() => setDeletingUser(null)}
					onClose={() => setDeletingUser(null)}
				/>
			)}
		</div>
	);
};

export default UsersPage;
