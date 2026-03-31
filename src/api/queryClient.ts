import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './errors';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Reintentos solo en errores de red, no en errores HTTP del servidor
			retry: (failureCount, error) => {
				if (
					error instanceof ApiError &&
					error.status >= 400 &&
					error.status < 500
				) {
					return false; // 4xx: no reintentar
				}
				return failureCount < 2; // 5xx o red: hasta 2 reintentos
			},
			staleTime: 1000 * 30, // 30s antes de considerar datos stale
			gcTime: 1000 * 60 * 5, // 5min en caché tras desmontarse
			refetchOnWindowFocus: false, // En un POS la ventana no cambia de foco
		},
		mutations: {
			retry: false, // Las mutaciones nunca se reintentan automáticamente
		},
	},
});
