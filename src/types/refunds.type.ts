export interface IRefundItem {
	product_id: string;
	quantity: number;
}

export interface ICreateRefundPayload {
	sale_id: string;
	items: IRefundItem[];
	reason: string;
}

export interface IRefund {
	_id: string;
	sale_id: string;
	items: IRefundItem[];
	reason: string;
	created_at: string;
}
