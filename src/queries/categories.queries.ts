import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import {
	createCategory,
	deleteCategory,
	getCategories,
	updateCategory,
} from '../services/category.service';
import type {
	ICreateCategoryPayload,
	TUpdateCategoryPayload,
} from '../types/categories.type';

export const useGetCategories = () =>
	useQuery({
		queryKey: queryKeys.categories.all(),
		queryFn: getCategories,
	});

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICreateCategoryPayload) => createCategory(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: TUpdateCategoryPayload;
		}) => updateCategory(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
		},
	});
};
