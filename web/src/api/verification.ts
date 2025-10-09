
import { apiInstance } from '@/api/ApiInstance';
export async function sendReverificationEmail(email: string, role: 'member' | 'alumni' | 'sponsor' | 'admin', firstName: string) {
  try {
      return await apiInstance.post('/send-reverification', { email, role, firstName });
  } catch (e) {
    throw Error(`Error: ${e}`);
  }
}

export async function verifyPassword(email: string, password: string, role: 'member' | 'alumni' | 'sponsor' | 'admin') {
  try {
      return await apiInstance.post('/verify-password', { email, password, role });
  } catch (e) {
    throw Error(`Error: ${e}`);
  }
}