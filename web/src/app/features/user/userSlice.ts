import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type UserType = 'student' | 'sponsor' | 'alumni' | 'admin';

// Define the user state interface
interface UserState {
  userType: UserType | null; // Allow for null (unauthenticated)
  // ... other user data (name, email, etc.) as needed
}

// Initial state
const initialState: UserState = {
  userType: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<UserType>) => {
      // Type-safe payload
      state.userType = action.payload;
    },
    // ... other reducers for user actions (e.g., login, logout, update profile)
  },
});

export const { setUserType } = userSlice.actions;
export default userSlice.reducer;
