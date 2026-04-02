// Query keys centralizadas para toda la app.
// Usar estas constantes en useQuery e invalidateQueries
// garantiza que las claves sean consistentes y refactorizables.

export const queryKeys = {
	// Auth
	auth: {
		me: () => ['auth', 'me'] as const,
	},

	// Users
	users: {
		all: () => ['users'] as const,
		detail: (id: string) => ['users', id] as const,
	},

	// Categories
	categories: {
		all: () => ['categories'] as const,
		detail: (id: string) => ['categories', id] as const,
	},

	// Products
	products: {
		all: () => ['products'] as const,
		detail: (id: string) => ['products', id] as const,
		search: (query: string) => ['products', 'search', query] as const,
	},

	// Sales
	sales: {
		all: () => ['sales'] as const,
		detail: (id: string) => ['sales', id] as const,
	},

	// Refunds
	refunds: {
		all: () => ['refunds'] as const,
		detail: (id: string) => ['refunds', id] as const,
	},

	// Cash
	cash: {
		status: () => ['cash', 'status'] as const,
		movements: () => ['cash', 'movements'] as const,
		registers: () => ['cash', 'registers'] as const,
	},
} as const;
