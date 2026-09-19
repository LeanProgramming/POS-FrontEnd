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
	closing_transfer_balance: number;
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
	closing_transfer_balance: number | null;
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

export interface ICashBalance {
	session_id: string;
	expected_cash_balance: number;
	opening_balance: number;
	total_cash_sales: number;
	total_non_cash_sales: number;
	total_refunds: number;
	total_cash_in: number;
	total_cash_out: number;
}

export interface ICashSession {
	_id: string;
	register_id: string;
	cashier_id: string;
	opening_balance: number;
	closing_balance: number | null;
	closing_transfer_balance: number | null;
	is_open: boolean;
	opened_at: string;
	closed_at: string | null;
}

export interface ICashSessionsResponse {
	sessions: ICashSession[];
	total: number;
	skip: number;
	limit: number;
}

export interface IPaymentMethodSummary {
	method: string;
	label: string;
	total: number;
	count: number;
}

export interface IDailySummary {
	session_id: string;
	register_name: string;
	cashier_id: string;
	cashier_name: string;
	total_sales: number;
	total_refunds: number;
	net_sales: number;
	total_cash_in: number;
	total_cash_out: number;
	payment_methods: IPaymentMethodSummary[];
	opening_balance: number;
	expected_cash_balance: number;
	closing_balance: number | null;
	closing_transfer_balance: number | null;
	cash_difference: number | null;
	transfer_difference: number | null;
	opened_at: string;
	closed_at: string | null;
}

export interface ICashSessionDetail {
	session: ICashSession;
	movements: ICashMovement[];
}
