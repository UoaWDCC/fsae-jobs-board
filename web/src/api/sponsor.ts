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

export const getSponsorMember = async (id: string) => {
  try {
    console.log(`Fetching user member with id: ${id}`);
    const response = await apiInstance.get(`/user/sponsor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user member with id: ${id}`, error);
    throw error;
  }
};

export const updateSponsorMember = async (id: string, updatedData: SponsorDTO) => {
  try {
    const response = await apiInstance.patch(`/user/sponsor/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user member with id: ${id}`, error);
    throw error;
  }
};

export const deleteSponsorMember = async (id: string) => {
  try {
    const response = await apiInstance.delete(`/user/sponsor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user member with id: ${id}`, error);
    throw error;
  }
};
