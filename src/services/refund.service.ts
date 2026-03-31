import api from '../api/api';
import { handleApiError } from '../api/errors';
import type { ICreateRefundPayload, IRefund } from '../types/refunds.type';

export const getRefunds = async (): Promise<IRefund[]> => {
	try {
		const res = await api.get<IRefund[]>('/refunds/');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createRefund = async (
	payload: ICreateRefundPayload,
): Promise<IRefund> => {
	try {
		const res = await api.post<IRefund>('/refunds/', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};
