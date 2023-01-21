import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // The user that's currently being visited. Used to check if authenticated usr === visited user and display private UI components.
  visitedUser: null,
  // When selected topic is null, there is no selected topic and questions with about user's favorite topics will be displayed
  selectedTopic: null,
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setVisitedUser(state, { payload }) {
      state.visitedUser = payload;
    },

    setSelectedTopic(state, { payload }) {
      state.selectedTopic = payload;
    },
  },
});

export default globalSlice;
export const { actions: globalActions } = globalSlice;
