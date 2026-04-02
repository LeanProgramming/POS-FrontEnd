import type { ISale } from '../../../types/sales.type';
import { SaleRow } from './SaleRow';

interface ISalesTableProps {
	sales: ISale[];
	expandedId: string | null;
	onToggle: (id: string) => void;
}

export const SalesTable = ({
	sales,
	expandedId,
	onToggle,
}: ISalesTableProps) => {
	return (
		<div className='bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden'>
			{/* Header */}
			<div className='grid grid-cols-[1fr_100px_140px_32px] gap-3 px-4 py-3 bg-[#161616] border-b border-[#222]'>
				{['ID', 'Items', 'Total', ''].map((col) => (
					<span
						key={col}
						className='text-[11px] font-mono text-[#555] uppercase tracking-wider'
					>
						{col}
					</span>
				))}
			</div>

			<div className='divide-y divide-[#1a1a1a]'>
				{sales.map((sale) => (
					<SaleRow
						key={sale._id}
						sale={sale}
						isExpanded={expandedId === sale._id}
						onToggle={() => onToggle(sale._id)}
					/>
				))}
			</div>
		</div>
	);
};
