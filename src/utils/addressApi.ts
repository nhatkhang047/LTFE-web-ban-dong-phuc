import type { AddressProvince, AddressWard } from '@/types/address';

const addressApiUrl = 'https://provinces.open-api.vn/api/v2';
let cachedProvinces: AddressProvince[] | null = null;
const cachedWards = new Map<string, AddressWard[]>();

function isProvince(value: unknown): value is AddressProvince {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const province = value as Record<string, unknown>;

    return typeof province.code === 'number'
        && Number.isSafeInteger(province.code)
        && province.code > 0
        && typeof province.name === 'string'
        && province.name.trim().length > 0;
}

function isWard(value: unknown): value is AddressWard {
    return isProvince(value)
        && 'province_code' in value
        && typeof value.province_code === 'number'
        && Number.isSafeInteger(value.province_code)
        && value.province_code > 0;
}

async function fetchAddressData(path: string, signal: AbortSignal): Promise<unknown> {
    const response = await fetch(`${addressApiUrl}${path}`, { signal });

    if (!response.ok) {
        throw new Error('Không thể tải danh sách địa chỉ.');
    }

    return response.json();
}

export async function getAddressProvinces(signal: AbortSignal): Promise<AddressProvince[]> {
    if (cachedProvinces) {
        return cachedProvinces;
    }

    const data = await fetchAddressData('/p/', signal);

    if (!Array.isArray(data) || data.length === 0 || !data.every(isProvince)) {
        throw new Error('Danh sách tỉnh / thành phố không hợp lệ.');
    }

    cachedProvinces = [...data].sort((first, second) => first.name.localeCompare(second.name, 'vi'));
    return cachedProvinces;
}

export async function getAddressWards(provinceCode: string, signal: AbortSignal): Promise<AddressWard[]> {
    if (!/^\d+$/.test(provinceCode) || !Number.isSafeInteger(Number(provinceCode)) || Number(provinceCode) < 1) {
        throw new Error('Tỉnh / thành phố không hợp lệ.');
    }

    const cached = cachedWards.get(provinceCode);

    if (cached) {
        return cached;
    }

    const data = await fetchAddressData(`/w/?province=${encodeURIComponent(provinceCode)}`, signal);

    if (!Array.isArray(data) || data.length === 0
        || !data.every((ward) => isWard(ward) && ward.province_code === Number(provinceCode))) {
        throw new Error('Danh sách phường / xã không hợp lệ.');
    }

    const wards = [...data].sort((first, second) => first.name.localeCompare(second.name, 'vi'));
    cachedWards.set(provinceCode, wards);
    return wards;
}
