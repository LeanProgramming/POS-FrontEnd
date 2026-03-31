import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { createSale, getSaleById, getSales } from '../services/sale.service';
import { usePOSStore } from '../store/usePOSStore';
import type { ICreateSalePayload } from '../types/sales.type';

export const useGetSales = () =>
	useQuery({
		queryKey: queryKeys.sales.all(),
		queryFn: getSales,
	});

export const useGetSaleById = (id: string) =>
	useQuery({
		queryKey: queryKeys.sales.detail(id),
		queryFn: () => getSaleById(id),
		enabled: !!id,
	});

export const useCreateSale = () => {
	const queryClient = useQueryClient();
	const clearCart = usePOSStore((s) => s.clearCart);

	return useMutation({
		mutationFn: (payload: ICreateSalePayload) => createSale(payload),
		onSuccess: () => {
			// Invalida ventas y estado de caja (el monto cambia con cada venta)
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
			queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() });
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
			clearCart();
		},
	});
};
