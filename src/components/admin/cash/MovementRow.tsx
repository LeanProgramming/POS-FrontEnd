import type { ICashMovement } from '../../../types/cash.type';
import { formatDate } from '../../../utils/formatDate';
import { formatPrice } from '../../../utils/formatPrice';

interface IMovementRowProps {
	movement: ICashMovement;
}

export const MovementRow = ({ movement }: IMovementRowProps) => {
	const isIncome = movement.type !== 'refund' && movement.type !== 'cash_out';
	return (
		<div className='flex items-center justify-between px-4 py-3 hover:bg-[#161616] transition-colors'>
			<div className='flex flex-col gap-0.5'>
				<p className='text-[13px] text-[#ccc]'>{movement.description}</p>
				<p className='text-[11px] font-mono text-[#444]'>
					{formatDate(movement.created_at)}
				</p>
			</div>
			<span
				className={`text-[13px] font-mono font-semibold ${
					isIncome ? 'text-green-500' : 'text-red-500'
				}`}
			>
				{isIncome ? '+' : '-'}
				{formatPrice(movement.amount)}
			</span>
		</div>
	);
};
