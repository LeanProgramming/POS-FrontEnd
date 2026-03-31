import api from '../api/api';
import { handleApiError } from '../api/errors';
import type {
	ICategory,
	ICreateCategoryPayload,
	TUpdateCategoryPayload,
} from '../types/categories.type';

export const getCategories = async (): Promise<ICategory[]> => {
	try {
		const res = await api.get<ICategory[]>('/categories/');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCategory = async (
	payload: ICreateCategoryPayload,
): Promise<ICategory> => {
	try {
		const res = await api.post<ICategory>('/categories/', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateCategory = async (
	id: string,
	payload: TUpdateCategoryPayload,
): Promise<ICategory> => {
	try {
		const res = await api.put<ICategory>(`/categories/${id}`, payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteCategory = async (id: string): Promise<void> => {
	try {
		await api.delete(`/categories/${id}`);
	} catch (error) {
		return handleApiError(error);
	}
};
