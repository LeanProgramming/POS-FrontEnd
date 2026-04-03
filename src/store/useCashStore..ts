import { devtools, persist } from 'zustand/middleware';
import type { ICashRegister } from '../types/cash.type';
import { create } from 'zustand';

interface ICashState {
	sessionId: string | null;
	cashRegisterSelected: ICashRegister | null;
	setCashRegister: (cashRegister: ICashRegister) => void;
	setSessionId: (sessionId: string | null) => void;
}

export const useCashStore = create<ICashState>()(
	devtools(
		persist(
			(set) => ({
				sessionId: null,
				cashRegisterSelected: null,

				setSessionId: (sessionId: string | null) =>
					set({ sessionId: sessionId }, false, 'cash-store/setSessionId'),
				setCashRegister: (data: ICashRegister) =>
					set(
						{ cashRegisterSelected: data },
						false,
						'cash-store/setCashRegister',
					),
			}),
			{
				name: 'cash-store',
				partialize: (state) => ({
					sessionId: state.sessionId,
					cashRegisterSelected: state.cashRegisterSelected,
				}),
			},
		),
		{ name: 'cash-store' },
	),
);
