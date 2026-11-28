import type { OrderPaymentMethod } from '@/types/order';

export type CheckoutDraft = {
    selectedAddressId: number | null;
    paymentMethod: OrderPaymentMethod;
    note: string;
};
