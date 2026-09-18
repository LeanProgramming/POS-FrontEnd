import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { POSLayout } from '../layouts/POSLayout';
import { POSPage } from '../pages/pos/POSPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { useAuthStore } from '../store/useAuthStore';

function RequireAuth({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	if (!isAuthenticated) return <Navigate to='/login' replace />;
	return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
	const user = useAuthStore((s) => s.user);
	if (user?.role !== 'admin') return <Navigate to='/products' replace />;
	return <>{children}</>;
}

function RequireGuest({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	if (isAuthenticated) return <Navigate to='/pos' replace />;
	return <>{children}</>;
}

export const router = createBrowserRouter([
	{
		path: '/login',
		element: (
			<RequireGuest>
				<LoginPage />
			</RequireGuest>
		),
	},
	{
		element: (
			<RequireAuth>
				<POSLayout />
			</RequireAuth>
		),
		children: [
			{
				path: '/pos',
				element: <POSPage />,
			},
		],
	},
	{
		path: '/',
		element: (
			<RequireAuth>
				<AdminLayout />
			</RequireAuth>
		),
		children: [
			{ index: true, element: <Navigate to='/products' replace /> },
			{
				path: 'products',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/products/ProductsPage');
					return { Component };
				},
			},
			{
				path: 'categories',
				element: (
					<RequireAdmin>
						<Navigate to='/products' replace />
					</RequireAdmin>
				),
				lazy: async () => {
					const { default: Component } =
						await import('../pages/categories/CategoriesPage');
					return { Component };
				},
			},
			{
				path: 'sales',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/sales/SalesPage');
					return { Component };
				},
			},
			{
				path: 'cash-registers',
				element: (
					<RequireAdmin>
						<Navigate to='/products' replace />
					</RequireAdmin>
				),
				lazy: async () => {
					const { default: Component } =
						await import('../pages/cash/CashRegistersPage');
					return { Component };
				},
			},
			{
				path: 'cash',
				lazy: async () => {
					const { default: Component } = await import('../pages/cash/CashPage');
					return { Component };
				},
			},
			{
				path: 'cash/movements',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/cash/CashMovementsPage');
					return { Component };
				},
			},
			{
				path: 'cash/cash-count',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/cash/CashCountPage');
					return { Component };
				},
			},
			{
				path: 'cash/refunds',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/refunds/RefundsPage');
					return { Component };
				},
			},
			{
				path: 'cash/history',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/cash/CashHistoryPage');
					return { Component };
				},
			},
			{
				path: 'cash/daily-summary',
				lazy: async () => {
					const { default: Component } =
						await import('../pages/cash/CashDailySummaryPage');
					return { Component };
				},
			},
			{
				path: 'users',
				element: (
					<RequireAdmin>
						<Navigate to='/products' replace />
					</RequireAdmin>
				),
				lazy: async () => {
					const { default: Component } =
						await import('../pages/users/UsersPage');
					return { Component };
				},
			},
		],
	},
	{
		path: '*',
		element: <Navigate to='/login' replace />,
	},
]);
