import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '@/app/type/role';


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
  role?: Role; // Allow for null (unauthenticated)  
  // ... other user data (name, email, etc.) as needed
}

// Initial state
const initialState: UserState = {
  id: '',
  email: '',
  username: '',
  activated: true,
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
    setRole(state, action: PayloadAction<Role>) {
      const role = action.payload as Role;
      state.role = role;
    },
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    }
    // ... other reducers for user actions (e.g., login, logout, update profile)
  },
});

export const { setRole, resetUser, setUser } = userSlice.actions;
export default userSlice.reducer;
