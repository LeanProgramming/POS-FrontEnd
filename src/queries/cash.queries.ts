import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import {
	closeCash,
	createCashIn,
	createCashOut,
	createCashRegister,
	getCashBalance,
	getCashMovements,
	getCashRegisters,
	getCashStatus,
	openCash,
	toggleCashRegisterState,
	updateCashRegister,
} from '../services/cash.service';
import type {
	ICashMovementPayload,
	ICloseCashPayload,
	IOpenCashPayload,
} from '../types/cash.type';
import { useCashStore } from '../store/useCashStore.';

export const useGetCashStatus = () =>
	useQuery({
		queryKey: queryKeys.cash.status(),
		queryFn: getCashStatus,
		refetchInterval: 1000 * 60, // refresca el estado de caja cada 1 min
	});

export const useGetCashRegisters = () =>
	useQuery({ queryKey: queryKeys.cash.registers(), queryFn: getCashRegisters });

export const useCashMovements = () => {
	const { sessionId } = useCashStore();
	return useQuery({
		queryKey: [...queryKeys.cash.movements(), sessionId],
		queryFn: () => getCashMovements({ session_id: sessionId! }),
		enabled: Boolean(sessionId),
	});
};

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
		mutationFn: (params: ICloseCashPayload) => closeCash(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.movements() });
		},
	});
};

export const useCreateCashRegister = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: { name: string }) => createCashRegister(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.registers() });
		},
	});
};

export const useUpdateCashRegister = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: { _id: string; name: string }) =>
			updateCashRegister(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.registers() });
		},
	});
};

export const useToggleCashRegisterState = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: { active: boolean }) =>
			toggleCashRegisterState(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.registers() });
		},
	});
};

export const useCashIn = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICashMovementPayload) => createCashIn(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.movements() });
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
		},
	});
};

export const useCashOut = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICashMovementPayload) => createCashOut(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.movements() });
			queryClient.invalidateQueries({ queryKey: queryKeys.cash.status() });
		},
	});
};

export const useCashBalance = () => {
	const { sessionId } = useCashStore();
	return useQuery({
		queryKey: [...queryKeys.cash.balance(), sessionId],
		queryFn: () => getCashBalance({ session_id: sessionId! }),
		enabled: Boolean(sessionId),
	});
};
