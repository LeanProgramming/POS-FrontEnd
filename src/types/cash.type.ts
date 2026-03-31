export const CashMovementType = {
	INCOME: 'income',
	OUTCOME: 'outcome',
} as const;

export type TCashMovementType =
	(typeof CashMovementType)[keyof typeof CashMovementType];

export interface ICashStatus {
	isOpen: boolean;
	initialAmount: number;
	currentAmount: number;
	openedAt?: string;
}

export interface ICashMovement {
	_id: string;
	type: TCashMovementType;
	amount: number;
	description: string;
	created_at: string;
}

export interface IOpenCashPayload {
	initial_amount: number;
}
