import { initialAddresses } from '@/mock/addresses';
import type { ShippingAddress } from '@/types/address';

export const addressesStorageKey = 'verde_addresses';

function isShippingAddress(value: unknown): value is ShippingAddress {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const address = value as Record<string, unknown>;

    return typeof address.id === 'number' && Number.isSafeInteger(address.id)
        && typeof address.name === 'string' && address.name.trim().length > 0
        && typeof address.phone === 'string' && /^[0-9]{10,11}$/.test(address.phone)
        && typeof address.province === 'string' && address.province.trim().length > 0
        && typeof address.ward === 'string' && address.ward.trim().length > 0
        && typeof address.district === 'string'
        && typeof address.detail === 'string' && address.detail.trim().length > 0
        && typeof address.note === 'string'
        && typeof address.isDefault === 'boolean'
        && (address.provinceCode === undefined || typeof address.provinceCode === 'string')
        && (address.wardCode === undefined || typeof address.wardCode === 'string');
}

export function loadSavedAddresses(): ShippingAddress[] {
    const stored = window.localStorage.getItem(addressesStorageKey);

    if (stored === null) {
        return initialAddresses.map((address) => ({ ...address }));
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed) || !parsed.every(isShippingAddress)) {
        throw new Error('Không thể đọc địa chỉ đã lưu. Vui lòng kiểm tra lại sổ địa chỉ.');
    }

    return parsed;
}

export function formatShippingAddress(address: ShippingAddress): string {
    return [address.detail, address.ward, address.district, address.province].filter(Boolean).join(', ');
}
