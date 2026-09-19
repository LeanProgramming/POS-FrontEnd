import type { TUserRole } from './auth.type';

export interface IUser {
	_id: string;
	username: string;
	role: TUserRole;
	first_name: string;
	last_name: string;
}

export interface ICreateUserPayload {
	username: string;
	password: string;
	role: TUserRole;
	first_name: string;
	last_name: string;
}

export interface IUpdateUserPayload {
	first_name?: string;
	last_name?: string;
	password?: string;
}
