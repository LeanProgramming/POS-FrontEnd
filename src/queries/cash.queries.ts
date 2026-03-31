import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import {
	closeCash,
	getCashMovements,
	getCashStatus,
	openCash,
} from '../services/cash.service';
import type { IOpenCashPayload } from '../types/cash.type';

export const useGetCashStatus = () =>
	useQuery({
		queryKey: queryKeys.cash.status(),
		queryFn: getCashStatus,
		refetchInterval: 1000 * 60, // refresca el estado de caja cada 1 min
	});

export const useCashMovements = () =>
	useQuery({
		queryKey: queryKeys.cash.movements(),
		queryFn: getCashMovements,
	});

export const useOpenCash = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: IOpenCashPayload) => openCash(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
		},
	});
};

export const useCloseCash = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => closeCash(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.movements() });
		},
	});
};
