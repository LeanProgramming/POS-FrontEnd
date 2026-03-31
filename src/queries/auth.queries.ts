import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { loginUser } from '../services/auth.service';
import type { ILoginCredentials } from '../types/auth.type';

export const useLogin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ILoginCredentials) => loginUser(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
		},
	});
};
