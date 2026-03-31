import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { createUser, getUsers, userMe } from '../services/user.service';
import type { ICreateUserPayload } from '../types/users.type';

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
