import { useNavigate } from 'react-router-dom';
import type { IAuthUser } from '../../types/auth.type';
import type { ICashStatus } from '../../types/cash.type';

interface IPOSTopbarProps {
	user: IAuthUser | null;
	cashStatus: ICashStatus | null;
	onLogout: () => void;
}
export const POSTopbar = ({ user, cashStatus, onLogout }: IPOSTopbarProps) => {
	const navigate = useNavigate();
	const now = new Date().toLocaleTimeString('es-AR', {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<header className='flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#1e1e1e] shrink-0'>
			{/* Izquierda: estado + nombre */}
			<div className='flex items-center gap-3'>
				<span
					className={`w-2 h-2 rounded-full ${cashStatus?.is_open ? 'bg-green-500' : 'bg-red-500'}`}
				/>
				<span className='text-[13px] font-semibold text-white tracking-tight'>
					Punto de Venta
				</span>
				<span className='text-[11px] font-mono text-[#444] px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] rounded'>
					{now}
				</span>
				{cashStatus?.is_open ? (
					<span className='text-[11px] font-mono text-green-600 px-2 py-0.5 bg-[#0f1f12] border border-green-900 rounded'>
						Caja abierta
					</span>
				) : (
					<span className='text-[11px] font-mono text-red-500 px-2 py-0.5 bg-[#2a1414] border border-red-900 rounded'>
						Caja cerrada
					</span>
				)}
			</div>

			{/* Derecha: usuario + logout */}
			<div className='flex items-center gap-3'>
				{user?.role == 'admin' ? (
					<button
						onClick={() =>
							user?.role == 'admin' ? navigate('/users') : navigate('/sales')
						}
						className='flex items-center gap-1.5 text-[11px] font-mono text-[#555] hover:text-[#ccc] transition-colors px-2 py-1 bg-[#1a1a1a] border border-[#252525] rounded hover:border-[#444]'
					>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
							/>
						</svg>
						usuarios
					</button>
				) : (
					<button
						onClick={() =>
							user?.role == 'admin' ? navigate('/users') : navigate('/sales')
						}
						className='flex items-center gap-1.5 text-[11px] font-mono text-[#555] hover:text-[#ccc] transition-colors px-2 py-1 bg-[#1a1a1a] border border-[#252525] rounded hover:border-[#444]'
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
								d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
							/>
						</svg>
						mis ventas
					</button>
				)}

				<span className='text-[12px] font-mono text-green-500'>
					Usuario: {user?.username}
				</span>
				<span className='text-[11px] font-mono text-[#fff] px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] rounded capitalize'>
					Rol: {user?.role}
				</span>
				<button
					onClick={onLogout}
					className='text-[11px] font-mono text-[#555] hover:text-red-500 transition-colors px-2 py-0.5 rounded'
				>
					cerrar sesión
				</button>
			</div>
		</header>
	);
};
