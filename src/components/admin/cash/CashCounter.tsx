import { useState } from 'react';
import { formatPrice } from '../../../utils/formatPrice';

const DENOMINATIONS = [
	{
		value: 20000,
		label: '$20000',
		type: 'bill',
	},
	{
		value: 10000,
		label: '$10000',
		type: 'bill',
	},
	{
		value: 2000,
		label: '$2000',
		type: 'bill',
	},
	{
		value: 1000,
		label: '$1000',
		type: 'bill',
	},
	{
		value: 500,
		label: '$500',
		type: 'bill',
	},
	{
		value: 200,
		label: '$200',
		type: 'bill',
	},
	{
		value: 100,
		label: '$100',
		type: 'bill',
	},
	{
		value: 50,
		label: '$50',
		type: 'bill',
	},
	{
		value: 20,
		label: '$20',
		type: 'bill',
	},
	{
		value: 10,
		label: '$10',
		type: 'bill',
	},
];

const COINS = [
	{
		value: 5,
		label: '$5',
		type: 'coin',
	},
	{
		value: 2,
		label: '$2',
		type: 'coin',
	},
	{
		value: 1,
		label: '$1',
		type: 'coin',
	},
];

interface ICashCounterProps {
	onUseAmount: (amount: number) => void;
	onClose: () => void;
}

export const CashCounter = ({ onUseAmount, onClose }: ICashCounterProps) => {
	const [counts, setCounts] = useState<Record<number, number>>({});

	const handleCountChange = (value: number, count: number) => {
		setCounts((prev) => ({ ...prev, [value]: count }));
	};

	const total =
		DENOMINATIONS.reduce((acc, d) => {
			return acc + d.value * (counts[d.value] || 0);
		}, 0) +
		COINS.reduce((acc, c) => {
			return acc + c.value * counts[c.value] || 0;
		}, 0);

	const handleUseAmount = () => {
		onUseAmount(total);
		onClose();
	};

	return (
		<div className='bg-[#0d0d0d] border border-[#252525] rounded-lg p-4 space-y-4'>
			<div className='flex items-center justify-between'>
				<p className='text-[11px] font-mono text-[#555] uppercase tracking-widest'>
					Contador de efectivo
				</p>
				<button
					onClick={onClose}
					className='text-[11px] font-mono text-[#555] hover:text-white'
				>
					Cerrar
				</button>
			</div>

			{/* Billetes */}
			<div>
				<p className='text-[10px] font-mono text-[#444] uppercase tracking-wider mb-2'>
					Billetes
				</p>
				<div className='grid grid-cols-3 gap-2'>
					{DENOMINATIONS.map((denom) => (
						<div
							key={denom.value}
							className='flex items-center justify-between bg-[#141414] border border-[#252525] rounded px-2 py-1.5'
						>
							<span className='text-[11px] font-mono text-[#888]'>
								{denom.label}
							</span>
							<div className='flex items-center gap-1'>
								<span className='text-[10px] font-mono text-[#555]'>x</span>
								<input
									type='number'
									min='0'
									value={counts[denom.value] || ''}
									onChange={(e) =>
										handleCountChange(
											denom.value,
											parseInt(e.target.value) || 0,
										)
									}
									className='w-10 bg-[#0d0d0d] border border-[#2a2a2a] focus:border-green-700 rounded px-1 py-0.5 text-[11px] font-mono text-white text-right outline-none'
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Monedas */}
			<div>
				<p className='text-[10px] font-mono text-[#444] uppercase tracking-wider mb-2'>
					Monedas
				</p>
				<div className='grid grid-cols-2 gap-2'>
					{COINS.map((coin) => (
						<div
							key={coin.value}
							className='flex items-center justify-between bg-[#141414] border border-[#252525] rounded px-2 py-1.5'
						>
							<span className='text-[11px] font-mono text-[#888]'>
								{coin.label}
							</span>
							<div className='flex items-center gap-1'>
								<span className='text-[10px] font-mono text-[#555]'>x</span>
								<input
									type='number'
									min='0'
									value={counts[coin.value] || ''}
									onChange={(e) =>
										handleCountChange(coin.value, parseInt(e.target.value) || 0)
									}
									className='w-10 bg-[#0d0d0d] border border-[#2a2a2a] focus:border-green-700 rounded px-1 py-0.5 text-[11px] font-mono text-white text-right outline-none'
								/>
							</div>
						</div>
					))}
				</div>

				{/* Total y accion */}
				<div className='border-t border-[#252525] pt-3 space-y-3'>
					<div className='flex justify-between items-center'>
						<span className='text-[12px] font-mono text-[#555]'>
							Total contado
						</span>
						<span className='text-[16px] font-mono font-semibold text-white'>
							{formatPrice(total)}
						</span>
					</div>
					<button
						onClick={handleUseAmount}
						disabled={total === 0}
						className='w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors'
					>
						Usar este monto
					</button>
				</div>
			</div>
		</div>
	);
};
