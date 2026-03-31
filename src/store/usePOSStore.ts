import { create } from 'zustand';
import type { IPayment, ISaleItem, TPaymentMethod } from '../types/sales.type';
import type { IProduct } from '../types/product.type';
import { devtools } from 'zustand/middleware';

interface ICartItem extends ISaleItem {
	subtotal: number;
}

export const calcTotal = (items: ICartItem[]): number => {
	return items.reduce((acc, i) => acc + i.subtotal, 0);
};

interface IPOSState {
	// Carrito
	items: ICartItem[];
	payments: IPayment[];
	total: number;

	// Acciones carrito
	addItem: (product: IProduct) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;

	// Acciones pagos
	addPayment: (method: TPaymentMethod, amount: number) => void;
	removePayment: (index: number) => void;
	clearPayments: () => void;

	// Computed helpers
	totalPaid: () => number;
	remainingAmount: () => number;
}

export const usePOSStore = create<IPOSState>()(
	devtools(
		(set, get) => ({
			items: [],
			payments: [],
			total: 0,
			//Manejo de carrito
			addItem: (product: IProduct) => {
				set(
					(state) => {
						const existing = state.items.find(
							(i) => i.product_id === product._id,
						);

						const updatedItems = existing
							? state.items.map((i) =>
									i.product_id === product._id
										? {
												...i,
												quantity: i.quantity + 1,
												subtotal: (i.quantity + 1) * i.price,
											}
										: i,
								)
							: [
									...state.items,
									{
										product_id: product._id,
										name: product.name,
										quantity: 1,
										price: product.price,
										subtotal: product.price,
									},
								];
						console.log({ updatedItems });

						return {
							items: updatedItems,
							total: calcTotal(updatedItems),
						};
					},
					false,
					'cart-store/addItem',
				);
			},
			removeItem: (productId: string) => {
				set(
					(state) => {
						const updatedItems = state.items.filter(
							(i) => i.product_id !== productId,
						);
						return { items: updatedItems, total: calcTotal(updatedItems) };
					},
					false,
					'cart-store/removeItem',
				);
			},
			updateQuantity: (productId: string, quantity: number) => {
				if (quantity <= 0) {
					get().removeItem(productId);
					return;
				}
				set(
					(state) => {
						const updatedItems = state.items.map((i) =>
							i.product_id === productId
								? { ...i, quantity, subtotal: quantity * i.price }
								: i,
						);
						return { items: updatedItems, total: calcTotal(updatedItems) };
					},
					false,
					'cart-store/updateQuantity',
				);
			},
			clearCart: () =>
				set(
					{ items: [], payments: [], total: 0 },
					false,
					'cart-store/clearCart',
				),
			//Manejo de pagos
			addPayment: (method: TPaymentMethod, amount: number) => {
				set(
					(state) => ({
						payments: [...state.payments, { method, amount }],
					}),
					false,
					'cart-store/addPayment',
				);
			},

			removePayment: (index: number) => {
				set(
					(state) => ({
						payments: state.payments.filter((_, i) => i !== index),
					}),
					false,
					'cart-store/removePayment',
				);
			},

			clearPayments: () =>
				set({ payments: [] }, false, 'cart-store/clearPayments'),
			//Computar ventas
			totalPaid: () => get().payments.reduce((acc, p) => acc + p.amount, 0),

			remainingAmount: () => {
				const remaining = get().total - get().totalPaid();
				return remaining > 0 ? remaining : 0;
			},
		}),
		{ name: 'cart-store' },
	),
);
