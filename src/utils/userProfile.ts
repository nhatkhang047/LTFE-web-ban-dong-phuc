import type { UserProfile } from '@/types/userProfile';

export const userProfileStorageKey = 'verde-user-profile';

export function createEmptyUserProfile(): UserProfile {
  return {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    company: '',
    address: '',
  };
}

export function normalizeUserProfile(profile: UserProfile): UserProfile {
  return {
    fullName: profile.fullName.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    company: profile.company.trim(),
    address: profile.address.trim(),
  };
}

export function parseStoredUserProfile(value: string | null): UserProfile {
  const emptyProfile = createEmptyUserProfile();

  if (!value) {
    return emptyProfile;
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (typeof parsedValue !== 'object' || parsedValue === null || Array.isArray(parsedValue)) {
      return emptyProfile;
    }

    const storedProfile = parsedValue as Record<string, unknown>;
    const gender = storedProfile.gender;

    return normalizeUserProfile({
      fullName: typeof storedProfile.fullName === 'string' ? storedProfile.fullName : '',
      email: typeof storedProfile.email === 'string' ? storedProfile.email : '',
      phone: typeof storedProfile.phone === 'string' ? storedProfile.phone : '',
      dateOfBirth: typeof storedProfile.dateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(storedProfile.dateOfBirth)
        ? storedProfile.dateOfBirth : '',
      gender: gender === 'male' || gender === 'female' || gender === 'other' ? gender : '',
      company: typeof storedProfile.company === 'string' ? storedProfile.company : '',
      address: typeof storedProfile.address === 'string' ? storedProfile.address : '',
    });
  } catch {
    return emptyProfile;
  }
}

export function getUserInitials(fullName: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0].slice(0, 1).toLocaleUpperCase('vi-VN');
  }

  return `${words[0].slice(0, 1)}${words[words.length - 1].slice(0, 1)}`.toLocaleUpperCase('vi-VN');
}
