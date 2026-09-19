import api from '../api/api';
import { handleApiError } from '../api/errors';
import type { IAuthResponse } from '../types/auth.type';
import type { ICreateUserPayload, IUpdateUserPayload, IUser } from '../types/users.type';

export const userMe = async (): Promise<IAuthResponse> => {
	try {
		const res = await api.get<IAuthResponse>('/users/me');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getUsers = async (): Promise<IUser[]> => {
	try {
		const res = await api.get<IUser[]>('/users/');
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createUser = async (
	payload: ICreateUserPayload,
): Promise<IUser> => {
	try {
		const res = await api.post<IUser>('/users/', payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateUser = async (
	userId: string,
	payload: IUpdateUserPayload,
): Promise<IUser> => {
	try {
		const res = await api.put<IUser>(`/users/${userId}`, payload);
		return res.data;
	} catch (error) {
		return handleApiError(error);
	}
};
