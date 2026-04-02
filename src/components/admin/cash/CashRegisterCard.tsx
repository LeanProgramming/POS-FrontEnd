import type { ICashRegister } from '../../../types/cash.type';

interface ICashRegisterCardProps {
	cashRegister: ICashRegister;
	onEdit: (cashRegister: ICashRegister) => void;
	onDelete: (cashRegister: ICashRegister) => void;
}

const ACCENT_COLORS = [
	{
		bg: 'bg-[#0f1f12]',
		border: 'border-green-900',
		text: 'text-green-500',
		badge: 'bg-green-900/40 text-green-400',
	},
	{
		bg: 'bg-[#1a1a2e]',
		border: 'border-blue-900',
		text: 'text-blue-400',
		badge: 'bg-blue-900/40 text-blue-300',
	},
	{
		bg: 'bg-[#2a1a1a]',
		border: 'border-red-900',
		text: 'text-red-400',
		badge: 'bg-red-900/40 text-red-300',
	},
	{
		bg: 'bg-[#1e1a0a]',
		border: 'border-amber-900',
		text: 'text-amber-400',
		badge: 'bg-amber-900/40 text-amber-300',
	},
	{
		bg: 'bg-[#1a1a2a]',
		border: 'border-purple-900',
		text: 'text-purple-400',
		badge: 'bg-purple-900/40 text-purple-300',
	},
	{
		bg: 'bg-[#0a1e1e]',
		border: 'border-teal-900',
		text: 'text-teal-400',
		badge: 'bg-teal-900/40 text-teal-300',
	},
];

function getAccent(str: string) {
	const index =
		str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
		ACCENT_COLORS.length;
	return ACCENT_COLORS[index];
}

export const CashRegisterCard = ({
	cashRegister,
	onEdit,
	onDelete,
}: ICashRegisterCardProps) => {
	const accent = getAccent(cashRegister.name);

	return (
		<div
			className={`group relative flex flex-col gap-3 p-4 rounded-lg border ${accent.bg} ${accent.border} transition-all hover:brightness-110`}
		>
			{/* Prefijo badge */}
			<span
				className={`inline-flex w-fit text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${accent.badge}`}
			>
				{cashRegister.name
					.split(' ')
					.map((el) => el.slice(0, 2))
					.join('')
					.toUpperCase()}
			</span>

			{/* Nombre */}
			<p className='text-[14px] font-medium text-[#e5e5e5] leading-tight'>
				{cashRegister.name}
			</p>

			{/* Acciones — visibles al hover */}
			<div className='absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity'>
				<button
					onClick={() => onEdit(cashRegister)}
					title='Editar'
					className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] rounded transition-colors text-[#666] hover:text-[#ccc]'
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
							d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
						/>
					</svg>
				</button>
				<button
					onClick={() => onDelete(cashRegister)}
					title='Eliminar'
					className='w-7 h-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a1414] border border-[#2a2a2a] hover:border-red-900 rounded transition-colors text-[#666] hover:text-red-500'
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
							d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
