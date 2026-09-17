import { useNavigate } from 'react-router-dom';
import { CashReconciliation } from '../../components/admin/cash/CashReconciliation';

export const CashCountPage = () => {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col gap-6'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-xl font-semibold text-white'>Arqueo de caja</h1>
					<p className='text-[13px] text-[#555] mt-0.5'>
						Desglose y cierre de sesión
					</p>
				</div>
			</div>

			{/* Componente de arqueo */}
			<CashReconciliation />

			{/* Botón volver */}
			<button
				onClick={() => navigate('/cash')}
				className='text-[12px] font-mono text-[#555] hover:text-white transition-colors'
			>
				← Volver a estado de caja
			</button>
		</div>
	);
};

export default CashCountPage;
