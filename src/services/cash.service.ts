import api from '../api/api';
import { handleApiError } from '../api/errors';
import { useAuthStore } from '../store/useAuthStore';
import type {
	ICashBalance,
	ICashMovement,
	ICashMovementPayload,
	ICashRegister,
	ICashSessionsResponse,
	ICashStatus,
	ICloseCashPayload,
	IDailySummary,
	IOpenCashPayload,
	ICashSessionDetail,
} from '../types/cash.type';

export const getCashStatus = async (): Promise<ICashStatus> => {
	try {
		const res = await api.get<ICashStatus>('/cash/status');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const openCash = async (
	payload: IOpenCashPayload,
): Promise<ICashStatus> => {
	try {
		const res = await api.post<ICashStatus>('/cash/open', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const closeCash = async (
	payload: ICloseCashPayload,
): Promise<ICashStatus> => {
	try {
		const res = await api.post<ICashStatus>('/cash/close', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashMovements = async (params: {
	session_id: string;
	type?: string;
	start_date?: string;
	end_date?: string;
}): Promise<ICashMovement[]> => {
	try {
		const res = await api.get<ICashMovement[]>('/cash/movements', { params });
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashRegisters = async (): Promise<ICashRegister[]> => {
	try {
		const res = await api.get<ICashRegister[]>('/cash/registers');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCashRegister = async (payload: {
	name: string;
}): Promise<ICashRegister> => {
	try {
		const res = await api.post<ICashRegister>('/cash/register', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateCashRegister = async (payload: {
	name: string;
}): Promise<ICashRegister> => {
	try {
		const res = await api.put<ICashRegister>('/cash/register', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const toggleCashRegisterState = async (payload: {
	active: boolean;
}): Promise<ICashRegister> => {
	try {
		const res = await api.post<ICashRegister>('/cash/register/toggle', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCashIn = async (
	payload: ICashMovementPayload,
): Promise<ICashMovement> => {
	try {
		const res = await api.post<ICashMovement>('/cash/cash-in', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCashOut = async (
	payload: ICashMovementPayload,
): Promise<ICashMovement> => {
	try {
		const res = await api.post<ICashMovement>('/cash/cash-out', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashBalance = async (params: {
	session_id: string;
}): Promise<ICashBalance> => {
	try {
		const res = await api.get<ICashBalance>('/cash/balance', { params });
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashSessions = async (params?: {
	register_id?: string;
	cashier_id?: string;
	is_open?: boolean;
	skip?: number;
	limit?: number;
}): Promise<ICashSessionsResponse> => {
	try {
		const res = await api.get<ICashSessionsResponse>('/cash/sessions', {
			params,
		});
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getDailySummary = async (params: {
	session_id: string;
}): Promise<IDailySummary> => {
	try {
		const res = await api.get<IDailySummary>('/cash/daily-summary', { params });
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashSessionDetail = async (params: {
	session_id: string;
}): Promise<ICashSessionDetail | undefined> => {
	try {
		const res = await api.get<ICashSessionDetail>(
			`/cash/sessions/${params.session_id}`,
		);
		return res.data;
	} catch (error) {
		handleApiError(error);
	}
};

export const exportDailySummaryCsv = async (
	sessionId: string,
): Promise<void> => {
	const token = useAuthStore.getState().token;
	const url = `${import.meta.env.VITE_API_URL}/cash/daily-summary/${sessionId}/export?format=csv`;

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!res.ok) throw new Error('Error al exportar CSV');

	const blob = await res.blob();
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = `corte_z_${sessionId}.csv`;
	a.click();
	URL.revokeObjectURL(a.href);
};
