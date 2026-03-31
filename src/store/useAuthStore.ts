import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { IAuthResponse, IAuthState } from '../types/auth.type';

export const useAuthStore = create<IAuthState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				token: null,
				isAuthenticated: false,

				setAuth: (data: IAuthResponse) =>
					set(
						{
							user: data.user,
							token: data.access_token,
							isAuthenticated: true,
						},
						false,
						'auth-store/setAuth',
					),
				logout: () => set({ user: null, token: null, isAuthenticated: false }),
			}),
			{
				name: 'pos-auth',
				partialize: (state) => ({
					user: state.user,
					token: state.token,
					isAuthenticated: state.isAuthenticated,
				}),
			},
		),
		{ name: 'auth-store' },
	),
);
