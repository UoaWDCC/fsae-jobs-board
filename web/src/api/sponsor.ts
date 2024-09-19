import { apiInstance } from '@/api/ApiInstance';
import { Role } from '@/app/type/role';

export interface SponsorDTO {
  id: string;
  email: string;
  username: string;
  password: string;
  activated: boolean;
  fsaeRole: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  desc: string;
  sponsorID: number;
  logo: string;
  websiteURL: string;
  tier: string;
  name: string;
  industry: string;
  additionalProp1: Record<string, any>; // This represents a flexible object type
}

export const getSponsorMember = async (id: number) => {
  try {
    const response = await apiInstance.get(`/user/member/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user member with id: ${id}`, error);
    throw error;
  }
};

export const updateSponsorMember = async (id: number, updatedData: SponsorDTO) => {
  try {
    const response = await apiInstance.patch(`/user/member/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user member with id: ${id}`, error);
    throw error;
  }
};

export const deleteSponsorMember = async (id: number) => {
  try {
    const response = await apiInstance.delete(`/user/member/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user member with id: ${id}`, error);
    throw error;
  }
};
