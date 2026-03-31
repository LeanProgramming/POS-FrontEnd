import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export const AdminLayout = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	return (
		<div className='h-screen bg-[#0f0f0f] flex flex-col overflow-hidden'>
			{/* Topbar */}
			<header className='flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#1e1e1e] shrink-0'>
				<div className='flex items-center gap-3'>
					<span className='w-2 h-2 rounded-full bg-green-500' />
					<span className='text-[13px] font-semibold text-white tracking-tight'>
						POS
					</span>
					<span className='text-[11px] font-mono text-[#444]'>
						Administración
					</span>
				</div>

				<div className='flex items-center gap-3'>
					<button
						onClick={() => navigate('/pos')}
						className='text-[11px] font-mono text-[#555] hover:text-green-500 transition-colors px-2 py-1 bg-[#1a1a1a] border border-[#252525] rounded'
					>
						ir al POS
					</button>
					<span className='text-[12px] font-mono text-green-500'>
						Usuario: {user?.username}
					</span>
					<span className='text-[11px] font-mono text-[#fff] px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] rounded capitalize'>
						Rol: {user?.role}
					</span>
					<button
						onClick={handleLogout}
						className='text-[11px] font-mono text-[#555] hover:text-red-500 transition-colors'
					>
						cerrar sesión
					</button>
				</div>
			</header>

			{/* Body: sidebar + contenido */}
			<div className='flex flex-1 overflow-hidden'>
				<AdminSidebar />

				<main className='flex-1 overflow-y-auto bg-[#0f0f0f] p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};
