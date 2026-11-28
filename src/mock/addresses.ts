import type { ShippingAddress } from '@/types/address';

export const initialAddresses: ShippingAddress[] = [
    {
        id: 1,
        name: 'Nhật Quân',
        phone: '0912345678',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detail: '123 Nguyễn Huệ',
        note: '',
        isDefault: true,
    },
    {
        id: 2,
        name: 'Nhật Quân',
        phone: '0987654321',
        province: 'TP. Hồ Chí Minh',
        district: 'Thành phố Thủ Đức',
        ward: 'Phường Thảo Điền',
        detail: '456 Đường số 2',
        note: 'Giao hàng giờ hành chính',
        isDefault: false,
    },
];
