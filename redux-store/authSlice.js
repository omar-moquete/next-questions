import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    _setUser(state, { payload }) {
      state.user = payload;
    },

    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
  },
});

export const { actions: authActions } = authSlice;
export default authSlice;
