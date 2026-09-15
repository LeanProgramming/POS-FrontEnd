export interface IRefundItem {
	product_id: string;
	name: string;
	sku: string;
	quantity: number;
	amount: number;
}

export interface ICreateRefundPayload {
	sale_id: string;
	items: { product_id: string; quantity: number }[];
	reason: string;
}

export interface IRefund {
	_id: string;
	sale_id: string;
	items: IRefundItem[];
	total: number;
	reason: string;
	created_at: string;
}
