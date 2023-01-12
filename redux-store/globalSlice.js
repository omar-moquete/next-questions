import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // The user that's currently being visited. Used to check if authenticated usr === visited user and display private UI components.
  visitedUser: null,
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setVisitedUser(state, { payload }) {
      state.visitedUser = payload;
    },
  },
});

export default globalSlice;
export const { actions: globalActions } = globalSlice;
