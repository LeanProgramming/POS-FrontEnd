import axios from 'axios';

export class ApiError extends Error {
	status: number;
	code: string;

	constructor(message: string, status: number, code = 'UNKNOWN_ERROR') {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
	}
}

const HTTP_MESSAGES: Record<number, string> = {
	400: 'Datos inválidos. Revisá los campos e intentá de nuevo.',
	401: 'No autorizado. Iniciá sesión nuevamente.',
	403: 'No tenés permisos para realizar esta acción.',
	404: 'El recurso solicitado no existe.',
	409: 'Ya existe un registro con esos datos.',
	422: 'Los datos enviados no son válidos.',
	500: 'Error interno del servidor. Intentá más tarde.',
	503: 'Servicio no disponible. Intentá más tarde.',
};

export const handleApiError = (error: unknown): never => {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status ?? 0;
		const serverMessage =
			error.response?.data.detail ?? error.response?.data.message;
		const code = error.response?.data.code ?? `HTTP_${status}`;

		if (!error.response) {
			throw new ApiError(
				'No se pudo conectar con el servidor. Verificá tu conexión.',
				0,
				'NETWORK_ERROR',
			);
		}

		const message =
			serverMessage ?? HTTP_MESSAGES[status] ?? `Error inesperado ${status}`;
		throw new ApiError(message, status, code);
	}

	if (error instanceof Error) {
		throw new ApiError(error.message, 0, 'CLIENT_ERROR');
	}

	throw new ApiError('Ocurrió un error inesperado', 0, 'UNKNOWN_ERROR');
};

export const getErrorMessage = (error: unknown): string => {
	if (error instanceof ApiError) return error.message;
	if (error instanceof Error) return error.message;

	return 'Ocurrió un error inesperado.';
};

export const isNotFound = (error: unknown): boolean => {
	return error instanceof ApiError && error.status === 404;
};

export const isUnauthorized = (error: unknown): boolean => {
	return error instanceof ApiError && error.status === 401;
};
