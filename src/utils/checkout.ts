import type { CheckoutDraft } from '@/types/checkout';

export function parseCheckoutDraft(value: unknown): CheckoutDraft {
    const draft = typeof value === 'object' && value !== null
        ? value as Record<string, unknown> : {};

    return {
        selectedAddressId: typeof draft.selectedAddressId === 'number' && Number.isSafeInteger(draft.selectedAddressId)
            ? draft.selectedAddressId : null,
        paymentMethod: draft.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cod',
        note: typeof draft.note === 'string' ? draft.note.slice(0, 500) : '',
    };
}
