import {MemberProfileDto} from '../dtos/member-profile.dto';

export function validateEmail(data: Partial<MemberProfileDto> | null) {
  if (!data) {
    return {valid: false, message: 'No data provided'};
  }

  if (!data.email || data.email.trim() === '') {
    return {valid: false, message: 'Email is required'};
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {valid: false, message: 'Invalid email format'};
  }

  return {valid: true, message: ''};
}
