export interface ICategory {
	_id: string;
	name: string;
	prefix: string;
}

export interface ICreateCategoryPayload {
	name: string;
	prefix: string;
}

export type TUpdateCategoryPayload = Partial<ICreateCategoryPayload>;
