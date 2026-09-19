import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { usePOSStore } from '../../store/usePOSStore';
import { useEffect, useState } from 'react';
import { POSTopbar } from '../../components/pos/POSTopbar';
import { POSProductGrid } from '../../components/pos/POSProductGrid';
import { POSCart } from '../../components/pos/POSCart';
import { POSPaymentModal } from '../../components/pos/POSPaymentModal';
import { POSSuccessModal } from '../../components/pos/POSSuccessModal';
import { useGetCashStatus } from '../../queries/cash.queries';
import { useCreateSale } from '../../queries/sales.queries';
import { getErrorMessage } from '../../api/errors';
import { useCashStore } from '../../store/useCashStore.';

export const POSPage = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const { items, payments, total } = usePOSStore();
	const { sessionId, setSessionId } = useCashStore();

	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [lastSaleId, setLastSaleId] = useState<string | null>(null);

	const { data: cashStatus, isLoading: cashLoading } = useGetCashStatus();
	const createSale = useCreateSale();

	useEffect(() => {
		if (!cashStatus) return;

		if (cashStatus.session && !sessionId) {
			setSessionId(cashStatus.session._id);
		}
	}, [cashStatus]);

	const handleLogout = () => {
		if (cashStatus?.is_open) {
			navigate('/cash/cash-count');
			return;
		}
		logout();
		navigate('/login', { replace: true });
	};

	const handleConfirmSale = async () => {
		if (items.length === 0 || !sessionId) return;

		createSale.mutate(
			{ items, payment_methods: payments, session_id: sessionId },
			{
				onSuccess: (sale) => {
					setLastSaleId(sale._id);
					setShowPaymentModal(false);
					setShowSuccessModal(true);
				},
			},
		);
	};

	if (cashLoading) {
		return (
			<div className='h-screen bg-[#0f0f0f] flex items-center justify-center'>
				<div className='flex items-center gap-3'>
					<span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
					<span className='text-[13px] font-mono text-[#555]'>
						Verificando caja...
					</span>
				</div>
			</div>
		);
	}

	if (!cashStatus?.is_open) {
		return (
			<div className='h-screen bg-[#0f0f0f] flex flex-col overflow-hidden'>
				<POSTopbar
					user={user}
					cashStatus={cashStatus ?? null}
					onLogout={handleLogout}
				/>
				<div className='flex-1 flex items-center justify-center p-4'>
					<div className='w-full max-w-sm text-center space-y-5'>
						<div className='w-14 h-14 rounded-full bg-[#2a1414] border border-red-900 flex items-center justify-center mx-auto'>
							<svg
								className='w-7 h-7 text-red-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
								/>
							</svg>
						</div>
						<div>
							<h2 className='text-[16px] font-semibold text-white mb-1'>
								Caja cerrada
							</h2>
							<p className='text-[13px] text-[#555]'>
								Necesitás abrir la caja antes de operar.
							</p>
						</div>
						<button
							onClick={() => navigate('/cash')}
							className='inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black text-[13px] font-semibold rounded-lg transition-colors'
						>
							Ir a abrir caja
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='h-screen bg-[#0f0f0f] flex flex-col overflow-hidden'>
			<POSTopbar
				user={user}
				cashStatus={cashStatus ?? null}
				onLogout={handleLogout}
			/>

			<div className='flex flex-1 gap-2 p-2 overflow-hidden'>
				{/* Panel izquierdo: búsqueda + grilla */}
				<div className='flex flex-col flex-1 gap-2 overflow-hidden'>
					<POSProductGrid />
				</div>

				{/* Sidebar: carrito */}
				<POSCart onCheckout={() => setShowPaymentModal(true)} />
			</div>

			{/* Modal de pago */}
			{showPaymentModal && (
				<POSPaymentModal
					total={total}
					onClose={() => {
						setShowPaymentModal(false);
						createSale.reset();
					}}
					onConfirm={handleConfirmSale}
					isSubmitting={createSale.isPending}
					error={createSale.isError ? getErrorMessage(createSale.error) : null}
				/>
			)}

			{/* Modal de éxito */}
			{showSuccessModal && (
				<POSSuccessModal
					saleId={lastSaleId}
					onClose={() => setShowSuccessModal(false)}
				/>
			)}
		</div>
	);
};
