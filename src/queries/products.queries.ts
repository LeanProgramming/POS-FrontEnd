import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import {
	createProduct,
	deleteProduct,
	getProductById,
	getProducts,
	searchProducts,
	updateProduct,
} from '../services/product.service';
import type {
	ICreateProductPayload,
	TUpdateProductPayload,
} from '../types/product.type';

export const useGetProducts = () =>
	useQuery({
		queryKey: queryKeys.products.all(),
		queryFn: getProducts,
	});

export const useGetProductById = (id: string) =>
	useQuery({
		queryKey: queryKeys.products.detail(id),
		queryFn: () => getProductById(id),
		enabled: !!id,
	});

export const useProductSearch = (query: string) =>
	useQuery({
		queryKey: queryKeys.products.search(query),
		queryFn: () => searchProducts(query),
		enabled: query.trim().length > 0,
		staleTime: 1000 * 15, // búsquedas se vuelven stale más rápido
	});

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICreateProductPayload) => createProduct(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: TUpdateProductPayload;
		}) => updateProduct(id, payload),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.products.detail(id),
			});
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
		},
	});
};
