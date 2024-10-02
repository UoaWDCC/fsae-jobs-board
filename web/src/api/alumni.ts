import { apiInstance } from '@/api/ApiInstance';
import { stringToRole } from '@/app/type/role';

export interface alumniDto {
    id: string, 
    email: string, 
    phone: string, 
    username: string, 
    password: string, 
    activated: boolean,
    fsaeRole: stringToRole,
    firstName: string,
    lastName: string,
}

export const getAlumni = async (id: string) => {
    try {
        console.log(`fetching alumni ${id}`);
        const response = await apiInstance.get(`/profile/alumni/${id}`);
        const data  = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error fetching: ", error);
        throw error;
    }
}

export const deleteAlumni = async (id: string) => {
    try {
      console.log(`fetching alumni ${id}`);
      const response = await apiInstance.delete(`/profile/alumni/${id}`);
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log('Error deleting alumni: ', error);
      throw error;
    }
}