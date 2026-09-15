import api from '../api/api';
import { handleApiError } from '../api/errors';
import type { ICreateSalePayload, ISale } from '../types/sales.type';

export const getSales = async (): Promise<ISale[]> => {
	try {
		const res = await api.get<ISale[]>('/sales/');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getSaleById = async (id: string): Promise<ISale> => {
	try {
		const res = await api.get<ISale>(`/sales/${id}`);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createSale = async (
	payload: ICreateSalePayload,
): Promise<ISale> => {
	try {
		const res = await api.post<ISale>('/sales/', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteSale = async (id: string): Promise<void> => {
	try {
		await api.delete(`/sales/${id}`);
	} catch (error) {
		return handleApiError(error);
	}
};
