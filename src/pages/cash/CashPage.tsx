import { CashClosed } from '../../components/admin/cash/CashClosed';
import { CashOpen } from '../../components/admin/cash/CashOpen';
import { CashSkeleton } from '../../components/admin/cash/CashSkeleton';
import { useGetCashStatus } from '../../queries/cash.queries';

const CashPage = () => {
	const { data: cashStatus, isLoading } = useGetCashStatus();

	if (isLoading) return <CashSkeleton />;

	if (!cashStatus?.is_open) {
		return <CashClosed />;
	}
	return <CashOpen cashStatus={cashStatus} />;
};

export default CashPage;
