import type { TUserRole } from './auth.type';

export interface IUser {
	_id: string;
	username: string;
	role: TUserRole;
}

export interface ICreateUserPayload {
	username: string;
	password: string;
	role: TUserRole;
}
