import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { createRefund, getRefunds } from '../services/refund.service';
import type { ICreateRefundPayload } from '../types/refunds.type';

export const useGetRefunds = () =>
	useQuery({
		queryKey: queryKeys.refunds.all(),
		queryFn: getRefunds,
	});

export const useCreateRefund = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICreateRefundPayload) => createRefund(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.refunds.all() });
			queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() });
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
		},
	});
};
