import api from '../api/api';
import { handleApiError } from '../api/errors';
import type {
	ICreateProductPayload,
	IProduct,
	TUpdateProductPayload,
} from '../types/product.type';

export const getProducts = async (): Promise<IProduct[]> => {
	try {
		const { data } = await api.get<IProduct[]>('/products');

		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getProductById = async (id: string): Promise<IProduct> => {
	try {
		const res = await api.get<IProduct>(`/products/${id}`);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

/**
 * Búsqueda en tiempo real para el POS.
 * Busca por nombre, SKU o código de barras.
 */
export const searchProducts = async (query: string): Promise<IProduct[]> => {
	try {
		const res = await api.get<IProduct[]>('/products/search', {
			params: { q: query },
		});
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createProduct = async (
	payload: ICreateProductPayload,
): Promise<IProduct> => {
	try {
		const res = await api.post<IProduct>('/products/', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateProduct = async (
	id: string,
	payload: TUpdateProductPayload,
): Promise<IProduct> => {
	try {
		const res = await api.put<IProduct>(`/products/${id}`, payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteProduct = async (id: string): Promise<void> => {
	try {
		await api.delete(`/products/${id}`);
	} catch (error) {
		return handleApiError(error);
	}
};
