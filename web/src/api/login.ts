import {apiInstance} from "@/api/ApiInstance";

export async function login(email: string, password: string) {
  let userRole;
  try {
    const res = await apiInstance.get(`user/${email}/role`)
    userRole = res.data

    if (userRole == null) {
      throw Error("Invalid credentials");
    }
  } catch (e) {
    throw Error("Invalid credentials")
  }

  let loginUrl;
  console.log(userRole)
  if (userRole === 'admin') {
    loginUrl = 'login-admin'
  } else if (userRole === 'alumni') {
    loginUrl = 'login-alumni'
  } else if (userRole === 'member') {
    loginUrl = 'login-member'
  } else if (userRole === 'sponsor') {
    loginUrl = 'login-sponsor'
  } else {
    throw Error("Unknown login type")
  }

  try {
    const res = await apiInstance.post(loginUrl, {
      "email": email,
      "password": password
    })
    const {userId, token} = res.data;
    localStorage.setItem('accessToken', token)
    console.log(`Successfully logged in as UserID ${userId}`)
  } catch (e) {
    throw Error("Invalid credentials")
  }
}

export async function logout() {
  localStorage.removeItem('accessToken')
}
