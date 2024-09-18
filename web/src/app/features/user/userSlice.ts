import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from "@/app/type/role";

// Define the user state interface
export interface UserState {
  id: string;
  email: string;
  username: string;
  activated: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  desc?: string;
  userType?: Role; // Allow for null (unauthenticated)
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

// Create a slice with reducers
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser() {
      return initialState;
    },
    setUserType(state, action: PayloadAction<Role | undefined>) {
      state.userType = action.payload;
    },
    // ... other reducers for user actions (e.g., login, logout, update profile)
  },
});

// Export the actions and the reducer
export const { setUserType, resetUser } = userSlice.actions;
export default userSlice.reducer;
