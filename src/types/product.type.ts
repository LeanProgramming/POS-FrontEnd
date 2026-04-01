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

export interface IProductResponse {
	data: IProduct[];
	total: number;
	page: number;
	limit: number;
	pages: number;
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
