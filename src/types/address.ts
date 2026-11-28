export type AddressProvince = {
    code: number;
    name: string;
};

export type AddressWard = {
    code: number;
    name: string;
    province_code: number;
};

export type ShippingAddress = {
    id: number;
    name: string;
    phone: string;
    province: string;
    provinceCode?: string;
    district: string;
    ward: string;
    wardCode?: string;
    detail: string;
    note: string;
    isDefault: boolean;
};
