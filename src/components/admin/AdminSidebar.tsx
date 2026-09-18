import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { SidebarNavItem } from './SidebarNavItem';
import type { TUserRole } from '../../types/auth.type';
import { useGetCashStatus } from '../../queries/cash.queries';

export interface INavItem {
	label: string;
	path: string;
	icon: React.ReactNode;
	roles: TUserRole[];
	requiresOpen?: boolean;
}

export interface INavGroup {
	label: string;
	roles: TUserRole[];
	items: INavItem[];
}

// ─── Iconos SVG inline ────────────────────────────────────────────────────────

const icons = {
	products: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
			/>
		</svg>
	),
	categories: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
			/>
		</svg>
	),
	sales: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
			/>
		</svg>
	),
	cash: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
			/>
		</svg>
	),
	refunds: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
			/>
		</svg>
	),
	users: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
			/>
		</svg>
	),
	movements: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
			/>
		</svg>
	),
	cash_count: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
			/>
		</svg>
	),
	history: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	),
	daily_summary: (
		<svg
			className='w-4 h-4'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
			/>
		</svg>
	),
};

const NAV_GROUPS: INavGroup[] = [
	{
		label: 'Inventario',
		roles: ['admin', 'cashier'],
		items: [
			{
				label: 'Productos',
				path: '/products',
				icon: icons.products,
				roles: ['admin', 'cashier'],
			},
			{
				label: 'Categorías',
				path: '/categories',
				icon: icons.categories,
				roles: ['admin'],
			},
		],
	},
	{
		label: 'Operaciones',
		roles: ['admin', 'cashier'],
		items: [
			{
				label: 'Ventas',
				path: '/sales',
				icon: icons.sales,
				roles: ['admin', 'cashier'],
			},
			{
				label: 'Devoluciones',
				path: '/refunds',
				icon: icons.refunds,
				roles: ['admin', 'cashier'],
			},
		],
	},
	{
		label: 'Caja',
		roles: ['admin', 'cashier'],
		items: [
			{
				label: 'Cajas Registradoras',
				path: '/cash-registers',
				icon: icons.cash,
				roles: ['admin'],
			},
			{
				label: 'Estado de caja',
				path: '/cash',
				icon: icons.cash,
				roles: ['admin', 'cashier'],
			},
		{
			label: 'Movimientos',
			path: '/cash/movements',
			icon: icons.movements,
			roles: ['admin', 'cashier'],
			requiresOpen: true,
		},
		{
			label: 'Arqueo de caja',
			path: '/cash/cash-count',
			icon: icons.cash_count,
			roles: ['admin', 'cashier'],
			requiresOpen: true,
		},
		{
			label: 'Historial',
			path: '/cash/history',
			icon: icons.history,
			roles: ['admin', 'cashier'],
			requiresOpen: true,
		},
		{
			label: 'Corte Z',
			path: '/cash/daily-summary',
			icon: icons.daily_summary,
			roles: ['admin'],
			requiresOpen: true,
		},
		],
	},
	{
		label: 'Sistema',
		roles: ['admin'],
		items: [
			{
				label: 'Usuarios',
				path: '/users',
				icon: icons.users,
				roles: ['admin'],
			},
		],
	},
];

export const AdminSidebar = () => {
	const { user } = useAuthStore();
	const { data: cashStatus } = useGetCashStatus();
	const role = user?.role ?? 'cashier';
	const isCashOpen = cashStatus?.is_open ?? false;
	const initials = user?.username
		? user.username.slice(0, 2).toUpperCase()
		: '??';

	return (
		<aside className='w-[200px] shrink-0 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col py-3 overflow-hidden'>
			<nav className='flex-1 px-2 space-y-4 overflow-y-auto'>
				{NAV_GROUPS.filter((g) => g.roles.includes(role)).map((group) => {
					const visibleItems = group.items.filter(
						(item) =>
							item.roles.includes(role) &&
							(!item.requiresOpen || isCashOpen),
					);

					if (visibleItems.length === 0) return null;

					return (
						<div key={group.label}>
							<p className='text-[10px] font-mono text-[#333] uppercase tracking-widest px-2 mb-1'>
								{group.label}
							</p>
							<div className='space-y-0.5'>
								{visibleItems.map((item) => (
									<SidebarNavItem key={item.path} item={item} />
								))}
							</div>
						</div>
					);
				})}
			</nav>

			{/* Footer: usuario */}
			<div className='px-2 pt-3 mt-3 border-t border-[#1a1a1a] shrink-0'>
				<div className='flex items-center gap-2.5 px-2 py-1.5'>
					<div className='w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0'>
						<span className='text-[9px] font-mono text-[#666]'>{initials}</span>
					</div>
					<div className='min-w-0'>
						<p className='text-[12px] text-[#aaa] truncate font-medium'>
							{user?.username}
						</p>
						<p className='text-[10px] font-mono text-[#444] capitalize'>
							{user?.role}
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
};
