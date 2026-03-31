import api from '../api/api';
import { handleApiError } from '../api/errors';
import type {
	ICashMovement,
	ICashStatus,
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

export const closeCash = async (): Promise<ICashStatus> => {
	try {
		const res = await api.post<ICashStatus>('/cash/close');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCashMovements = async (): Promise<ICashMovement[]> => {
	try {
		const res = await api.get<ICashMovement[]>('/cash/movements');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};
