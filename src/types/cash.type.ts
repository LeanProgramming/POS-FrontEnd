export const CashMovementType = {
	OPENING: 'opening',
	SALE: 'sale',
	REFUND: 'refund',
	CASH_IN: 'cash_in',
	CASH_OUT: 'cash_out',
	CLOSING: 'closing',
} as const;

export type TCashMovementType =
	(typeof CashMovementType)[keyof typeof CashMovementType];

export interface ICashStatus {
	is_open: boolean;
	initial_balance: number;
	current_balance: number;
	session: ISession;
}

export interface ICashMovement {
	_id: string;
	type: TCashMovementType;
	amount: number;
	description: string;
	created_at: string;
}

export interface IOpenCashPayload {
	register_id: string;
	opening_balance: number;
}

export interface ICloseCashPayload {
	session_id: string;
	closing_balance: number;
}

export interface ICashRegister {
	_id: string;
	name: string;
	active: boolean;
}

export interface ISession {
	cashier_id: string;
	closed_at: string | null;
	closing_balance: number | null;
	is_open: boolean;
	opened_at: string;
	opening_balance: number;
	register_id: string;
	_id: string;
}

export interface ICashMovementPayload {
	session_id: string;
	amount: number;
	description?: string;
}
