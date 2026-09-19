import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { createUser, getUsers, userMe, updateUser } from '../services/user.service';
import type { ICreateUserPayload, IUpdateUserPayload } from '../types/users.type';

export const useUserMe = () =>
	useQuery({
		queryKey: queryKeys.auth.me(),
		queryFn: userMe,
	});
export const useGetUsers = () =>
	useQuery({
		queryKey: queryKeys.users.all(),
		queryFn: getUsers,
	});

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ICreateUserPayload) => createUser(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
		},
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, payload }: { userId: string; payload: IUpdateUserPayload }) =>
			updateUser(userId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
		},
	});
};
