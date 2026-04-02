import api from '../api/api';
import { handleApiError } from '../api/errors';
import type {
	ICashMovement,
	ICashRegister,
	ICashStatus,
	ICloseCashPayload,
	IOpenCashPayload,
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
