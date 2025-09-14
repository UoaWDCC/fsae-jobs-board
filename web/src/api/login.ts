import { apiInstance } from '@/api/ApiInstance';

export async function login(email: string, password: string) {
  let role;
  try {
    const res = await apiInstance.get(`user/${email}/role`);
    role = res.data;

    if (!role) {
      throw Error('Invalid credentials');
    }
  } catch (e) {
    throw Error('Invalid credentials');
  }

  let loginUrl;
  if (role === 'admin') {
    loginUrl = 'login-admin';
  } else if (role === 'alumni') {
    loginUrl = 'login-alumni';
  } else if (role === 'member') {
    loginUrl = 'login-member';
  } else if (role === 'sponsor') {
    loginUrl = 'login-sponsor';
  } else {
    throw Error('Unknown login type');
  }

  try {
    const res = await apiInstance.post(loginUrl, {
      email,
      password,
    });
    // console.log(res.data);
    const { userId, token, verified, hasMissingInfo } = res.data;

    if (!verified) {
      return { role: 'unverified', id: userId, hasMissingInfo };
    } else {
      localStorage.setItem('accessToken', token);
      console.log(`Successfully logged in as UserID ${userId}`);
      console.log(role);
      return { role: role, id: userId, hasMissingInfo }; // Return role and missing info flag
    }
  } catch (e) {
    throw Error('Invalid credentials');
  }
}
