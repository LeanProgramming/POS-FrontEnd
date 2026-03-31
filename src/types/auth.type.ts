export interface ILoginCredentials {
	username: string;
	password: string;
}

export const UserRole = {
	ADMIN: 'admin',
	CASHIER: 'cashier',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IAuthUser {
	_id: string;
	username: string;
	role: TUserRole;
}

export interface IAuthResponse {
	access_token: string;
	token_type: string;
	user: IAuthUser;
}

export interface IAuthState {
	user: IAuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	setAuth: (data: IAuthResponse) => void;
	logout: () => void;
}
