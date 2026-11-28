import { useEffect, useState } from 'react';
import type { AddressProvince, AddressWard } from '@/types/address';
import { getAddressProvinces, getAddressWards } from '@/utils/addressApi';

type ProvinceState = {
    items: AddressProvince[];
    loading: boolean;
    error: string;
};

type WardState = {
    provinceCode: string;
    items: AddressWard[];
    loading: boolean;
    error: string;
};

export function useAddressLocations(enabled: boolean, provinceCode: string) {
    const [provinceState, setProvinceState] = useState<ProvinceState>({ items: [], loading: true, error: '' });
    const [wardState, setWardState] = useState<WardState>({ provinceCode: '', items: [], loading: false, error: '' });
    const [provinceAttempt, setProvinceAttempt] = useState(0);
    const [wardAttempt, setWardAttempt] = useState(0);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const controller = new AbortController();
        let active = true;
        const timeout = window.setTimeout(() => controller.abort(), 12000);
        setProvinceState({ items: [], loading: true, error: '' });

        getAddressProvinces(controller.signal)
            .then((items) => {
                if (active) {
                    setProvinceState({ items, loading: false, error: '' });
                }
            })
            .catch(() => {
                if (active) {
                    setProvinceState({ items: [], loading: false, error: 'Không tải được tỉnh / thành phố. Vui lòng thử lại.' });
                }
            })
            .finally(() => window.clearTimeout(timeout));

        return () => {
            active = false;
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, [enabled, provinceAttempt]);

    useEffect(() => {
        if (!enabled || !provinceCode) {
            return;
        }

        const controller = new AbortController();
        let active = true;
        const timeout = window.setTimeout(() => controller.abort(), 12000);
        setWardState({ provinceCode, items: [], loading: true, error: '' });

        getAddressWards(provinceCode, controller.signal)
            .then((items) => {
                if (active) {
                    setWardState({ provinceCode, items, loading: false, error: '' });
                }
            })
            .catch(() => {
                if (active) {
                    setWardState({ provinceCode, items: [], loading: false, error: 'Không tải được phường / xã. Vui lòng thử lại.' });
                }
            })
            .finally(() => window.clearTimeout(timeout));

        return () => {
            active = false;
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, [enabled, provinceCode, wardAttempt]);

    const wardsMatchProvince = wardState.provinceCode === provinceCode;

    return {
        provinces: provinceState.items,
        provincesLoading: enabled && provinceState.loading,
        provincesError: provinceState.error,
        wards: wardsMatchProvince ? wardState.items : [],
        wardsLoading: enabled && Boolean(provinceCode) && (!wardsMatchProvince || wardState.loading),
        wardsError: wardsMatchProvince ? wardState.error : '',
        retryProvinces: () => setProvinceAttempt((previous) => previous + 1),
        retryWards: () => setWardAttempt((previous) => previous + 1),
    };
}
