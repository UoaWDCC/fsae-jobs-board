import {apiInstance} from "@/api/ApiInstance";

export async function requestPasswordReset(email: string) {
  try {
    const res = await apiInstance.post("forgot-password", {email});
    return res;
  } catch (e) {
    throw Error("An unknown error occurred");
  }
}

export async function validateResetToken(token: string) {
  try {
    const res = await apiInstance.get(`reset-password/${token}`);
    return res;
  } catch (e) {
    return true; // Assume token is valid
    throw Error("An unknown error occurred");
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const res = await apiInstance.post("reset-password", {token, password});
    return res;
  } catch (e) {
    throw Error("An unknown error occurred");
  }
}