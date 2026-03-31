export interface IProduct {
	_id: string;
	name: string;
	sku: string;
	barcode?: string;
	price: number;
	cost: number;
	stock: number;
	category: string;
	isActive?: boolean;
}

export interface ICreateProductPayload {
	name: string;
	sku: string;
	barcode?: string;
	price: number;
	cost: number;
	stock: number;
	category: string;
}

export type TUpdateProductPayload = Partial<ICreateProductPayload>;
