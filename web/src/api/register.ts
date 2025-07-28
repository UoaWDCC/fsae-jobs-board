import {apiInstance} from "@/api/ApiInstance";
import {UserState} from "@/app/features/user/userSlice";
import {stringToRole} from "@/app/type/role";
import axios from "axios";

export interface createFSAEUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  desc: string;
}

export async function register_admin(createUserDto: createFSAEUserDto): Promise<UserState> {
  return register('register-admin', createUserDto)
}

export async function register_alumni(createUserDto: createFSAEUserDto): Promise<UserState> {
  return register('register-alumni', createUserDto)
}

export async function register_member(createUserDto: createFSAEUserDto): Promise<UserState> {
  return register('register-member', createUserDto)
}

export async function register_sponsor(createUserDto: createFSAEUserDto): Promise<UserState> {
  return register('register-sponsor', createUserDto)
}

async function register(url: string, createUserDto: createFSAEUserDto): Promise<UserState> {
  try {
    const res = await apiInstance.post(url, createUserDto)
    return {
      id: res.data.id,
      email: res.data.email,
      username: res.data.username,
      activated: res.data.activated,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      phoneNumber: res.data.phoneNumber,
      role: stringToRole(res.data.fsaeRole), // Convert this to Role enum
      desc: res.data.desc
    }
  } catch (e) {
    console.log(e)
    let errorMsg = 'Error creating admin';
    if (axios.isAxiosError(e) && e.response) {
      errorMsg = e.response.data.error.message || errorMsg;
    }
    // If errorMsg not null display it, else say generic error message
    errorMsg = errorMsg ? errorMsg : 'Error creating admin'
    throw Error(errorMsg)
  }
}
