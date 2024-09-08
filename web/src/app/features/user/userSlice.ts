import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Role} from "@/app/type/role";

// Todo: Remove this duplicate type definition...
export type UserType = 'student' | 'sponsor' | 'alumni' | 'admin';

// Define the user state interface
export interface UserState {
  id: string;
  email: string;
  username: string;
  activated: boolean,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  desc?: string
  UserType?: Role // Allow for null (unauthenticated)
  // ... other user data (name, email, etc.) as needed
}

// Initial state
const initialState: UserState = {
  id: '',
  email: '',
  username: '',
  activated: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser() {
      return initialState;
    },
    // ... other reducers for user actions (e.g., login, logout, update profile)
  },
});

export const { setUserType, resetUser } = userSlice.actions;
export default userSlice.reducer;
