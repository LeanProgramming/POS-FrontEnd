import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { usePOSStore } from '../../store/usePOSStore';
import { useState } from 'react';
import { POSTopbar } from '../../components/pos/POSTopbar';
import { POSProductGrid } from '../../components/pos/POSProductGrid';
import { POSCart } from '../../components/pos/POSCart';
import { POSPaymentModal } from '../../components/pos/POSPaymentModal';
import { POSSuccessModal } from '../../components/pos/POSSuccessModal';
import { useGetCashStatus } from '../../queries/cash.queries';
import { useCreateSale } from '../../queries/sales.queries';
import { getErrorMessage } from '../../api/errors';

export const POSPage = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const { items, payments, total } = usePOSStore();

	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [lastSaleId, setLastSaleId] = useState<string | null>(null);

	const { data: cashStatus } = useGetCashStatus();
	const createSale = useCreateSale();

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	const handleConfirmSale = async () => {
		if (items.length === 0) return;

		createSale.mutate(
			{ items, payment_methods: payments },
			{
				onSuccess: (sale) => {
					setLastSaleId(sale._id);
					setShowPaymentModal(false);
					setShowSuccessModal(true);
				},
			},
		);
	};

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
