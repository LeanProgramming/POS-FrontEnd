import { useEffect, useRef, type ChangeEvent } from 'react';
interface IPOSSearchProps {
	query: string;
	setQuery: (value: string) => void;
}

export const POSSearch = ({ query, setQuery }: IPOSSearchProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();

		const handleKey = (e: KeyboardEvent) => {
			if (
				e.key === 'F2' ||
				(e.key === '/' && document.activeElement?.tagName !== 'INPUT')
			) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
	};

	const handleClear = () => {
		setQuery('');
		inputRef.current?.focus();
	};

	return (
		<div className='flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1e1e1e] rounded-lg shrink-0'>
			{/* Ícono búsqueda */}
			<svg
				className='w-4 h-4 text-[#555] shrink-0'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={1.5}
					d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'
				/>
			</svg>

			<input
				ref={inputRef}
				type='text'
				value={query}
				onChange={handleChange}
				placeholder='Buscar por nombre, SKU o código de barras...'
				className='flex-1 bg-transparent text-sm text-[#e5e5e5] placeholder-[#444] outline-none'
			/>

			{query && (
				<button
					onClick={handleClear}
					className='text-[#555] hover:text-[#aaa] transition-colors text-xs font-mono'
				>
					limpiar
				</button>
			)}

			<span className='text-[10px] font-mono text-[#333] shrink-0 hidden lg:block'>
				F2 para enfocar
			</span>
		</div>
	);
};
