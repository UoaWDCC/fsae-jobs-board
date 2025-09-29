import { Member } from '@/models/member.model';

export const useValidateEmail = () => {
  const validate = (data: Partial<Member> | null) => {
    if (!data) return { valid: false, message: 'No data provided' };

    if (!data.email || data.email.trim() === '') {
      return { valid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {valid: false, message: 'Invalid email format'};
    }

    return { valid: true, message: '' };
  };

  return { validate };
};
