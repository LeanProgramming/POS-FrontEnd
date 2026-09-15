export const PaymentMethod = {
	CASH: 'cash',
	TRANSFER: 'transfer',
	QR: 'qr',
	CARD: 'card',
} as const;

export type TPaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PAYMENT_METHODS: { value: TPaymentMethod; label: string }[] = [
	{ value: 'cash', label: 'Efectivo' },
	{ value: 'transfer', label: 'Transferencia' },
	{ value: 'qr', label: 'QR' },
	{ value: 'card', label: 'Tarjeta' },
];

export interface ISaleItem {
	product_id: string;
	name: string;
	quantity: number;
	refunded_quantity: number;
	price: number;
}

export interface IPayment {
	method: TPaymentMethod;
	amount: number;
}

export interface ICreateSalePayload {
	items: ISaleItem[];
	payment_methods: IPayment[];
	session_id: string;
}

export interface ISale {
	_id: string;
	items: ISaleItem[];
	payment_methods: IPayment[];
	total: number;
	created_at: string;
}
