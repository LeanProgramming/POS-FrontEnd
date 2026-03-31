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
				<span className='w-2 h-2 rounded-full bg-green-500' />
				<span className='text-[13px] font-semibold text-white tracking-tight'>
					Punto de Venta
				</span>
				<span className='text-[11px] font-mono text-[#444] px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] rounded'>
					{now}
				</span>
				{cashStatus?.isOpen && (
					<span className='text-[11px] font-mono text-green-600 px-2 py-0.5 bg-[#0f1f12] border border-green-900 rounded'>
						Caja abierta
					</span>
				)}
			</div>

			{/* Derecha: usuario + logout */}
			<div className='flex items-center gap-3'>
				<button
					onClick={() => navigate('/')}
					className='text-[11px] font-mono text-[#555] hover:text-green-500 transition-colors px-2 py-1 bg-[#1a1a1a] border border-[#252525] rounded'
				>
					ir a Administración
				</button>
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
