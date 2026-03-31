import api from '../api/api';
import { handleApiError } from '../api/errors';
import type { IAuthResponse, ILoginCredentials } from '../types/auth.type';

export const loginUser = async (
	credentials: ILoginCredentials,
): Promise<IAuthResponse> => {
	try {
		const res = await api.post<IAuthResponse>('/auth/login', credentials, {
			headers: { 'Content-Type': 'application/json' },
		});

		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const logoutUser = async (): Promise<void> => {
	try {
		await api.post('/auth/logout');
	} catch (error) {
		handleApiError(error);
	}
};
